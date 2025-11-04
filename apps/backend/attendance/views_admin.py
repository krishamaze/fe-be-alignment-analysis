from datetime import date, timedelta

from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

from .models import (
    Shift,
    AdvisorSchedule,
    WeekOff,
    ScheduleException,
    AdvisorPayrollProfile,
)
from store.models import StoreGeofence
from .serializers import (
    ShiftAdminSerializer,
    AdvisorScheduleAdminSerializer,
    AdvisorSchedulePreviewSerializer,
    WeekOffSerializer,
    ScheduleExceptionSerializer,
    StoreGeofenceSerializer,
    PayrollProfileAdminSerializer,
)
from .permissions import IsSystemAdmin
from .utils import idem_get, idem_remember


class AdminBaseView(APIView):
    permission_classes = [IsAuthenticated, IsSystemAdmin]
    parser_classes = [MultiPartParser, FormParser]


# ---------------------- Shift CRUD ----------------------
class ShiftListCreateView(AdminBaseView):
    def get(self, request):
        qs = Shift.objects.all()
        return Response(ShiftAdminSerializer(qs, many=True).data)

    def post(self, request):
        existing = idem_get(request, "shift-create")
        if existing:
            obj = get_object_or_404(Shift, pk=existing.object_pk)
            return Response(ShiftAdminSerializer(obj).data)
        serializer = ShiftAdminSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        idem_remember(request, "shift-create", obj)
        return Response(ShiftAdminSerializer(obj).data, status=status.HTTP_201_CREATED)


class ShiftDetailView(AdminBaseView):
    def get_object(self, pk):
        return get_object_or_404(Shift, pk=pk)

    def get(self, request, pk):
        obj = self.get_object(pk)
        return Response(ShiftAdminSerializer(obj).data)

    def put(self, request, pk):
        return self._update(request, pk, partial=False)

    def patch(self, request, pk):
        return self._update(request, pk, partial=True)

    def _update(self, request, pk, partial):
        existing = idem_get(request, f"shift-update-{pk}")
        if existing:
            obj = get_object_or_404(Shift, pk=existing.object_pk)
            return Response(ShiftAdminSerializer(obj).data)
        obj = self.get_object(pk)
        serializer = ShiftAdminSerializer(obj, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        idem_remember(request, f"shift-update-{pk}", obj)
        return Response(ShiftAdminSerializer(obj).data)

    def delete(self, request, pk):
        obj = self.get_object(pk)
        obj.is_active = False
        obj.save(update_fields=["is_active"])
        return Response(ShiftAdminSerializer(obj).data)


# ---------------------- AdvisorSchedule CRUD + Preview ----------------------
class AdvisorScheduleListCreateView(AdminBaseView):
    def get(self, request):
        qs = AdvisorSchedule.objects.all()
        return Response(AdvisorScheduleAdminSerializer(qs, many=True).data)

    def post(self, request):
        existing = idem_get(request, "schedule-create")
        if existing:
            obj = get_object_or_404(AdvisorSchedule, pk=existing.object_pk)
            return Response(AdvisorScheduleAdminSerializer(obj).data)
        serializer = AdvisorScheduleAdminSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        idem_remember(request, "schedule-create", obj)
        return Response(
            AdvisorScheduleAdminSerializer(obj).data, status=status.HTTP_201_CREATED
        )


class AdvisorScheduleDetailView(AdminBaseView):
    def get_object(self, pk):
        return get_object_or_404(AdvisorSchedule, pk=pk)

    def get(self, request, pk):
        obj = self.get_object(pk)
        return Response(AdvisorScheduleAdminSerializer(obj).data)

    def put(self, request, pk):
        return self._update(request, pk, False)

    def patch(self, request, pk):
        return self._update(request, pk, True)

    def _update(self, request, pk, partial):
        existing = idem_get(request, f"schedule-update-{pk}")
        if existing:
            obj = get_object_or_404(AdvisorSchedule, pk=existing.object_pk)
            return Response(AdvisorScheduleAdminSerializer(obj).data)
        obj = self.get_object(pk)
        serializer = AdvisorScheduleAdminSerializer(
            obj, data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        idem_remember(request, f"schedule-update-{pk}", obj)
        return Response(AdvisorScheduleAdminSerializer(obj).data)

    def delete(self, request, pk):
        obj = self.get_object(pk)
        obj.is_active = False
        obj.save(update_fields=["is_active"])
        return Response(AdvisorScheduleAdminSerializer(obj).data)


class AdvisorSchedulePreviewView(AdminBaseView):
    parser_classes = []  # GET only

    def get(self, request, pk):
        schedule = get_object_or_404(AdvisorSchedule, pk=pk)
        start_s = request.query_params.get("start")
        end_s = request.query_params.get("end")
        if not (start_s and end_s):
            return Response({"detail": "start and end required"}, status=400)
        start = date.fromisoformat(start_s)
        end = date.fromisoformat(end_s)
        result = {}
        day = start
        while day <= end:
            shift = schedule.resolve_shift_for(day)
            result[day.isoformat()] = (
                ShiftAdminSerializer(shift).data if shift else None
            )
            day += timedelta(days=1)
        return Response(AdvisorSchedulePreviewSerializer(result).data)


# ---------------------- WeekOff CRUD ----------------------
class WeekOffListCreateView(AdminBaseView):
    def get(self, request):
        qs = WeekOff.objects.all()
        return Response(WeekOffSerializer(qs, many=True).data)

    def post(self, request):
        existing = idem_get(request, "weekoff-create")
        if existing:
            obj = get_object_or_404(WeekOff, pk=existing.object_pk)
            return Response(WeekOffSerializer(obj).data)
        serializer = WeekOffSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        idem_remember(request, "weekoff-create", obj)
        return Response(WeekOffSerializer(obj).data, status=status.HTTP_201_CREATED)


class WeekOffDetailView(AdminBaseView):
    def get_object(self, pk):
        return get_object_or_404(WeekOff, pk=pk)

    def get(self, request, pk):
        obj = self.get_object(pk)
        return Response(WeekOffSerializer(obj).data)

    def put(self, request, pk):
        return self._update(request, pk, False)

    def patch(self, request, pk):
        return self._update(request, pk, True)

    def _update(self, request, pk, partial):
        existing = idem_get(request, f"weekoff-update-{pk}")
        if existing:
            obj = get_object_or_404(WeekOff, pk=existing.object_pk)
            return Response(WeekOffSerializer(obj).data)
        obj = self.get_object(pk)
        serializer = WeekOffSerializer(obj, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        idem_remember(request, f"weekoff-update-{pk}", obj)
        return Response(WeekOffSerializer(obj).data)

    def delete(self, request, pk):
        obj = self.get_object(pk)
        obj.is_active = False
        obj.save(update_fields=["is_active"])
        return Response(WeekOffSerializer(obj).data)


# ---------------------- ScheduleException CRUD ----------------------
class ScheduleExceptionListCreateView(AdminBaseView):
    def get(self, request):
        qs = ScheduleException.objects.all()
        return Response(ScheduleExceptionSerializer(qs, many=True).data)

    def post(self, request):
        existing = idem_get(request, "exception-create")
        if existing:
            obj = get_object_or_404(ScheduleException, pk=existing.object_pk)
            return Response(ScheduleExceptionSerializer(obj).data)
        serializer = ScheduleExceptionSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        idem_remember(request, "exception-create", obj)
        return Response(
            ScheduleExceptionSerializer(obj).data, status=status.HTTP_201_CREATED
        )


class ScheduleExceptionDetailView(AdminBaseView):
    def get_object(self, pk):
        return get_object_or_404(ScheduleException, pk=pk)

    def get(self, request, pk):
        obj = self.get_object(pk)
        return Response(ScheduleExceptionSerializer(obj).data)

    def put(self, request, pk):
        return self._update(request, pk, False)

    def patch(self, request, pk):
        return self._update(request, pk, True)

    def _update(self, request, pk, partial):
        existing = idem_get(request, f"exception-update-{pk}")
        if existing:
            obj = get_object_or_404(ScheduleException, pk=existing.object_pk)
            return Response(ScheduleExceptionSerializer(obj).data)
        obj = self.get_object(pk)
        serializer = ScheduleExceptionSerializer(
            obj, data=request.data, partial=partial, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        idem_remember(request, f"exception-update-{pk}", obj)
        return Response(ScheduleExceptionSerializer(obj).data)

    def delete(self, request, pk):
        obj = self.get_object(pk)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ---------------------- StoreGeofence CRUD ----------------------
class GeofenceListCreateView(AdminBaseView):
    def get(self, request):
        qs = StoreGeofence.objects.all()
        return Response(StoreGeofenceSerializer(qs, many=True).data)

    def post(self, request):
        existing = idem_get(request, "geofence-upsert")
        if existing:
            obj = get_object_or_404(StoreGeofence, pk=existing.object_pk)
            return Response(StoreGeofenceSerializer(obj).data)
        store_id = request.data.get("store")
        existing_geo = StoreGeofence.objects.filter(store_id=store_id).first()
        serializer = StoreGeofenceSerializer(existing_geo, data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        status_code = status.HTTP_200_OK if existing_geo else status.HTTP_201_CREATED
        idem_remember(request, "geofence-upsert", obj)
        return Response(StoreGeofenceSerializer(obj).data, status=status_code)


class GeofenceDetailView(AdminBaseView):
    def get_object(self, pk):
        return get_object_or_404(StoreGeofence, pk=pk)

    def get(self, request, pk):
        obj = self.get_object(pk)
        return Response(StoreGeofenceSerializer(obj).data)

    def put(self, request, pk):
        return self._update(request, pk, False)

    def patch(self, request, pk):
        return self._update(request, pk, True)

    def _update(self, request, pk, partial):
        existing = idem_get(request, f"geofence-update-{pk}")
        if existing:
            obj = get_object_or_404(StoreGeofence, pk=existing.object_pk)
            return Response(StoreGeofenceSerializer(obj).data)
        obj = self.get_object(pk)
        serializer = StoreGeofenceSerializer(obj, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        idem_remember(request, f"geofence-update-{pk}", obj)
        return Response(StoreGeofenceSerializer(obj).data)

    def delete(self, request, pk):
        obj = self.get_object(pk)
        obj.is_active = False
        obj.save(update_fields=["is_active"])
        return Response(StoreGeofenceSerializer(obj).data)


# ---------------------- Payroll profile list/upsert ----------------------
class PayrollListView(AdminBaseView):
    def get(self, request):
        qs = AdvisorPayrollProfile.objects.all()
        user_id = request.query_params.get("user")
        if user_id:
            qs = qs.filter(user_id=user_id)
        active = request.query_params.get("active")
        if active is not None:
            qs = qs.filter(is_active=str(active).lower() == "true")
        return Response(PayrollProfileAdminSerializer(qs, many=True).data)


class PayrollUpsertView(AdminBaseView):
    def get_object(self, user_id):
        return get_object_or_404(AdvisorPayrollProfile, user_id=user_id)

    def get(self, request, user_id):
        obj = self.get_object(user_id)
        return Response(PayrollProfileAdminSerializer(obj).data)

    def put(self, request, user_id):
        return self._upsert(request, user_id, partial=False)

    def patch(self, request, user_id):
        return self._upsert(request, user_id, partial=True)

    def _upsert(self, request, user_id, partial):
        existing = idem_get(request, f"payroll-upsert-{user_id}")
        if existing:
            obj = get_object_or_404(AdvisorPayrollProfile, pk=existing.object_pk)
            return Response(PayrollProfileAdminSerializer(obj).data)
        try:
            obj = AdvisorPayrollProfile.objects.get(user_id=user_id)
            serializer = PayrollProfileAdminSerializer(
                obj, data=request.data, partial=partial
            )
        except AdvisorPayrollProfile.DoesNotExist:
            serializer = PayrollProfileAdminSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save(user_id=user_id)
        idem_remember(request, f"payroll-upsert-{user_id}", obj)
        status_code = status.HTTP_200_OK if obj.pk else status.HTTP_201_CREATED
        return Response(PayrollProfileAdminSerializer(obj).data, status=status_code)
