"""API views for the attendance module.

This module provides endpoints for three main areas of functionality:
1.  **Advisor Self-Service**:
    - `CheckInView`: Allows an advisor to check in for their shift.
    - `CheckOutView`: Allows an advisor to check out, finalizing their attendance.
    - `MeTodayView`: Provides a summary of the advisor's current day's schedule
      and attendance status, primarily for use in the mobile app.

2.  **Managerial Approvals**:
    - `ApprovalsListView`: Lists attendance-related requests (e.g., for
      late check-ins, out-of-geofence punches) for branch heads and admins.
    - `ApprovalsApproveView`: Endpoint to approve a request.
    - `ApprovalsRejectView`: Endpoint to reject a request.

3.  **Reporting**:
    - `StoreMonthlyReportView`: Generates a monthly attendance and payroll
      summary for all advisors in a specific store.
    - `MeMonthlyReportView`: Generates a personal monthly attendance summary
      for the requesting advisor.

The views enforce role-based permissions, handle geofence validation, and
integrate with the `AttendanceRequest` model to manage approval workflows.
"""

from datetime import date, datetime, timedelta
from typing import Optional

from django.utils import timezone
from rest_framework import parsers, permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer, BaseRenderer
from rest_framework.pagination import PageNumberPagination
from rest_framework.settings import api_settings

from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator
from django.http import HttpResponse
from django.db.models import Sum, Count, Case, When, IntegerField, F, Value, Q
from calendar import monthrange

from .models import Attendance, AttendanceRequest, Shift, resolve_planned_shift
from .permissions import (
    IsAdvisor,
    IsAuthenticatedRole,
    IsSystemAdmin,
    IsBranchHead,
)
from .serializers import (
    AttendanceSerializer,
    ShiftSerializer,
    AttendanceRequestSerializer,
    AttendanceRequestListSerializer,
)
from .filters import filter_approval_qs
from .utils import within_radius_m
from store.models import StoreGeofence
from django.contrib.auth import get_user_model

User = get_user_model()


class DummyCSVRenderer(BaseRenderer):
    media_type = "text/csv"
    format = "csv"
    charset = "utf-8"

    def render(
        self, data, accepted_media_type=None, renderer_context=None
    ):  # pragma: no cover - simple
        return data


# ---------------------------------------------------------------------------
# Helper utilities
# ---------------------------------------------------------------------------


def get_local_today() -> date:
    """Return today's date in the current timezone."""

    return timezone.localdate()


def get_shift_or_planned(user, shift_id: Optional[int]) -> Optional[Shift]:
    """Resolves the shift for the current day for a given user.

    This function first attempts to retrieve a specific, active shift if
    `shift_id` is provided. If `shift_id` is not given, it falls back to
    determining the user's planned shift for the current day using the
    `resolve_planned_shift` function.

    Args:
        user: The user instance for whom to resolve the shift.
        shift_id (Optional[int]): The primary key of a specific `Shift` to use.
            If None, the default planned shift is resolved.

    Returns:
        Optional[Shift]: The resolved `Shift` instance, or `None` if no
        active or planned shift is found for the user for the current day.
    """

    if shift_id:
        try:
            return Shift.objects.get(pk=shift_id, is_active=True)
        except Shift.DoesNotExist:  # pragma: no cover - defensive
            return None
    today = get_local_today()
    return resolve_planned_shift(user, today)


def ensure_open_attendance(user, store, att_date: date, shift: Shift) -> Attendance:
    """Retrieves or creates an open attendance record for a user.

    This function ensures that an `Attendance` record exists for the given user,
    store, date, and shift. If a record already exists, it is fetched. If not,
    a new one is created with a default status of 'OPEN'. This is crucial for
    the check-in process to have a record to attach data to.

    Args:
        user: The user for whom the attendance record is being ensured.
        store: The store associated with the attendance.
        att_date (date): The calendar date of the attendance.
        shift (Shift): The shift for the attendance.

    Returns:
        Attendance: The existing or newly created `Attendance` instance.
    """

    att, _ = Attendance.objects.get_or_create(
        user=user, store=store, date=att_date, shift=shift, defaults={"status": "OPEN"}
    )
    return att


def require_selfie(file) -> None:
    """Validates that a selfie photo file meets the required criteria.

    This helper function checks three conditions:
    1. The file must exist (`file` is not None).
    2. The file size must not exceed 3MB.
    3. The file's content type must start with 'image/'.

    Args:
        file: The file object to validate, typically from a request.

    Raises:
        serializers.ValidationError: If the file is missing, too large, or
            not a valid image type.
    """

    if not file:
        raise serializers.ValidationError("Selfie photo is required.")
    if getattr(file, "size", 0) > 3 * 1024 * 1024:
        raise serializers.ValidationError("Photo too large (limit 3MB).")
    content_type = getattr(file, "content_type", "") or ""
    if not content_type.startswith("image/"):
        raise serializers.ValidationError("Invalid image type.")


def _append_note(att: Attendance, note: Optional[str]) -> None:
    """Appends a new note to an attendance record's notes field.

    If the attendance record already has notes, the new note is appended on a
    new line. If there are no existing notes, the new note becomes the initial
    note. This function modifies the `notes` attribute of the `att` object
    in-place.

    Args:
        att (Attendance): The attendance instance to modify.
        note (Optional[str]): The note string to append. If None or empty,
            the function does nothing.
    """

    if not note:
        return
    att.notes = f"{att.notes}\n{note}" if att.notes else note


# ---------------------------------------------------------------------------
# Report helper utilities
# ---------------------------------------------------------------------------


def parse_month_param(request):
    """Parses a 'month' query parameter (YYYY-MM) into start and end dates.

    This utility reads the `?month=YYYY-MM` query parameter from a request.
    If the parameter is not provided or is invalid, it defaults to the current
    month in the local timezone.

    Args:
        request: The Django request object.

    Returns:
        tuple[date, date]: A tuple containing the first day and the last day
        of the specified or current month.

    Raises:
        ValueError: If the month string is provided but in an invalid format.
    """

    month_str = request.query_params.get("month") or request.GET.get("month")
    if month_str:
        try:
            dt = datetime.strptime(month_str, "%Y-%m")
            year, month = dt.year, dt.month
        except (TypeError, ValueError):
            raise ValueError("Invalid month format. Use YYYY-MM.")
    else:
        today = timezone.localdate()
        year, month = today.year, today.month
    first_day = date(year, month, 1)
    last_day = date(year, month, monthrange(year, month)[1])
    return first_day, last_day


def csv_response(filename: str, rows: list[list[str]]):
    """Constructs an `HttpResponse` object for a CSV file download.

    This helper takes a list of lists (representing rows) and generates a
    CSV file in memory. It then creates an `HttpResponse` with the correct
    `Content-Type` and `Content-Disposition` headers to trigger a file
    download in the browser.

    Args:
        filename (str): The desired filename for the downloaded CSV file.
        rows (list[list[str]]): A list where each inner list represents a row
            in the CSV. The first inner list is typically the header row.

    Returns:
        HttpResponse: A response object containing the CSV data.
    """

    from io import StringIO
    import csv

    buffer = StringIO()
    writer = csv.writer(buffer)
    for row in rows:
        writer.writerow(row)
    resp = HttpResponse(buffer.getvalue(), content_type="text/csv")
    resp["Content-Disposition"] = f'attachment; filename="{filename}"'
    return resp


def store_scope_or_403(request_user, store_id: int):
    """Enforces store-level access control for managers.

    This function checks if a user has the permission to access data for a
    specific store. The rules are:
    - Superusers and 'system_admin' roles can access any store.
    - 'branch_head' role can only access data for their own assigned store.
    - 'advisor' and other roles are denied access.

    Args:
        request_user: The user instance making the request.
        store_id (int): The primary key of the store being accessed.

    Returns:
        int: The `store_id` if access is permitted.

    Raises:
        PermissionDenied: If the user does not have access to the specified store.
    """

    from rest_framework.exceptions import PermissionDenied

    role = getattr(request_user, "role", None)
    if getattr(request_user, "is_superuser", False) or role == "system_admin":
        return store_id
    if role == "branch_head" and getattr(request_user, "store_id", None) == store_id:
        return store_id
    raise PermissionDenied()


# ---------------------------------------------------------------------------
# API Views
# ---------------------------------------------------------------------------


class CheckInView(APIView):
    """Handles the advisor self-service check-in process.

    This view allows an authenticated advisor to check in for their shift.
    The advisor must provide their current geolocation (latitude and longitude)
    and a selfie photo.

    The process involves:
    1.  Validating the input data, including the mandatory selfie.
    2.  Resolving the advisor's shift for the day.
    3.  Fetching or creating an `Attendance` record for the day.
    4.  Recording the check-in time, location, and photo.
    5.  Performing geofence validation. If the advisor is outside the store's
        geofence, an `AttendanceRequest` is created and the attendance status
        is set to `PENDING_APPROVAL`.
    6.  Checking for lateness. If the check-in is beyond the grace period,
        a `LATE` request is created and the status is set to `PENDING_APPROVAL`.

    A successful check-in returns the created or updated `Attendance` record.

    Permissions:
        - Must be an authenticated user.
        - User must have the 'advisor' role.

    Parsers:
        - Handles multipart/form-data for file uploads.
    """

    permission_classes = [permissions.IsAuthenticated, IsAdvisor]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    class InputSerializer(serializers.Serializer):
        shift_id = serializers.IntegerField(required=False)
        lat = serializers.FloatField()
        lon = serializers.FloatField()
        photo = serializers.FileField()
        note = serializers.CharField(required=False, allow_blank=True)

    def post(self, request, *args, **kwargs):  # noqa: D401 - DRF signature
        """Handles the POST request for a check-in action.

        Args:
            request: The Django HTTP request object, containing the user,
                and multipart form data with 'lat', 'lon', 'photo', and
                optional 'shift_id' and 'note'.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: A DRF Response object.
                - On success (201 CREATED): The serialized `Attendance` data.
                - On failure (400 BAD REQUEST): An error detail message if the
                  user has no store, no shift is planned, or they are already
                  checked in.
                - On validation error: A standard DRF validation error response.
        """
        data_ser = self.InputSerializer(data=request.data)
        data_ser.is_valid(raise_exception=True)
        data = data_ser.validated_data

        user = request.user
        store = getattr(user, "store", None)
        if not store:
            return Response(
                {"detail": "User store not set."}, status=status.HTTP_400_BAD_REQUEST
            )

        today = get_local_today()
        planned_shift = resolve_planned_shift(user, today)
        shift = get_shift_or_planned(user, data.get("shift_id"))
        if not shift:
            return Response(
                {"detail": "No planned shift for today."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        att = ensure_open_attendance(user, store, today, shift)
        if att.check_in:
            return Response(
                {"detail": "Already checked in."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Photo validation
        require_selfie(data.get("photo"))
        att.check_in_photo = data["photo"]

        now = timezone.now()
        att.check_in = now
        att.check_in_lat = data.get("lat")
        att.check_in_lon = data.get("lon")

        note = data.get("note")
        if (
            data.get("shift_id")
            and planned_shift
            and shift.id != getattr(planned_shift, "id", None)
        ):
            _append_note(att, "Shift override from planned schedule")
        _append_note(att, note)

        geofence = getattr(store, "geofence", None)
        if geofence and geofence.is_active:
            if not within_radius_m(data.get("lat"), data.get("lon"), geofence):
                if not AttendanceRequest.objects.filter(
                    attendance=att, type="OUTSIDE_GEOFENCE", status="PENDING"
                ).exists():
                    AttendanceRequest.objects.create(
                        attendance=att,
                        type="OUTSIDE_GEOFENCE",
                        requested_by=user,
                        reason=note or "",
                    )
                att.status = "PENDING_APPROVAL"

        # Late beyond grace
        shift_start = timezone.make_aware(
            datetime.combine(att.date, shift.start_time),
            timezone.get_current_timezone(),
        )
        if now > shift_start + timedelta(minutes=15):
            if not AttendanceRequest.objects.filter(
                attendance=att, type="LATE", status="PENDING"
            ).exists():
                AttendanceRequest.objects.create(
                    attendance=att, type="LATE", requested_by=user, reason=note or ""
                )
            att.status = "PENDING_APPROVAL"

        att.save()
        return Response(AttendanceSerializer(att).data, status=status.HTTP_201_CREATED)


class CheckOutView(APIView):
    """Handles the advisor self-service check-out process.

    This view allows an authenticated advisor to check out from their shift,
    finalizing their attendance for the day. The advisor must provide the ID
    of their open `Attendance` record, their current geolocation, and a selfie.

    The process involves:
    1.  Validating the input data, including the mandatory selfie.
    2.  Locating the specified `Attendance` record, ensuring it's open for checkout.
    3.  Recording the check-out time, location, and photo.
    4.  Calling `apply_grace_and_status` to compute final metrics like worked
        minutes, late minutes, and status (e.g., 'PRESENT', 'HALF_DAY').
    5.  If an overtime request is submitted (`ot_request_minutes`), an `OT`
        type `AttendanceRequest` is created for manager approval.

    A successful check-out returns the finalized `Attendance` record.

    Permissions:
        - Must be an authenticated user.
        - User must have the 'advisor' role.

    Parsers:
        - Handles multipart/form-data for file uploads.
    """

    permission_classes = [permissions.IsAuthenticated, IsAdvisor]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    class InputSerializer(serializers.Serializer):
        attendance_id = serializers.IntegerField()
        lat = serializers.FloatField()
        lon = serializers.FloatField()
        photo = serializers.FileField()
        ot_request_minutes = serializers.IntegerField(required=False, min_value=1)
        note = serializers.CharField(required=False, allow_blank=True)

    def post(self, request, *args, **kwargs):  # noqa: D401
        """Handles the POST request for a check-out action.

        Args:
            request: The Django HTTP request object, containing form data with
                'attendance_id', 'lat', 'lon', 'photo', and optional
                'ot_request_minutes' and 'note'.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: A DRF Response object.
                - On success (200 OK): The serialized `Attendance` data.
                - On failure (400 BAD REQUEST): An error detail message if the
                  attendance record is not found or not open for checkout.
                - On validation error: A standard DRF validation error response.
        """
        data_ser = self.InputSerializer(data=request.data)
        data_ser.is_valid(raise_exception=True)
        data = data_ser.validated_data

        user = request.user
        try:
            att = Attendance.objects.get(id=data["attendance_id"], user=user)
        except Attendance.DoesNotExist:
            return Response(
                {"detail": "Attendance not found."}, status=status.HTTP_400_BAD_REQUEST
            )

        if (
            att.status not in {"OPEN", "PENDING_APPROVAL"}
            or not att.check_in
            or att.check_out
        ):
            return Response(
                {"detail": "Attendance not open for checkout."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        require_selfie(data.get("photo"))
        att.check_out_photo = data["photo"]

        now = timezone.now()
        att.check_out = now
        att.check_out_lat = data.get("lat")
        att.check_out_lon = data.get("lon")

        prev_status = att.status
        att.apply_grace_and_status(grace_minutes=15, halfday_threshold=360)
        if prev_status == "PENDING_APPROVAL":
            att.status = "PENDING_APPROVAL"
        att.save()

        ot_minutes = data.get("ot_request_minutes")
        note = data.get("note")
        if ot_minutes and ot_minutes > 0:
            if not AttendanceRequest.objects.filter(
                attendance=att, type="OT", status="PENDING"
            ).exists():
                AttendanceRequest.objects.create(
                    attendance=att,
                    type="OT",
                    requested_by=user,
                    reason=note or "",
                    meta={"requested_minutes": int(ot_minutes)},
                )
        if note:
            _append_note(att, note)

        return Response(AttendanceSerializer(att).data, status=status.HTTP_200_OK)


class MeTodayView(APIView):
    """Provides a summary of the advisor's current day's attendance status.

    This view is designed for the advisor-facing mobile app to quickly
    determine the state of the current day. It returns information about the
    planned shift, check-in/out status, and key timestamps.

    The `cta_state` (Call to Action state) field is particularly important for
    driving the app's UI:
    - `start`: The advisor has a shift planned but has not yet checked in.
    - `end`: The advisor has checked in but has not yet checked out.
    - `complete`: The advisor has completed their check-in and check-out.

    Permissions:
        - Must be an authenticated user.
        - User must have the 'advisor' role.
    """

    permission_classes = [permissions.IsAuthenticated, IsAdvisor]

    def get(self, request, *args, **kwargs):  # noqa: D401
        """Handles the GET request for the daily summary.

        Args:
            request: The Django HTTP request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: A DRF response object (200 OK) containing a summary with
            fields like `cta_state`, `attendance_id`, `shift_window`,
            `can_check_in_from`, and `server_time`.
        """
        user = request.user
        today = get_local_today()
        planned_shift = resolve_planned_shift(user, today)

        attendance = None
        if planned_shift:
            attendance = Attendance.objects.filter(
                user=user, date=today, shift=planned_shift
            ).first()

        shift_window = None
        can_check_in_from = None
        early_checkin_window_min = 15
        cta_state = "start"
        attendance_id = None

        if planned_shift:
            start = timezone.make_aware(
                datetime.combine(today, planned_shift.start_time)
            )
            end = timezone.make_aware(datetime.combine(today, planned_shift.end_time))
            if planned_shift.is_overnight or end <= start:
                end += timedelta(days=1)
            shift_window = {"start": start.isoformat(), "end": end.isoformat()}
            can_check_in_from = (
                start - timedelta(minutes=early_checkin_window_min)
            ).isoformat()

            if attendance:
                attendance_id = attendance.id
                if attendance.check_out:
                    cta_state = "complete"
                elif attendance.check_in:
                    cta_state = "end"

        return Response(
            {
                "cta_state": cta_state,
                "attendance_id": attendance_id,
                "shift_window": shift_window,
                "can_check_in_from": can_check_in_from,
                "banner": None,
                "early_checkin_window_min": early_checkin_window_min,
                "server_time": timezone.now().isoformat(),
            }
        )


# ---------------------------------------------------------------------------
# Approvals API
# ---------------------------------------------------------------------------


def manager_scoped_queryset(user):
    """Constructs a queryset for `AttendanceRequest` scoped to a manager's role.

    This function builds a base queryset for attendance approval requests and
    filters it based on the user's role to ensure managers can only see the
    requests they are permitted to action.
    - **System Admins/Superusers**: Can see all requests across all stores.
    - **Branch Heads**: Can only see requests for advisors within their
      assigned store.
    - **Other roles**: Cannot see any approval requests.

    Args:
        user: The user instance (typically `request.user`) for whom the
            queryset should be scoped.

    Returns:
        QuerySet: An `AttendanceRequest` queryset filtered according to the
        user's permissions. Returns an empty queryset for unauthorized roles.
    """

    qs = AttendanceRequest.objects.select_related(
        "attendance",
        "attendance__user",
        "attendance__store",
        "requested_by",
        "decided_by",
    )
    if user.is_superuser or getattr(user, "role", None) == "system_admin":
        return qs
    if getattr(user, "role", None) == "branch_head" and getattr(user, "store_id", None):
        return qs.filter(attendance__user__store_id=user.store_id)
    return qs.none()


class ApprovalsListView(APIView):
    """Lists attendance approval requests for managers.

    This view provides a paginated list of `AttendanceRequest` objects, scoped
    to the permissions of the requesting user (system admin or branch head).
    It supports filtering via query parameters to allow managers to easily
    find specific requests.

    Supported query parameters for filtering:
    - `type`: (e.g., 'LATE', 'OT')
    - `status`: ('PENDING', 'APPROVED', 'REJECTED')
    - `store`: Store ID (for system admins)
    - `user`: User ID
    - `date_from`: (YYYY-MM-DD)
    - `date_to`: (YYYY-MM-DD)

    Permissions:
        - Must be an authenticated user.
        - Access is implicitly handled by `manager_scoped_queryset`, which
          returns an empty list for unauthorized roles.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):  # noqa: D401
        """Handles the GET request to list and filter approval requests.

        Args:
            request: The Django HTTP request object, which may contain filter
                query parameters.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: A DRF paginated response object (200 OK) containing the
            list of `AttendanceRequest` data.
        """
        qs = manager_scoped_queryset(request.user)
        qs = filter_approval_qs(request, qs).order_by("-created_at")

        pagination_class = api_settings.DEFAULT_PAGINATION_CLASS
        if pagination_class:
            paginator = pagination_class()
            page = paginator.paginate_queryset(qs, request, view=self)
            ser = AttendanceRequestListSerializer(page, many=True)
            return Response(
                {
                    "count": paginator.page.paginator.count,
                    "next": paginator.get_next_link(),
                    "previous": paginator.get_previous_link(),
                    "results": ser.data,
                }
            )

        # Fallback simple pagination
        page_number = request.query_params.get("page", 1)
        page_size = request.query_params.get("page_size", 10)
        p = Paginator(qs, page_size)
        page_obj = p.get_page(page_number)
        ser = AttendanceRequestListSerializer(page_obj.object_list, many=True)
        next_link = page_obj.next_page_number() if page_obj.has_next() else None
        prev_link = page_obj.previous_page_number() if page_obj.has_previous() else None
        return Response(
            {
                "count": p.count,
                "next": next_link,
                "previous": prev_link,
                "results": ser.data,
            }
        )


class ApprovalsApproveView(APIView):
    """Approves a specific attendance request.

    This endpoint allows a manager (system admin or branch head) to approve a
    pending `AttendanceRequest`. The request is identified by its primary key
    in the URL.

    The view uses `manager_scoped_queryset` to ensure that managers can only
    approve requests within their permitted scope. Upon successful approval,
    the request's status is updated, and any necessary side-effects (like
    updating OT minutes) are applied via the `.approve()` method on the model.

    Permissions:
        - Must be an authenticated user.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):  # noqa: D401
        """Handles the POST request to approve an `AttendanceRequest`.

        Args:
            request: The Django HTTP request object.
            pk (int): The primary key of the `AttendanceRequest` to approve.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: A DRF response object.
                - On success (200 OK): The serialized, updated `AttendanceRequest`.
                - On failure (404 NOT FOUND): If the request does not exist or
                  is outside the manager's scope.
        """
        qs = manager_scoped_queryset(request.user)
        obj = get_object_or_404(qs, pk=pk)
        obj.approve(actor=request.user)
        return Response(
            AttendanceRequestSerializer(obj).data, status=status.HTTP_200_OK
        )


class ApprovalsRejectView(APIView):
    """Rejects a specific attendance request.

    This endpoint allows a manager (system admin or branch head) to reject a
    pending `AttendanceRequest`. The request is identified by its primary key
    in the URL.

    The view uses `manager_scoped_queryset` to ensure that managers can only
    reject requests within their permitted scope. Upon successful rejection,
    the request's status is updated to `REJECTED`.

    Permissions:
        - Must be an authenticated user.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):  # noqa: D401
        """Handles the POST request to reject an `AttendanceRequest`.

        Args:
            request: The Django HTTP request object.
            pk (int): The primary key of the `AttendanceRequest` to reject.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: A DRF response object.
                - On success (200 OK): The serialized, updated `AttendanceRequest`.
                - On failure (404 NOT FOUND): If the request does not exist or
                  is outside the manager's scope.
        """
        qs = manager_scoped_queryset(request.user)
        obj = get_object_or_404(qs, pk=pk)
        obj.reject(actor=request.user)
        return Response(
            AttendanceRequestSerializer(obj).data, status=status.HTTP_200_OK
        )


# ---------------------------------------------------------------------------
# Reports API Views
# ---------------------------------------------------------------------------


class StoreMonthlyReportView(APIView):
    """Generates a monthly attendance and payroll report for a single store.

    This view aggregates attendance data for all advisors within a specified
    store for a given month. It calculates totals for shifts, present/absent
    days, worked minutes, and overtime. It also computes an estimated gross
    pay for each advisor based on their hourly rate.

    The report can be retrieved as a JSON object or downloaded as a CSV file
    by appending `?format=csv` to the URL.

    Permissions:
        - Must be an authenticated user.
        - System admins can access any store.
        - Branch heads can only access their own store.

    Renderers:
        - Supports both JSON and CSV output.
    """
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [JSONRenderer, DummyCSVRenderer]

    def get(self, request, store_id, *args, **kwargs):  # noqa: D401
        """Handles the GET request for the store monthly report.

        Args:
            request: The Django HTTP request object. Can include `?month=YYYY-MM`
                and `?format=csv` query parameters.
            store_id (int): The primary key of the store for the report.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: A DRF Response object (200 OK) with the report data in
            JSON format, or an HttpResponse with CSV data if requested.
            Returns a 403 Forbidden if the user is not allowed to access the
            store, or a 400 Bad Request for an invalid month format.
        """
        store_scope_or_403(request.user, store_id)
        try:
            month_start, month_end = parse_month_param(request)
        except ValueError as exc:  # pragma: no cover - defensive
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        qs = Attendance.objects.filter(
            store_id=store_id, date__gte=month_start, date__lte=month_end
        ).select_related("user", "user__payroll_profile", "shift")

        qs = (
            qs.values(
                "user_id", "user__first_name", "user__last_name", "user__username"
            )
            .annotate(
                total_shifts=Count("id"),
                present_days=Count("id", filter=Q(status="PRESENT")),
                half_days=Count("id", filter=Q(status="HALF_DAY")),
                absents=Count("id", filter=Q(status="ABSENT")),
                worked_minutes=Sum("worked_minutes"),
                approved_ot_minutes=Sum("ot_minutes"),
                hourly_rate=F("user__payroll_profile__hourly_rate"),
            )
            .order_by("user__first_name", "user__last_name", "user__username")
        )

        advisors = []
        totals = {"worked_minutes": 0, "approved_ot_minutes": 0, "gross_pay": 0.0}
        for row in qs:
            first = row.get("user__first_name") or ""
            last = row.get("user__last_name") or ""
            name = f"{first} {last}".strip() or row.get("user__username")

            worked = row.get("worked_minutes") or 0
            ot = row.get("approved_ot_minutes") or 0
            rate = row.get("hourly_rate") or 0

            payable_hours = round((worked + ot) / 60.0, 2)
            gross_pay = round(payable_hours * float(rate), 2)

            advisors.append(
                {
                    "user_id": row["user_id"],
                    "name": name,
                    "username": row.get("user__username"),
                    "total_shifts": row.get("total_shifts", 0),
                    "present_days": row.get("present_days", 0),
                    "half_days": row.get("half_days", 0),
                    "absents": row.get("absents", 0),
                    "worked_minutes": worked,
                    "approved_ot_minutes": ot,
                    "payable_hours": payable_hours,
                    "hourly_rate": str(rate),
                    "gross_pay": gross_pay,
                }
            )

            totals["worked_minutes"] += worked
            totals["approved_ot_minutes"] += ot
            totals["gross_pay"] += gross_pay

        month_str = month_start.strftime("%Y-%m")
        data = {
            "store_id": store_id,
            "month": month_str,
            "range": {"start": month_start.isoformat(), "end": month_end.isoformat()},
            "advisors": advisors,
            "totals": {
                "worked_minutes": totals["worked_minutes"],
                "approved_ot_minutes": totals["approved_ot_minutes"],
                "gross_pay": round(totals["gross_pay"], 2),
            },
        }

        if request.query_params.get("format") == "csv":
            rows = [
                [
                    "User ID",
                    "Name",
                    "Username",
                    "Total Shifts",
                    "Present",
                    "Half-Day",
                    "Absent",
                    "Worked Minutes",
                    "OT Minutes",
                    "Payable Hours",
                    "Hourly Rate",
                    "Gross Pay",
                ]
            ]
            for a in advisors:
                rows.append(
                    [
                        a["user_id"],
                        a["name"],
                        a["username"],
                        a["total_shifts"],
                        a["present_days"],
                        a["half_days"],
                        a["absents"],
                        a["worked_minutes"],
                        a["approved_ot_minutes"],
                        a["payable_hours"],
                        a["hourly_rate"],
                        a["gross_pay"],
                    ]
                )
            filename = f"store_{store_id}_{month_start.strftime('%Y%m')}.csv"
            return csv_response(filename, rows)

        return Response(data)


class MeMonthlyReportView(APIView):
    """Generates a personal monthly attendance report for the requesting advisor.

    This view provides a detailed monthly summary for the authenticated advisor.
    It includes an overall summary of shifts, attendance statuses, worked hours,
    and estimated pay, as well as a day-by-day breakdown of their attendance.

    The report can be retrieved as a JSON object or downloaded as a CSV file
    by appending `?format=csv` to the URL.

    Permissions:
        - Must be an authenticated user.
        - User must have the 'advisor' role.

    Renderers:
        - Supports both JSON and CSV output.
    """
    permission_classes = [permissions.IsAuthenticated, IsAdvisor]
    renderer_classes = [JSONRenderer, DummyCSVRenderer]

    def get(self, request, *args, **kwargs):  # noqa: D401
        """Handles the GET request for the personal monthly report.

        Args:
            request: The Django HTTP request object. Can include `?month=YYYY-MM`
                and `?format=csv` query parameters.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: A DRF Response object (200 OK) with the report data in
            JSON format, or an HttpResponse with CSV data if requested.
            Returns a 400 Bad Request for an invalid month format.
        """
        user = request.user
        try:
            month_start, month_end = parse_month_param(request)
        except ValueError as exc:  # pragma: no cover - defensive
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        qs = (
            Attendance.objects.filter(
                user=user, date__gte=month_start, date__lte=month_end
            )
            .select_related("shift")
            .order_by("date")
        )

        agg = qs.aggregate(
            total_shifts=Count("id"),
            present_days=Count("id", filter=Q(status="PRESENT")),
            half_days=Count("id", filter=Q(status="HALF_DAY")),
            absents=Count("id", filter=Q(status="ABSENT")),
            worked_minutes=Sum("worked_minutes"),
            approved_ot_minutes=Sum("ot_minutes"),
        )

        worked = agg.get("worked_minutes") or 0
        ot = agg.get("approved_ot_minutes") or 0
        rate = getattr(getattr(user, "payroll_profile", None), "hourly_rate", 0)
        payable_hours = round((worked + ot) / 60.0, 2)
        gross_pay = round(payable_hours * float(rate), 2)

        summary = {
            "total_shifts": agg.get("total_shifts", 0) or 0,
            "present_days": agg.get("present_days", 0) or 0,
            "half_days": agg.get("half_days", 0) or 0,
            "absents": agg.get("absents", 0) or 0,
            "worked_minutes": worked,
            "approved_ot_minutes": ot,
            "payable_hours": payable_hours,
            "hourly_rate": str(rate),
            "gross_pay": gross_pay,
        }

        by_day = []
        for att in qs:
            by_day.append(
                {
                    "date": att.date.isoformat(),
                    "shift": getattr(att.shift, "name", None),
                    "status": att.status,
                    "worked_minutes": att.worked_minutes,
                    "ot_minutes": att.ot_minutes,
                }
            )

        month_str = month_start.strftime("%Y-%m")
        data = {
            "user_id": user.id,
            "name": user.get_full_name() or user.username,
            "month": month_str,
            "range": {"start": month_start.isoformat(), "end": month_end.isoformat()},
            "summary": summary,
            "by_day": by_day,
        }

        if request.query_params.get("format") == "csv":
            rows = [["Date", "Shift", "Status", "Worked Minutes", "OT Minutes"]]
            for d in by_day:
                rows.append(
                    [
                        d["date"],
                        d["shift"],
                        d["status"],
                        d["worked_minutes"],
                        d["ot_minutes"],
                    ]
                )
            filename = f"me_{month_start.strftime('%Y%m')}.csv"
            return csv_response(filename, rows)

        return Response(data)


__all__ = [
    "CheckInView",
    "CheckOutView",
    "MeTodayView",
    "ApprovalsListView",
    "ApprovalsApproveView",
    "ApprovalsRejectView",
    "StoreMonthlyReportView",
    "MeMonthlyReportView",
]
