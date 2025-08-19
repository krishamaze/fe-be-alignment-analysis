"""Attendance API endpoints for check-in/out and daily self view.

These endpoints implement advisor self-service attendance punching with a
mandatory selfie photo. Late punches beyond the 15 minute grace window and
outside-geofence punches create ``AttendanceRequest`` objects and place the
attendance record in ``PENDING_APPROVAL`` status until a manager decides the
request (manager APIs arrive in a later phase).

Worked minutes are rounded to the nearest five minutes and a half-day is
considered anything under six hours of work (360 minutes).
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

    def render(self, data, accepted_media_type=None, renderer_context=None):  # pragma: no cover - simple
        return data


# ---------------------------------------------------------------------------
# Helper utilities
# ---------------------------------------------------------------------------


def get_local_today() -> date:
    """Return today's date in the current timezone."""

    return timezone.localdate()


def get_shift_or_planned(user, shift_id: Optional[int]) -> Optional[Shift]:
    """Return an active :class:`Shift` for ``shift_id`` or the planned shift.

    If ``shift_id`` is provided the corresponding active shift is returned.
    Otherwise the helper resolves the planned shift for today using
    :func:`resolve_planned_shift`.  ``None`` is returned if no shift could be
    resolved.
    """

    if shift_id:
        try:
            return Shift.objects.get(pk=shift_id, is_active=True)
        except Shift.DoesNotExist:  # pragma: no cover - defensive
            return None
    today = get_local_today()
    return resolve_planned_shift(user, today)


def ensure_open_attendance(user, store, att_date: date, shift: Shift) -> Attendance:
    """Fetch or create an ``OPEN`` attendance record for the given data."""

    att, _ = Attendance.objects.get_or_create(
        user=user, store=store, date=att_date, shift=shift, defaults={"status": "OPEN"}
    )
    return att


def require_selfie(file) -> None:
    """Validate that a selfie file is present and looks like an image.

    The API requires a selfie for both check-in and check-out.  Images larger
    than roughly 3MB or non-image content types are rejected.
    """

    if not file:
        raise serializers.ValidationError("Selfie photo is required.")
    if getattr(file, "size", 0) > 3 * 1024 * 1024:
        raise serializers.ValidationError("Photo too large (limit 3MB).")
    content_type = getattr(file, "content_type", "") or ""
    if not content_type.startswith("image/"):
        raise serializers.ValidationError("Invalid image type.")


def _append_note(att: Attendance, note: Optional[str]) -> None:
    """Append ``note`` to ``att.notes`` with a newline if needed."""

    if not note:
        return
    att.notes = f"{att.notes}\n{note}" if att.notes else note


# ---------------------------------------------------------------------------
# Report helper utilities
# ---------------------------------------------------------------------------

def parse_month_param(request):
    """
    Parse ?month=YYYY-MM; default to local current month.
    Return (month_start_date, month_end_date), both date objects inclusive.
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
    """
    Return a HttpResponse with text/csv for given rows. First row is headers.
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
    """
    If system admin -> ok. If branch_head -> require request_user.store_id == store_id else 403.
    Advisors never allowed -> 403.
    Return store_id if allowed.
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
    """Handle advisor self check-in.

    The advisor must supply a selfie photo.  Late arrivals (beyond the 15 minute
    grace) or punches outside the store geofence create pending
    ``AttendanceRequest`` objects and mark the attendance record as
    ``PENDING_APPROVAL`` until reviewed by a manager.
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
        data_ser = self.InputSerializer(data=request.data)
        data_ser.is_valid(raise_exception=True)
        data = data_ser.validated_data

        user = request.user
        store = getattr(user, "store", None)
        if not store:
            return Response({"detail": "User store not set."}, status=status.HTTP_400_BAD_REQUEST)

        today = get_local_today()
        planned_shift = resolve_planned_shift(user, today)
        shift = get_shift_or_planned(user, data.get("shift_id"))
        if not shift:
            return Response({"detail": "No planned shift for today."}, status=status.HTTP_400_BAD_REQUEST)

        att = ensure_open_attendance(user, store, today, shift)
        if att.check_in:
            return Response({"detail": "Already checked in."}, status=status.HTTP_400_BAD_REQUEST)

        # Photo validation
        require_selfie(data.get("photo"))
        att.check_in_photo = data["photo"]

        now = timezone.now()
        att.check_in = now
        att.check_in_lat = data.get("lat")
        att.check_in_lon = data.get("lon")

        note = data.get("note")
        if data.get("shift_id") and planned_shift and shift.id != getattr(planned_shift, "id", None):
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
            datetime.combine(att.date, shift.start_time), timezone.get_current_timezone()
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
    """Handle advisor self check-out.

    A selfie photo is mandatory.  Worked minutes are rounded to the nearest
    five and ``apply_grace_and_status`` computes late/early/worked metrics.  OT
    minutes may be requested and will await manager approval.
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
        data_ser = self.InputSerializer(data=request.data)
        data_ser.is_valid(raise_exception=True)
        data = data_ser.validated_data

        user = request.user
        try:
            att = Attendance.objects.get(id=data["attendance_id"], user=user)
        except Attendance.DoesNotExist:
            return Response({"detail": "Attendance not found."}, status=status.HTTP_400_BAD_REQUEST)

        if att.status not in {"OPEN", "PENDING_APPROVAL"} or not att.check_in or att.check_out:
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
    """Return today's planned shift and attendance for the requesting advisor."""

    permission_classes = [permissions.IsAuthenticated, IsAdvisor]

    def get(self, request, *args, **kwargs):  # noqa: D401
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
            start = timezone.make_aware(datetime.combine(today, planned_shift.start_time))
            end = timezone.make_aware(datetime.combine(today, planned_shift.end_time))
            if planned_shift.is_overnight or end <= start:
                end += timedelta(days=1)
            shift_window = {"start": start.isoformat(), "end": end.isoformat()}
            can_check_in_from = (start - timedelta(minutes=early_checkin_window_min)).isoformat()

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
    """Return an approvals queryset scoped for the given ``user``."""

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
    """List approval requests for system admins and branch heads.

    Supported query params: ``type``, ``status``, ``store``, ``user``,
    ``date_from`` and ``date_to``.

    Endpoints (no trailing slashes)::

        /api/attendance/approvals
        /api/attendance/approvals/{id}/approve
        /api/attendance/approvals/{id}/reject
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):  # noqa: D401
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
    """Approve a specific :class:`AttendanceRequest`."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):  # noqa: D401
        qs = manager_scoped_queryset(request.user)
        obj = get_object_or_404(qs, pk=pk)
        obj.approve(actor=request.user)
        return Response(AttendanceRequestSerializer(obj).data, status=status.HTTP_200_OK)


class ApprovalsRejectView(APIView):
    """Reject a specific :class:`AttendanceRequest`."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):  # noqa: D401
        qs = manager_scoped_queryset(request.user)
        obj = get_object_or_404(qs, pk=pk)
        obj.reject(actor=request.user)
        return Response(AttendanceRequestSerializer(obj).data, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Reports API Views
# ---------------------------------------------------------------------------


class StoreMonthlyReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [JSONRenderer, DummyCSVRenderer]

    def get(self, request, store_id, *args, **kwargs):  # noqa: D401
        store_scope_or_403(request.user, store_id)
        try:
            month_start, month_end = parse_month_param(request)
        except ValueError as exc:  # pragma: no cover - defensive
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        qs = (
            Attendance.objects.filter(
                store_id=store_id, date__gte=month_start, date__lte=month_end
            )
            .select_related("user", "user__payroll_profile", "shift")
        )

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
    permission_classes = [permissions.IsAuthenticated, IsAdvisor]
    renderer_classes = [JSONRenderer, DummyCSVRenderer]

    def get(self, request, *args, **kwargs):  # noqa: D401
        user = request.user
        try:
            month_start, month_end = parse_month_param(request)
        except ValueError as exc:  # pragma: no cover - defensive
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        qs = Attendance.objects.filter(
            user=user, date__gte=month_start, date__lte=month_end
        ).select_related("shift").order_by("date")

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

