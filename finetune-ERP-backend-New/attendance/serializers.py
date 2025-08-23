"""Serializers for the attendance app.

These serializers expose the core attendance models to API clients.  Only
serialization logic and lightweight validation live here; view logic and
endpoints are implemented in later phases.

Computed fields such as ``total_minutes`` or ``worked_minutes`` are derived from
model methods and are therefore read-only for API clients.
"""

from __future__ import annotations

from datetime import date
from typing import Any, Dict, List, Optional

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import (
    AdvisorPayrollProfile,
    AdvisorSchedule,
    Attendance,
    AttendanceRequest,
    ScheduleException,
    Shift,
    WeekOff,
)
from store.models import StoreGeofence


User = get_user_model()


class ShiftAdminSerializer(serializers.ModelSerializer):
    """Serializer for system admin shift configuration."""

    total_minutes = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Shift
        fields = [
            "id",
            "name",
            "start_time",
            "end_time",
            "is_overnight",
            "is_active",
            "total_minutes",
        ]
        read_only_fields = ["id", "total_minutes"]

    def get_total_minutes(self, obj: Shift) -> int:  # pragma: no cover - thin wrapper
        return obj.total_minutes()


class ShiftSerializer(serializers.ModelSerializer):
    """Serializer for :class:`~attendance.models.Shift`.

    Exposes basic shift information along with ``total_minutes`` which is
    derived from the model's :meth:`~attendance.models.Shift.total_minutes`
    helper.
    """

    total_minutes = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Shift
        fields = [
            "id",
            "name",
            "start_time",
            "end_time",
            "is_overnight",
            "is_active",
            "total_minutes",
        ]
        read_only_fields = ["id", "total_minutes"]

    def get_total_minutes(self, obj: Shift) -> int:
        return obj.total_minutes()


class AdvisorPayrollProfileSerializer(serializers.ModelSerializer):
    """Serializer for :class:`~attendance.models.AdvisorPayrollProfile`.

    Restricts the ``user`` relation to advisors only.
    """

    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="advisor")
    )

    class Meta:
        model = AdvisorPayrollProfile
        fields = ["id", "user", "hourly_rate", "effective_from", "is_active"]
        read_only_fields = ["id", "effective_from"]


class PayrollProfileAdminSerializer(serializers.ModelSerializer):
    """Serializer for system admin payroll profile upserts."""

    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = AdvisorPayrollProfile
        fields = ["id", "user", "hourly_rate", "is_active"]
        read_only_fields = ["id", "user"]


class AdvisorScheduleSerializer(serializers.ModelSerializer):
    """Serializer for :class:`~attendance.models.AdvisorSchedule`.

    Default, even-week and odd-week shifts are returned using the
    :class:`ShiftSerializer` for richer read-only representations.  A
    ``preview_shifts`` method field can be supplied with a ``date_range`` in the
    serializer context to resolve shifts for the provided dates.
    """

    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="advisor")
    )
    default_shift = ShiftSerializer(read_only=True)
    week_even_shift = ShiftSerializer(read_only=True)
    week_odd_shift = ShiftSerializer(read_only=True)
    preview_shifts = serializers.SerializerMethodField()

    # Allow write operations via *_id fields while still exposing nested
    # representations.
    default_shift_id = serializers.PrimaryKeyRelatedField(
        source="default_shift",
        queryset=Shift.objects.all(),
        required=False,
        write_only=True,
        allow_null=True,
    )
    week_even_shift_id = serializers.PrimaryKeyRelatedField(
        source="week_even_shift",
        queryset=Shift.objects.all(),
        required=False,
        write_only=True,
        allow_null=True,
    )
    week_odd_shift_id = serializers.PrimaryKeyRelatedField(
        source="week_odd_shift",
        queryset=Shift.objects.all(),
        required=False,
        write_only=True,
        allow_null=True,
    )

    class Meta:
        model = AdvisorSchedule
        fields = [
            "id",
            "user",
            "rule_type",
            "anchor_monday",
            "parity_offset",
            "default_shift_id",
            "week_even_shift_id",
            "week_odd_shift_id",
            "default_shift",
            "week_even_shift",
            "week_odd_shift",
            "is_active",
            "created_at",
            "updated_at",
            "preview_shifts",
        ]
        read_only_fields = [
            "id",
            "default_shift",
            "week_even_shift",
            "week_odd_shift",
            "created_at",
            "updated_at",
            "preview_shifts",
        ]

    def get_preview_shifts(
        self, obj: AdvisorSchedule
    ) -> Dict[str, Optional[Dict[str, Any]]]:
        """Return resolved shifts for a list of dates.

        The serializer context may include ``date_range`` which should be a list
        of ISO-formatted date strings.  For each date a mapping of the date
        string to the serialized shift (or ``None`` if off) is returned.
        """

        date_range: Optional[List[str]] = self.context.get("date_range")
        if not date_range:
            return {}

        result: Dict[str, Optional[Dict[str, Any]]] = {}
        for ds in date_range:
            try:
                d = date.fromisoformat(ds)
            except (TypeError, ValueError):
                continue
            shift = obj.resolve_shift_for(d)
            result[ds] = ShiftSerializer(shift).data if shift else None
        return result


class AdvisorScheduleAdminSerializer(serializers.ModelSerializer):
    """Serializer for CRUD operations on advisor schedules."""

    class Meta:
        model = AdvisorSchedule
        fields = [
            "id",
            "user",
            "rule_type",
            "anchor_monday",
            "parity_offset",
            "default_shift",
            "week_even_shift",
            "week_odd_shift",
            "is_active",
        ]
        read_only_fields = ["id"]


class AdvisorSchedulePreviewSerializer(serializers.Serializer):
    """Simple serializer returning a date→shift mapping."""

    def to_representation(self, instance):  # pragma: no cover - trivial
        return instance


class WeekOffSerializer(serializers.ModelSerializer):
    """Serializer for :class:`~attendance.models.WeekOff` entries."""

    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="advisor")
    )

    class Meta:
        model = WeekOff
        fields = ["id", "user", "weekday", "is_active"]
        read_only_fields = ["id"]


class ScheduleExceptionSerializer(serializers.ModelSerializer):
    """Serializer for :class:`~attendance.models.ScheduleException`.

    ``created_by`` is automatically set from the request user during creation.
    If ``mark_off`` is ``True`` then ``override_shift`` must be ``None``.
    """

    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="advisor")
    )
    override_shift = serializers.PrimaryKeyRelatedField(
        queryset=Shift.objects.all(), allow_null=True, required=False
    )
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ScheduleException
        fields = [
            "id",
            "user",
            "date",
            "override_shift",
            "mark_off",
            "reason",
            "created_by",
            "created_at",
        ]
        read_only_fields = ["id", "created_by", "created_at"]

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        mark_off = attrs.get("mark_off")
        override_shift = attrs.get("override_shift")
        if mark_off and override_shift is not None:
            raise serializers.ValidationError(
                {"override_shift": "Cannot set override_shift when mark_off is true."}
            )
        return attrs

    def create(self, validated_data: Dict[str, Any]) -> ScheduleException:
        request = self.context.get("request")
        if request and request.user:
            validated_data["created_by"] = request.user
        return super().create(validated_data)


class StoreGeofenceSerializer(serializers.ModelSerializer):
    """Serializer for :class:`store.models.StoreGeofence`.

    Validates latitude and longitude ranges explicitly even though model
    validators exist, providing clearer API error messages.
    """

    class Meta:
        model = StoreGeofence
        fields = ["id", "store", "latitude", "longitude", "radius_m", "is_active"]
        read_only_fields = ["id"]

    def validate_latitude(self, value):  # type: ignore[override]
        if not -90 <= value <= 90:
            raise serializers.ValidationError("Latitude must be between -90 and 90.")
        return value

    def validate_longitude(self, value):  # type: ignore[override]
        if not -180 <= value <= 180:
            raise serializers.ValidationError("Longitude must be between -180 and 180.")
        return value


class AttendanceSerializer(serializers.ModelSerializer):
    """Serializer for :class:`~attendance.models.Attendance` records.

    Computed fields like ``worked_minutes`` and ``status`` are derived from the
    model's helper methods and are therefore read-only to API consumers.
    """

    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="advisor")
    )
    shift = serializers.PrimaryKeyRelatedField(
        queryset=Shift.objects.filter(is_active=True)
    )

    class Meta:
        model = Attendance
        fields = [
            "id",
            "user",
            "store",
            "date",
            "shift",
            "check_in",
            "check_in_lat",
            "check_in_lon",
            "check_out",
            "check_out_lat",
            "check_out_lon",
            "worked_minutes",
            "late_minutes",
            "early_out_minutes",
            "ot_minutes",
            "status",
            "notes",
            "check_in_photo",
            "check_out_photo",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "worked_minutes",
            "late_minutes",
            "early_out_minutes",
            "ot_minutes",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        user = attrs.get("user") or getattr(self.instance, "user", None)
        shift = attrs.get("shift") or getattr(self.instance, "shift", None)
        errors = {}
        if user and getattr(user, "role", None) != "advisor":
            errors["user"] = "Attendance records are only for advisors."
        if shift and not shift.is_active:
            errors["shift"] = "Shift must be active."
        if errors:
            raise serializers.ValidationError(errors)
        return attrs


class AttendanceRequestSerializer(serializers.ModelSerializer):
    """Serializer for :class:`~attendance.models.AttendanceRequest`.

    ``requested_by`` defaults to the requesting user.  Validation enforces
    request-type specific requirements on the ``meta`` payload.
    """

    attendance = serializers.PrimaryKeyRelatedField(queryset=Attendance.objects.all())
    requested_by = serializers.PrimaryKeyRelatedField(read_only=True)
    decided_by = serializers.PrimaryKeyRelatedField(read_only=True, allow_null=True)

    class Meta:
        model = AttendanceRequest
        fields = [
            "id",
            "attendance",
            "type",
            "requested_by",
            "reason",
            "status",
            "decided_by",
            "decided_at",
            "created_at",
            "updated_at",
            "meta",
        ]
        read_only_fields = [
            "id",
            "requested_by",
            "status",
            "decided_by",
            "decided_at",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data: Dict[str, Any]) -> AttendanceRequest:
        request = self.context.get("request")
        if request and request.user:
            validated_data["requested_by"] = request.user
        return super().create(validated_data)

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        req_type = attrs.get("type")
        meta = attrs.get("meta") or {}

        if req_type == "OT":
            minutes = meta.get("requested_minutes")
            if not isinstance(minutes, int) or minutes <= 0:
                raise serializers.ValidationError(
                    {
                        "meta": "OT requests require a positive integer 'requested_minutes'."
                    }
                )
        elif req_type == "ADJUST":
            if not (meta.get("set_check_in") or meta.get("set_check_out")):
                raise serializers.ValidationError(
                    {
                        "meta": "ADJUST requests require 'set_check_in' or 'set_check_out'."
                    }
                )
        # LATE and OUTSIDE_GEOFENCE have no additional requirements.
        return attrs


class AttendanceRequestListSerializer(serializers.ModelSerializer):
    """Condensed serializer for listing approval requests.

    Flattens selected fields from related models to avoid nested structures.
    """

    user_id = serializers.IntegerField(source="attendance.user_id", read_only=True)
    user_name = serializers.SerializerMethodField()
    store_id = serializers.IntegerField(source="attendance.store_id", read_only=True)
    store_name = serializers.CharField(source="attendance.store.name", read_only=True)
    attendance_date = serializers.DateField(source="attendance.date", read_only=True)
    shift_name = serializers.CharField(source="attendance.shift.name", read_only=True)

    class Meta:
        model = AttendanceRequest
        fields = [
            "id",
            "type",
            "status",
            "created_at",
            "decided_at",
            "user_id",
            "user_name",
            "store_id",
            "store_name",
            "attendance_date",
            "shift_name",
        ]
        read_only_fields = fields

    def get_user_name(self, obj) -> str:
        user = obj.attendance.user
        full = user.get_full_name()
        return full if full else user.username
