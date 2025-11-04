"""Serializers for the attendance app.

These serializers handle the conversion of complex `attendance` models, such
as `Shift`, `Attendance`, and `AttendanceRequest`, into native Python datatypes
that can then be easily rendered into JSON for API responses.

The serializers also provide data validation for incoming API requests,
ensuring that data integrity is maintained. Key responsibilities include:
- Exposing model fields and computed properties (e.g., `total_minutes`).
- Handling nested relationships for read operations (e.g., showing `Shift`
  details within an `AdvisorSchedule`).
- Providing write-only fields (e.g., `default_shift_id`) to simplify creation
  and update operations for related models.
- Implementing custom validation logic specific to API workflows, such as
  validating the `meta` payload for different `AttendanceRequest` types.
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
    """Serializer for `Shift` model, intended for admin-level CRUD operations.

    This serializer exposes all core fields of the `Shift` model and includes
    the calculated `total_minutes` as a read-only field. It is designed for
    use in administrative interfaces where full control over shift properties
    is required.

    Attributes:
        total_minutes (SerializerMethodField): The total duration of the shift
            in minutes, calculated by the model's `total_minutes` method.
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

    def get_total_minutes(self, obj: Shift) -> int:  # pragma: no cover - thin wrapper
        """Returns the shift's total duration in minutes."""
        return obj.total_minutes()


class ShiftSerializer(serializers.ModelSerializer):
    """Serializer for the `Shift` model for general use.

    Exposes basic shift information along with the `total_minutes` property,
    which is derived from the model's `total_minutes` method. This serializer
    is typically used for read-only representations of shifts.

    Attributes:
        total_minutes (SerializerMethodField): The total duration of the shift
            in minutes.
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
        """Returns the shift's total duration in minutes."""
        return obj.total_minutes()


class AdvisorPayrollProfileSerializer(serializers.ModelSerializer):
    """Serializer for the `AdvisorPayrollProfile` model.

    Handles the serialization of an advisor's payroll information. It ensures
    that the `user` field is restricted to users with the 'advisor' role.

    Attributes:
        user (PrimaryKeyRelatedField): A field restricted to advisor users.
    """

    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="advisor")
    )

    class Meta:
        model = AdvisorPayrollProfile
        fields = ["id", "user", "hourly_rate", "effective_from", "is_active"]
        read_only_fields = ["id", "effective_from"]


class PayrollProfileAdminSerializer(serializers.ModelSerializer):
    """Serializer for admin updates to an `AdvisorPayrollProfile`.

    This serializer is designed for administrators to update an advisor's
    payroll information. The `user` field is made read-only to prevent
    re-assigning the profile to a different user.

    Attributes:
        user (PrimaryKeyRelatedField): A read-only field showing the associated user.
    """

    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = AdvisorPayrollProfile
        fields = ["id", "user", "hourly_rate", "is_active"]
        read_only_fields = ["id", "user"]


class AdvisorScheduleSerializer(serializers.ModelSerializer):
    """Serializer for the `AdvisorSchedule` model.

    This serializer handles both read and write operations for advisor schedules.
    For read operations, it provides nested representations of the assigned
    shifts (`default_shift`, `week_even_shift`, `week_odd_shift`). For write
    operations, it uses `PrimaryKeyRelatedField`s (`*_id`) to allow assigning
    shifts by their primary key.

    It also includes a `preview_shifts` method that can resolve and return the
    planned shifts for a given date range passed in the serializer context.

    Attributes:
        user (PrimaryKeyRelatedField): The advisor user for the schedule.
        default_shift (ShiftSerializer): Nested serializer for the fixed shift.
        week_even_shift (ShiftSerializer): Nested serializer for the even-week shift.
        week_odd_shift (ShiftSerializer): Nested serializer for the odd-week shift.
        preview_shifts (SerializerMethodField): A read-only field that shows
            resolved shifts for a date range from the context.
        default_shift_id (PrimaryKeyRelatedField): Write-only field for assigning
            the default shift by ID.
        week_even_shift_id (PrimaryKeyRelatedField): Write-only field for assigning
            the even-week shift by ID.
        week_odd_shift_id (PrimaryKeyRelatedField): Write-only field for assigning
            the odd-week shift by ID.
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
        """Resolves and serializes shifts for a given date range.

        This method reads a `date_range` (a list of ISO date strings) from the
        serializer's context. For each date in the range, it resolves the
        advisor's shift using the schedule's logic and returns a dictionary
        mapping the date string to the serialized shift data. If the advisor
        has a day off, the value is `None`.

        Args:
            obj (AdvisorSchedule): The `AdvisorSchedule` instance being serialized.

        Returns:
            Dict[str, Optional[Dict[str, Any]]]: A dictionary where keys are
            date strings and values are either serialized `Shift` data or `None`.
            Returns an empty dictionary if no `date_range` is in the context.
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
    """Admin serializer for `AdvisorSchedule` for direct DB-level operations.

    This serializer exposes foreign key fields directly, making it suitable for
    administrative interfaces (like Django Admin) where related objects are
    selected via simple dropdowns. It does not provide the nested representations
    or complex write logic of `AdvisorScheduleSerializer`.

    """

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
    """A simple serializer for returning a date-to-shift mapping.

    This serializer does not have defined fields and acts as a pass-through.
    It is used to serialize a pre-computed dictionary where keys are dates
    and values are shift information, without imposing a rigid structure.
    """

    def to_representation(self, instance):  # pragma: no cover - trivial
        return instance


class WeekOffSerializer(serializers.ModelSerializer):
    """Serializer for the `WeekOff` model.

    Handles the serialization of weekly recurring days off for advisors. It
    ensures that the `user` field is restricted to users with the 'advisor' role.
    """

    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="advisor")
    )

    class Meta:
        model = WeekOff
        fields = ["id", "user", "weekday", "is_active"]
        read_only_fields = ["id"]


class ScheduleExceptionSerializer(serializers.ModelSerializer):
    """Serializer for the `ScheduleException` model.

    This serializer is used for creating and managing single-day exceptions to
    an advisor's schedule. It includes validation to ensure logical consistency,
    such as preventing an override shift from being set when the day is marked
    as off.

    The `created_by` field is automatically populated from the request user during
    the creation process.

    Attributes:
        user (PrimaryKeyRelatedField): The advisor to whom the exception applies.
        override_shift (PrimaryKeyRelatedField): The shift to use for this one
            day, overriding the default schedule.
        created_by (PrimaryKeyRelatedField): Read-only field for the user who
            created the exception.
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
        """Ensures `override_shift` is null if `mark_off` is true."""
        mark_off = attrs.get("mark_off")
        override_shift = attrs.get("override_shift")
        if mark_off and override_shift is not None:
            raise serializers.ValidationError(
                {"override_shift": "Cannot set override_shift when mark_off is true."}
            )
        return attrs

    def create(self, validated_data: Dict[str, Any]) -> ScheduleException:
        """Sets `created_by` to the request user before creating the instance."""
        request = self.context.get("request")
        if request and request.user:
            validated_data["created_by"] = request.user
        return super().create(validated_data)


class StoreGeofenceSerializer(serializers.ModelSerializer):
    """Serializer for the `StoreGeofence` model.

    This serializer handles the data for a store's geofence, including its
    location and radius. It provides explicit validation for latitude and
    longitude fields to ensure they fall within standard geographical ranges,
    offering clearer API error messages than default model validation.

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
    """Serializer for the `Attendance` model.

    This serializer handles the data for daily attendance records. It exposes
    all the core fields related to check-in/out times, location, and status.
    Calculated fields like `worked_minutes` and `status` are read-only, as
    they are computed by the model's business logic.

    Attributes:
        user (PrimaryKeyRelatedField): The advisor user for the record.
        shift (PrimaryKeyRelatedField): The shift assigned for the record,
            limited to active shifts.
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
        """Performs validation checks on the attendance data.

        This validation ensures that:
        - The user associated with the attendance record has the 'advisor' role.
        - The assigned shift is currently active.

        Args:
            attrs (Dict[str, Any]): The dictionary of attributes to validate.

        Returns:
            Dict[str, Any]: The validated attributes.

        Raises:
            serializers.ValidationError: If the user is not an advisor or the
                shift is not active.
        """
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
    """Serializer for the `AttendanceRequest` model.

    This serializer handles the creation and representation of attendance
    approval requests. It automatically populates the `requested_by` field
    from the current user in the request context.

    It also includes type-specific validation for the `meta` field to ensure
    that requests like 'OT' (Overtime) or 'ADJUST' contain the necessary data.

    Attributes:
        attendance (PrimaryKeyRelatedField): The parent attendance record.
        requested_by (PrimaryKeyRelatedField): The user who made the request
            (read-only, set automatically).
        decided_by (PrimaryKeyRelatedField): The manager who actioned the
            request (read-only).
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
        """Sets `requested_by` to the request user before creating the instance."""
        request = self.context.get("request")
        if request and request.user:
            validated_data["requested_by"] = request.user
        return super().create(validated_data)

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        """Performs validation on the `meta` field based on request `type`.

        This method ensures that the `meta` dictionary contains the required
        keys and data for specific types of requests.
        - **OT**: Requires a positive integer `requested_minutes`.
        - **ADJUST**: Requires either `set_check_in` or `set_check_out`.

        Args:
            attrs (Dict[str, Any]): The dictionary of attributes to validate.

        Returns:
            Dict[str, Any]: The validated attributes.

        Raises:
            serializers.ValidationError: If the `meta` field is missing
                required data for the given request `type`.
        """
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
    """A condensed serializer for listing `AttendanceRequest` objects.

    This serializer is optimized for list views, such as the manager's approval
    queue. It flattens the structure by including key details from related
    models (`Attendance`, `User`, `Store`, `Shift`) directly at the top level.
    This avoids nested objects in the API response, making it simpler and more
    efficient for list displays.

    All fields are read-only as this serializer is not intended for write operations.

    Attributes:
        user_id (IntegerField): The ID of the user associated with the request.
        user_name (SerializerMethodField): The full name or username of the user.
        store_id (IntegerField): The ID of the store where the attendance occurred.
        store_name (CharField): The name of the store.
        attendance_date (DateField): The date of the attendance record.
        shift_name (CharField): The name of the shift for the attendance.
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
        """Returns the user's full name, or their username as a fallback."""
        user = obj.attendance.user
        full = user.get_full_name()
        return full if full else user.username
