"""Models for the attendance tracking and management system.

This module defines the database schema for the attendance module, which is
central to tracking employee work hours, shifts, schedules, and leave. It
includes models for:
- **Shifts (`Shift`)**: Reusable shift templates (e.g., "Morning Shift").
- **Schedules (`AdvisorSchedule`, `ScheduleException`, `WeekOff`)**: Rules that
  determine an advisor's expected shift for any given day.
- **Attendance Records (`Attendance`)**: Captures daily check-in/check-out
  times, location data, and status (Present, Absent, Late, etc.).
- **Approval Workflows (`AttendanceRequest`)**: Manages requests for actions
  like manual attendance adjustments or overtime, which require approval from
  a branch head or admin.
- **Payroll (`AdvisorPayrollProfile`)**: Stores payroll-related information
  for advisors.
- **Idempotency (`GenericIdempotency`)**: Prevents duplicate operations for
  critical endpoints like check-in and check-out.

The models are designed to handle complexities such as overnight shifts,
alternating weekly schedules, geofence validation (handled in views), and
automated status calculations. Signals are used to trigger actions, such as
recalculating worked hours when a check-out time is recorded.

Note:
    * Attendance records for an overnight shift use the shift's **start date**
      as the attendance date.
    * Punch durations are rounded to the nearest 5 minutes.
    * A grace period of 15 minutes applies for late check-ins.
    * Half-day threshold is 6 hours (360 minutes).
"""

from datetime import date, datetime, timedelta
from typing import Optional

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from .choices import AttendanceStatus, RequestStatus, RequestType, ScheduleRuleType


class GenericIdempotency(models.Model):
    """Stores a mapping for idempotent API write operations.

    This model prevents duplicate object creation from repeated API requests
    by mapping a unique ``Idempotency-Key`` (provided in the request header)
    to the primary key of the object that was created.

    When a write request is received with an idempotency key, the system first
    checks if a record with that key, user, and endpoint already exists. If so,
    it returns the previously created object instead of performing the action
    again.

    Attributes:
        key (CharField): The unique idempotency key from the request header.
        user (ForeignKey): The user who made the request. The record is deleted
            if the user is deleted.
        endpoint (CharField): The API endpoint targeted by the request.
        object_pk (CharField): The primary key of the created object.
        created_at (DateTimeField): Timestamp of when the key was first stored.
    """

    key = models.CharField(max_length=64, unique=True, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="+"
    )
    endpoint = models.CharField(max_length=64)
    object_pk = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return f"{self.key}:{self.endpoint}:{self.user_id}"


class Shift(models.Model):
    """A template for a recurring work shift.

    Defines a named work period with a specific start and end time, which can
    be assigned to advisors. It supports both standard and overnight shifts.

    Attributes:
        name (CharField): A unique name for the shift (e.g., "Morning Shift").
        start_time (TimeField): The official start time of the shift.
        end_time (TimeField): The official end time of the shift.
        is_overnight (BooleanField): True if the shift extends past midnight.
        is_active (BooleanField): If False, the shift cannot be assigned.
        created_at (DateTimeField): Timestamp of creation.
        updated_at (DateTimeField): Timestamp of last update.

    Example:
        >>> from datetime import time
        >>> morning_shift = Shift.objects.create(
        ...     name="Morning 9-5",
        ...     start_time=time(9, 0),
        ...     end_time=time(17, 0)
        ... )
        >>> morning_shift.total_minutes()
        480
    """

    name = models.CharField(max_length=64, unique=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_overnight = models.BooleanField(
        default=False,
        help_text="True if shift crosses midnight into next day",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def total_minutes(self) -> int:
        """Calculates the total duration of the shift in minutes.

        This method correctly handles overnight shifts by adding a day to the
        end time if the `is_overnight` flag is True or if the end time is
        logically before or same as the start time.

        Returns:
            int: The total shift duration in minutes.
        """

        start = datetime.combine(date(2000, 1, 1), self.start_time)
        end = datetime.combine(date(2000, 1, 1), self.end_time)
        if self.is_overnight or end <= start:
            end += timedelta(days=1)
        delta = end - start
        return int(delta.total_seconds() // 60)

    def __str__(self) -> str:  # pragma: no cover - simple string representation
        """Return a human-readable representation of the shift."""

        return f"{self.name} ({self.start_time}–{self.end_time})"


class AdvisorPayrollProfile(models.Model):
    """Stores payroll-related configuration for an advisor.

    This model links an advisor user to their specific payroll details, such as
    their hourly rate. This information can be used for salary calculation
    based on worked hours.

    Attributes:
        user (OneToOneField): A one-to-one link to the advisor's user account.
            The profile is deleted if the user is deleted.
        hourly_rate (DecimalField): The advisor's pay rate per hour.
        effective_from (DateField): The date from which this pay rate is effective.
        is_active (BooleanField): Whether this payroll profile is currently active.
        created_at (DateTimeField): Timestamp of creation.
        updated_at (DateTimeField): Timestamp of last update.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={"role": "advisor"},
        related_name="payroll_profile",
    )
    hourly_rate = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
    )
    effective_from = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:  # pragma: no cover - simple string representation
        """Return the user and hourly rate for display purposes."""

        return f"{self.user} @ {self.hourly_rate}/hr"


PARITY_OFFSET_CHOICES = ((0, "Even as A"), (1, "Odd as A"))


class AdvisorSchedule(models.Model):
    """Defines the default work schedule for an advisor.

    This model supports multiple scheduling strategies, such as a fixed daily
    shift or a bi-weekly alternating shift pattern. It serves as the baseline
    for determining an advisor's expected shift on any given day, before
    considering exceptions or weekly off days.

    Attributes:
        user (OneToOneField): Link to the advisor's user account. The schedule
            is deleted if the user is deleted.
        rule_type (CharField): The type of scheduling rule to apply.
            - 'fixed': The advisor works the same `default_shift` every day.
            - 'alternate_weekly': The advisor alternates between
              `week_even_shift` and `week_odd_shift` based on week parity.
        anchor_monday (DateField): A reference Monday to calculate week parity.
            The first week (starting from this Monday) is considered even.
        parity_offset (SmallIntegerField): An offset (0 or 1) to flip the
            even/odd week calculation, useful for staggering schedules.
        default_shift (ForeignKey): The shift used for the 'fixed' rule type.
            The shift cannot be deleted while in use by a schedule.
        week_even_shift (ForeignKey): The shift for even-numbered weeks. The
            shift cannot be deleted while in use by a schedule.
        week_odd_shift (ForeignKey): The shift for odd-numbered weeks. The
            shift cannot be deleted while in use by a schedule.
        is_active (BooleanField): If False, this schedule is ignored.
        created_at (DateTimeField): Timestamp of creation.
        updated_at (DateTimeField): Timestamp of last update.

    Raises:
        ValidationError: On `clean()` if the required shifts for the selected
            `rule_type` are not provided, or if `anchor_monday` is not a Monday.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        unique=True,
        limit_choices_to={"role": "advisor"},
        related_name="attendance_schedule",
    )
    rule_type = models.CharField(
        max_length=32, choices=ScheduleRuleType, default="fixed"
    )
    anchor_monday = models.DateField(
        help_text="A Monday used to compute week parity (even/odd)."
    )
    parity_offset = models.SmallIntegerField(
        default=0,
        choices=PARITY_OFFSET_CHOICES,
        help_text="Flip weekly parity to support batches (0=no flip, 1=flip).",
    )
    default_shift = models.ForeignKey(
        "Shift",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="default_for_schedules",
        help_text="Required for fixed rule.",
    )
    week_even_shift = models.ForeignKey(
        "Shift",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="week_even_for_schedules",
    )
    week_odd_shift = models.ForeignKey(
        "Shift",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="week_odd_for_schedules",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self) -> None:
        """Validates the scheduling rule configuration before saving.

        Ensures that the necessary shift fields are populated based on the
        selected `rule_type` and that the `anchor_monday` is a valid Monday.

        Raises:
            ValidationError: If `rule_type` is 'fixed' and `default_shift` is
                missing, or if `rule_type` is 'alternate_weekly' and the
                corresponding shifts are missing. Also raised if `anchor_monday`
                is not a Monday.
        """

        errors = {}
        if self.rule_type == "fixed":
            if not self.default_shift:
                errors["default_shift"] = "Default shift is required for fixed rule."
        elif self.rule_type == "alternate_weekly":
            if not self.week_even_shift:
                errors["week_even_shift"] = "Required for alternate weekly rule."
            if not self.week_odd_shift:
                errors["week_odd_shift"] = "Required for alternate weekly rule."
        if self.anchor_monday and self.anchor_monday.weekday() != 0:
            errors["anchor_monday"] = "Anchor date must be a Monday."
        if errors:
            raise ValidationError(errors)
        super().clean()

    def resolve_shift_for(self, day: date) -> Optional["Shift"]:
        """Determines the shift for a given date based on the schedule rule.

        This method applies the logic defined by `rule_type` to find the
        correct shift for the specified day. For 'alternate_weekly' schedules,
        it calculates the week parity relative to the `anchor_monday`.

        Note:
            This method only resolves the shift based on the `AdvisorSchedule`
            rule. It does not account for `WeekOff` or `ScheduleException`
            overrides. The `resolve_planned_shift` function should be used
            for a complete resolution.

        Args:
            day (date): The date for which to resolve the shift.

        Returns:
            Optional["Shift"]: The resolved Shift instance, or None if no
            shift is scheduled (e.g., for an inactive schedule).
        """

        if self.rule_type == "fixed":
            return self.default_shift

        # Alternate weekly scheduling
        weeks = max(0, (day - self.anchor_monday).days // 7)
        parity = (weeks % 2) ^ self.parity_offset
        return self.week_even_shift if parity == 0 else self.week_odd_shift


class WeekOff(models.Model):
    """Represents a recurring weekly day off for an advisor.

    This model is used to mark specific days of the week (e.g., Sunday) as
    non-working days for a particular user. These rules are checked first when
    resolving an advisor's schedule.

    Attributes:
        user (ForeignKey): The advisor to whom this day off applies. The
            record is deleted if the user is deleted.
        weekday (SmallIntegerField): The day of the week (0=Monday, 6=Sunday).
        is_active (BooleanField): If False, this rule is ignored.
        created_at (DateTimeField): Timestamp of creation.
        updated_at (DateTimeField): Timestamp of last update.

    Constraints:
        - `unique_weekoff_user_weekday`: Ensures an advisor can only have one
          `WeekOff` entry per weekday.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={"role": "advisor"},
        related_name="attendance_weekoffs",
    )
    weekday = models.SmallIntegerField(help_text="0=Mon … 6=Sun")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "weekday"], name="unique_weekoff_user_weekday"
            )
        ]


class ScheduleException(models.Model):
    """An exception to an advisor's default schedule for a specific date.

    This model is used to handle single-day deviations from the regular
    schedule, such as assigning a different shift for one day or marking a
    specific day as off (e.g., for a public holiday or special event).
    These exceptions take precedence over the default `AdvisorSchedule`.

    Attributes:
        user (ForeignKey): The advisor to whom this exception applies. The
            record is deleted if the user is deleted.
        date (DateField): The specific date the exception is for.
        override_shift (ForeignKey, optional): If set, this shift will be used
            for the specified date. The shift cannot be deleted while in use.
        mark_off (BooleanField): If True, the advisor is considered off on this
            date, regardless of any assigned shift.
        reason (TextField): An explanation for why the exception was created.
        created_by (ForeignKey): The user (typically an admin or branch head)
            who created the exception. The creating user cannot be deleted if
            they created an exception.
        created_at (DateTimeField): Timestamp of creation.

    Constraints:
        - `unique_scheduleexception_user_date`: Ensures there is only one
          exception entry per user per date.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={"role": "advisor"},
        related_name="attendance_schedule_exceptions",
    )
    date = models.DateField()
    override_shift = models.ForeignKey(
        "Shift",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        help_text="If set, use this shift for the date.",
    )
    mark_off = models.BooleanField(
        default=False,
        help_text="If true, treat as off-day regardless of shift.",
    )
    reason = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="+"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "date"], name="unique_scheduleexception_user_date"
            )
        ]


class AttendanceBase(models.Model):
    """Abstract base model for storing attendance-related photos.

    This model provides common fields for check-in and check-out photos,
    allowing other models like `Attendance` to inherit them. This promotes
    reusability and a consistent structure.

    Attributes:
        check_in_photo (ImageField): The photo taken at check-in.
        check_out_photo (ImageField): The photo taken at check-out.
    """

    check_in_photo = models.ImageField(
        upload_to="attendance/checkins/", null=True, blank=True
    )
    check_out_photo = models.ImageField(
        upload_to="attendance/checkouts/", null=True, blank=True
    )

    class Meta:
        abstract = True


class Attendance(AttendanceBase):
    """Represents an advisor's daily attendance record.

    This is the core model for tracking an advisor's work day. It stores
    check-in and check-out timestamps, location data, and the calculated
    metrics like worked hours and lateness. The record is linked to a specific
    user, store, shift, and date.

    The `date` field always refers to the calendar day on which the shift
    *starts*. For an overnight shift, the `check_out` may occur on the
    following calendar day, but the record remains associated with the start date.

    Attributes:
        user (ForeignKey): The advisor this record belongs to. The record is
            deleted if the user is deleted.
        store (ForeignKey): The store where the advisor worked. The store
            cannot be deleted while it has attendance records.
        date (DateField): The calendar date of the shift start.
        shift (ForeignKey): The shift assigned for this attendance record. The
            shift cannot be deleted while it has attendance records.
        check_in (DateTimeField): The timestamp of the advisor's check-in.
        check_in_lat (DecimalField): Latitude at check-in.
        check_in_lon (DecimalField): Longitude at check-in.
        check_out (DateTimeField): The timestamp of the advisor's check-out.
        check_out_lat (DecimalField): Latitude at check-out.
        check_out_lon (DecimalField): Longitude at check-out.
        worked_minutes (PositiveIntegerField): Total minutes worked, rounded.
        late_minutes (PositiveIntegerField): Minutes late past the grace period.
        early_out_minutes (PositiveIntegerField): Minutes short of the shift end.
        ot_minutes (PositiveIntegerField): Approved overtime minutes.
        status (CharField): The final status of the attendance record
            (e.g., 'PRESENT', 'ABSENT', 'HALF_DAY', 'PENDING_APPROVAL').
        notes (TextField): Any additional notes about the attendance.
        created_at (DateTimeField): Timestamp of creation.
        updated_at (DateTimeField): Timestamp of last update.

    Relationships:
        requests (RelatedManager): Reverse relationship to `AttendanceRequest`
            records associated with this attendance.

    Constraints:
        - `unique_user_date_shift`: Ensures only one attendance record exists
          for a user on a specific date for a given shift.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={"role": "advisor"},
        related_name="attendances",
        db_index=True,
    )
    store = models.ForeignKey(
        "store.Store", on_delete=models.PROTECT, related_name="attendances"
    )
    date = models.DateField(
        db_index=True,
        help_text="Attendance date is the shift START calendar day.",
    )
    shift = models.ForeignKey(
        "attendance.Shift", on_delete=models.PROTECT, related_name="attendances"
    )

    # Punches
    check_in = models.DateTimeField(null=True, blank=True)
    check_in_lat = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    check_in_lon = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )

    check_out = models.DateTimeField(null=True, blank=True)
    check_out_lat = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    check_out_lon = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )

    # Computed minutes (rounded to nearest 5 on finalize)
    worked_minutes = models.PositiveIntegerField(default=0)
    late_minutes = models.PositiveIntegerField(default=0)
    early_out_minutes = models.PositiveIntegerField(default=0)
    ot_minutes = models.PositiveIntegerField(
        default=0,
        help_text="Counted only when OT is approved in later phases.",
    )

    status = models.CharField(
        max_length=32, choices=AttendanceStatus, default="OPEN", db_index=True
    )
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "date", "shift"], name="unique_user_date_shift"
            ),
        ]
        indexes = [models.Index(fields=["store", "date"])]
        ordering = ["-date", "-created_at"]

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return f"{self.user} {self.date} {self.shift.name} [{self.status}]"

    # ---- Helpers ----
    @staticmethod
    def _round_nearest_minutes(value_minutes: int, bucket: int = 5) -> int:
        """Rounds a duration in minutes to the nearest specified bucket.

        This is a utility for standardizing time calculations. For example,
        rounding to the nearest 5 minutes. Ties are rounded up.

        Args:
            value_minutes (int): The number of minutes to round.
            bucket (int, optional): The minute interval to round to.
                Defaults to 5.

        Returns:
            int: The rounded number of minutes.
        """

        if bucket <= 1:
            return value_minutes
        q, r = divmod(value_minutes, bucket)
        return (q + (1 if r >= (bucket / 2) else 0)) * bucket

    def compute_worked_minutes(self, rounding_bucket: int = 5) -> int:
        """Calculates the total worked minutes between check-in and check-out.

        If either `check_in` or `check_out` is not set, this method returns 0.
        The duration is calculated in minutes and then rounded to the nearest
        specified interval.

        Args:
            rounding_bucket (int, optional): The minute interval for rounding.
                Defaults to 5.

        Returns:
            int: The total rounded worked minutes. Returns 0 if timing is
            incomplete.
        """

        if not self.check_in or not self.check_out:
            return 0
        delta = self.check_out - self.check_in
        minutes = max(0, int(delta.total_seconds() // 60))
        return self._round_nearest_minutes(minutes, rounding_bucket)

    def _shift_bounds_for_date(self):
        """Calculates the timezone-aware start and end datetimes for the shift.

        This helper method determines the exact start and end `datetime` objects
        for the attendance record's assigned shift on its specific date. It
        correctly handles overnight shifts by advancing the end date by one day.

        Returns:
            tuple[datetime, datetime]: A tuple containing the timezone-aware
            start and end datetimes of the shift.
        """

        tz = timezone.get_current_timezone()
        start = timezone.make_aware(
            datetime.combine(self.date, self.shift.start_time), tz
        )
        end_date = (
            self.date + timedelta(days=1)
            if (self.shift.is_overnight or self.shift.end_time <= self.shift.start_time)
            else self.date
        )
        end = timezone.make_aware(datetime.combine(end_date, self.shift.end_time), tz)
        return start, end

    def apply_grace_and_status(
        self, grace_minutes: int = 15, halfday_threshold: int = 360
    ) -> None:
        """Calculates and sets metrics like late minutes, worked minutes, and status.

        This method is called to finalize an attendance record. It computes:
        - `late_minutes`: How many minutes the user checked in after the shift's
          start time, considering a grace period.
        - `early_out_minutes`: How many minutes the user checked out before the
          shift's scheduled end time.
        - `worked_minutes`: The total rounded duration between check-in and check-out.
        - `status`: The final status ('PRESENT', 'HALF_DAY', 'ABSENT'), based
          on the number of minutes worked.

        Note:
            This method does not set the 'PENDING_APPROVAL' status, which is
            handled at the view/API level based on business rules like geofence
            violations. It modifies the instance attributes directly but does
            not save the instance.

        Args:
            grace_minutes (int, optional): The grace period in minutes for late
                check-ins. Defaults to 15.
            halfday_threshold (int, optional): The minimum minutes required to be
                considered 'PRESENT'. Below this is a 'HALF_DAY'. Defaults to 360.

        Example:
            >>> from datetime import time, date, datetime
            >>> from django.utils import timezone
            >>> # Note: This is a simplified example. In practice, you would
            >>> # use model instances retrieved from the database.
            >>> shift = Shift(start_time=time(9, 0), end_time=time(17, 0))
            >>> attendance = Attendance(shift=shift, date=date(2023, 1, 1))
            >>> attendance.check_in = timezone.make_aware(datetime(2023, 1, 1, 9, 20))
            >>> attendance.check_out = timezone.make_aware(datetime(2023, 1, 1, 17, 0))
            >>> attendance.apply_grace_and_status(grace_minutes=15)
            >>> print(f"Late minutes: {attendance.late_minutes}")
            Late minutes: 5
            >>> print(f"Status: {attendance.status}")
            Status: PRESENT
        """

        start_dt, end_dt = self._shift_bounds_for_date()

        if self.check_in:
            late = max(
                0,
                int(
                    (
                        self.check_in - (start_dt + timedelta(minutes=grace_minutes))
                    ).total_seconds()
                    // 60
                ),
            )
        else:
            late = 0

        if self.check_out:
            early = max(
                0,
                int(((end_dt) - self.check_out).total_seconds() // 60),
            )
        else:
            early = 0

        worked = self.compute_worked_minutes(rounding_bucket=5)

        self.late_minutes = late
        self.early_out_minutes = early
        self.worked_minutes = worked

        if worked >= halfday_threshold:
            self.status = "PRESENT"
        elif worked > 0:
            self.status = "HALF_DAY"
        else:
            if not self.check_in and not self.check_out:
                self.status = "ABSENT"

    @property
    def is_open(self) -> bool:
        """Checks if the attendance record is still open.

        An attendance record is considered 'open' if the status is 'OPEN' and
        the `check_out` timestamp has not yet been recorded. This is a common
        check to see if an advisor is currently clocked in.

        Returns:
            bool: True if the user has checked in but not yet checked out.
        """

        return self.status == "OPEN" and self.check_out is None

    def clean(self) -> None:
        """Performs validation on the attendance record before saving.

        This method checks for several business rule violations:
        - Ensures the user has the 'advisor' role.
        - Verifies that the assigned shift is active.
        - Confirms the attendance store matches the user's assigned store.

        Raises:
            ValidationError: If any of the validation checks fail.
        """

        errors = {}
        if self.user and getattr(self.user, "role", None) != "advisor":
            errors["user"] = "Attendance records are only for advisors."
        if self.shift and not self.shift.is_active:
            errors["shift"] = "Shift must be active."
        if (
            self.user
            and self.store
            and getattr(self.user, "store_id", None)
            and self.store_id != self.user.store_id
        ):
            # TODO: confirm policy on enforcing user's default store
            errors["store"] = "Store must match user's store."
        if errors:
            raise ValidationError(errors)
        super().clean()


class AttendanceRequest(models.Model):
    """A request for approval related to an `Attendance` record.

    This model is used to manage workflows that require supervisor approval,
    such as checking in outside the designated geofence, requesting overtime,
    or making manual adjustments to attendance times. These requests are
    typically created automatically or by an advisor and then actioned by a
    branch head or system admin.

    Attributes:
        attendance (ForeignKey): The `Attendance` record this request relates
            to. The request is deleted if the attendance record is deleted.
        type (CharField): The type of request (e.g., 'OUTSIDE_GEOFENCE', 'OT', 'ADJUST').
        requested_by (ForeignKey): The user who initiated the request. The
            user cannot be deleted if they made a request.
        reason (TextField): Justification for the request.
        status (CharField): The current status of the request ('PENDING',
            'APPROVED', 'REJECTED').
        decided_by (ForeignKey, optional): The user who approved or rejected
            it. The user cannot be deleted if they decided on a request.
        decided_at (DateTimeField, optional): Timestamp of the decision.
        created_at (DateTimeField): Timestamp of creation.
        updated_at (DateTimeField): Timestamp of last update.
        meta (JSONField): A flexible field to store request-specific data,
            e.g., `{"requested_minutes": 60}` for an OT request.

    Example:
        >>> attendance_record = Attendance.objects.first()
        >>> admin_user = CustomUser.objects.get(username='admin')
        >>> req = AttendanceRequest.objects.create(
        ...     attendance=attendance_record,
        ...     type='OUTSIDE_GEOFENCE',
        ...     requested_by=attendance_record.user,
        ...     reason='Client meeting off-site.'
        ... )
        >>> req.approve(actor=admin_user)
        >>> req.status
        'APPROVED'
    """

    attendance = models.ForeignKey(
        "attendance.Attendance",
        on_delete=models.CASCADE,
        related_name="requests",
    )
    type = models.CharField(max_length=32, choices=RequestType)
    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="attendance_requests_made",
    )
    reason = models.TextField(blank=True)
    status = models.CharField(
        max_length=16,
        choices=RequestStatus,
        default="PENDING",
        db_index=True,
    )
    decided_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="attendance_requests_decided",
    )
    decided_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Free-form payload for request-specific data. Examples:
    #  - OT: {"requested_minutes": 90}
    #  - ADJUST: {"set_check_in": "...", "set_check_out": "..."}
    meta = models.JSONField(default=dict, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["status", "type"], name="attendance__status_type_idx"),
            models.Index(fields=["created_at"], name="attendance__created_at_idx"),
        ]
        ordering = ["-created_at"]

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return (
            f"Req[{self.type}] {self.attendance.user} "
            f"{self.attendance.date} -> {self.status}"
        )

    # ---- Decision helpers ----
    def approve(self, actor) -> None:
        """Marks the request as 'APPROVED' and applies side-effects.

        This method sets the request status to 'APPROVED', records the actor
        who made the decision, and sets the decision timestamp.

        It then applies logic based on the request `type`:
        - **OT**: Updates `ot_minutes` on the related `Attendance` record.
        - **ADJUST**: Updates `check_in` or `check_out` times on the
          `Attendance` record based on `meta` data, then re-runs
          `apply_grace_and_status` to recalculate metrics.
        - **OUTSIDE_GEOFENCE, LATE**: No direct field changes on approval; the
          approval itself is the desired outcome.

        Args:
            actor: The user instance (e.g., branch head, admin) approving
                the request.
        """

        from django.utils import timezone

        if self.status != "PENDING":
            return
        self.status = "APPROVED"
        self.decided_by = actor
        self.decided_at = timezone.now()

        att = self.attendance

        if self.type == "OT":
            minutes = int(self.meta.get("requested_minutes", 0))
            att.ot_minutes = max(0, min(minutes, 480))  # cap at 8h
            att.save(update_fields=["ot_minutes", "updated_at"])

        elif self.type == "ADJUST":
            from django.utils import dateparse, timezone as _tz

            changed = []
            if "set_check_in" in self.meta and self.meta["set_check_in"]:
                dt = dateparse.parse_datetime(self.meta["set_check_in"])
                if dt and _tz.is_naive(dt):
                    dt = _tz.make_aware(dt, _tz.get_current_timezone())
                att.check_in = dt
                changed.append("check_in")
            if "set_check_out" in self.meta and self.meta["set_check_out"]:
                dt = dateparse.parse_datetime(self.meta["set_check_out"])
                if dt and _tz.is_naive(dt):
                    dt = _tz.make_aware(dt, _tz.get_current_timezone())
                att.check_out = dt
                changed.append("check_out")
            if changed:
                att.apply_grace_and_status(grace_minutes=15, halfday_threshold=360)
                changed += [
                    "worked_minutes",
                    "late_minutes",
                    "early_out_minutes",
                    "status",
                    "updated_at",
                ]
                att.save(update_fields=changed)

        elif self.type == "OUTSIDE_GEOFENCE":
            # No direct field changes; approval allows existing status to stand.
            pass

        # ``LATE`` has no attendance field updates.

        self.save(update_fields=["status", "decided_by", "decided_at", "updated_at"])

    def reject(self, actor) -> None:
        """Marks the request as 'REJECTED'.

        This method sets the request status to 'REJECTED', records the actor
        who made the decision, and sets the decision timestamp. No other
        side-effects are applied to the attendance record.

        Args:
            actor: The user instance (e.g., branch head, admin) rejecting
                the request.
        """

        from django.utils import timezone

        if self.status != "PENDING":
            return
        self.status = "REJECTED"
        self.decided_by = actor
        self.decided_at = timezone.now()
        self.save(update_fields=["status", "decided_by", "decided_at", "updated_at"])

    def clean(self) -> None:
        """Validates request-specific data stored in the `meta` field.

        This method ensures that requests with specific `type` values have the
        required data in their `meta` field. For example, an 'OT' (overtime)
        request must include a positive integer for `requested_minutes`.

        Raises:
            ValidationError: If the `meta` field is missing required data for
                the given request `type`.
        """

        errors = {}
        if self.type == "OT":
            minutes = self.meta.get("requested_minutes")
            if not isinstance(minutes, int) or minutes <= 0:
                errors["meta"] = (
                    "OT requests require a positive integer 'requested_minutes'."
                )
        if errors:
            raise ValidationError(errors)
        super().clean()


def resolve_planned_shift(user, target_date: date) -> Optional["Shift"]:
    """Determines the planned `Shift` for a user on a specific date.

    This function orchestrates the schedule resolution logic by checking for
    a shift in a specific order of precedence:
    1. **Weekly Off-Days (`WeekOff`)**: Checks if the day is a recurring day off.
    2. **Schedule Exceptions (`ScheduleException`)**: Checks for any single-day
       overrides, such as a holiday or a temporary shift change.
    3. **Default Schedule (`AdvisorSchedule`)**: Falls back to the user's
       standard fixed or alternating weekly schedule.

    If any of the higher-priority rules result in a day off (e.g., `mark_off`
    is True or it's a `WeekOff` day), the function will return `None`.

    Args:
        user: The user instance for whom to resolve the shift.
        target_date (date): The specific date to check.

    Returns:
        Optional["Shift"]: The `Shift` object if a shift is scheduled for that
        day, otherwise `None` to indicate a day off.

    Example:
        >>> from datetime import date
        >>> from django.contrib.auth import get_user_model
        >>> # Note: This is a simplified example that assumes a database state.
        >>> User = get_user_model()
        >>> advisor = User.objects.filter(role='advisor').first()
        >>> if advisor:
        ...     # On a normal workday, their shift is resolved.
        ...     work_date = date(2023, 10, 26) # A Thursday
        ...     # Make sure there isn't a week off for this day
        ...     WeekOff.objects.filter(user=advisor, weekday=work_date.weekday()).delete()
        ...     shift = resolve_planned_shift(advisor, work_date)
        ...     print(f"Shift for {work_date}: {shift.name if shift else 'Day Off'}")
        ...
        ...     # Now, add a weekly off day for Thursday.
        ...     WeekOff.objects.create(user=advisor, weekday=work_date.weekday())
        ...     shift = resolve_planned_shift(advisor, work_date)
        ...     print(f"Shift for {work_date}: {shift.name if shift else 'Day Off'}")
    """

    # Step 1: Check weekly off-days
    if WeekOff.objects.filter(
        user=user, weekday=target_date.weekday(), is_active=True
    ).exists():
        return None

    # Step 2: Specific date exceptions
    try:
        exc = ScheduleException.objects.get(user=user, date=target_date)
    except ScheduleException.DoesNotExist:
        exc = None

    if exc:
        if exc.mark_off:
            return None
        if exc.override_shift:
            return exc.override_shift

    # Step 3: Fall back to default schedule
    try:
        schedule = AdvisorSchedule.objects.get(user=user, is_active=True)
    except AdvisorSchedule.DoesNotExist:
        return None

    return schedule.resolve_shift_for(target_date)


# ---------------------------------------------------------------------------
# Signals
# ---------------------------------------------------------------------------


@receiver(post_save, sender=Attendance)
def finalize_attendance(sender, instance: Attendance, created, update_fields, **kwargs):
    """Signal handler to finalize attendance metrics upon check-out.

    This `post_save` signal is triggered whenever an `Attendance` instance is
    saved. It checks if a `check_out` time has been set (or updated). If so,
    it calls `apply_grace_and_status()` to calculate the final worked minutes,
    lateness, and status, then saves the updated instance.

    To prevent an infinite loop from the `save()` call within the signal, it
    checks the `update_fields` argument. If the save operation that triggered
    the signal only contained fields that this signal itself computes, it exits early.

    Args:
        sender: The model class that sent the signal (`Attendance`).
        instance (Attendance): The actual instance being saved.
        created (bool): True if a new record was created.
        update_fields (set): A set of fields being updated, if specified in save().
        **kwargs: Wildcard keyword arguments.
    """

    computed_fields = {"worked_minutes", "late_minutes", "early_out_minutes", "status"}
    if update_fields and set(update_fields).issubset(computed_fields):
        return
    if instance.check_out:
        instance.apply_grace_and_status()
        instance.save(update_fields=list(computed_fields))