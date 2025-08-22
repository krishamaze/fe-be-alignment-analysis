"""Database models for the attendance app.

Note:
    * Attendance records for an overnight shift use the shift's **start date**
      as the attendance date.
    * Punch durations are rounded to the nearest 5 minutes.
    * A grace period of 15 minutes applies for late check-ins.
    * Half-day threshold is 6 hours (360 minutes).
    * End-of-day auto-absence and approval workflows are implemented in later
      phases.
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
    """Lightweight storage for idempotent writes.

    Stores a mapping of ``Idempotency-Key`` + ``endpoint`` + ``user`` to the
    primary key of the object that was created or updated. Subsequent requests
    with the same key simply return the previously stored object.
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
    """Represents a working shift for advisors."""

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
        """Return the total shift duration in minutes.

        If ``is_overnight`` is ``True`` or ``end_time`` is less than or equal to
        ``start_time``, the shift is treated as crossing midnight.
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
    """Payroll configuration for an advisor."""

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
    """Represents an advisor's default scheduling rule."""

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
        """Validate scheduling rules before saving."""

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
        """Resolve the planned :class:`Shift` for the given date.

        This method ignores WeekOff and exception rules which are handled by
        :func:`resolve_planned_shift`.
        """

        if self.rule_type == "fixed":
            return self.default_shift

        # Alternate weekly scheduling
        weeks = max(0, (day - self.anchor_monday).days // 7)
        parity = (weeks % 2) ^ self.parity_offset
        return self.week_even_shift if parity == 0 else self.week_odd_shift


class WeekOff(models.Model):
    """Weekly off-days for an advisor."""

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
    """Per-day schedule overrides and off-day markers."""

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
    """Abstract base model providing selfie fields for attendance records."""

    check_in_photo = models.ImageField(
        upload_to="attendance/checkins/", null=True, blank=True
    )
    check_out_photo = models.ImageField(
        upload_to="attendance/checkouts/", null=True, blank=True
    )

    class Meta:
        abstract = True


class Attendance(AttendanceBase):
    """Daily punch record for an advisor.

    The ``date`` field always refers to the calendar day on which the shift
    *starts*; for overnight shifts the ``check_out`` may occur on the following
    day but the record remains tied to the start date.
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
        """Round to nearest ``bucket`` minutes (ties -> round half up)."""

        if bucket <= 1:
            return value_minutes
        q, r = divmod(value_minutes, bucket)
        return (q + (1 if r >= (bucket / 2) else 0)) * bucket

    def compute_worked_minutes(self, rounding_bucket: int = 5) -> int:
        """Compute worked minutes between ``check_in`` and ``check_out``.

        If either is missing, ``0`` is returned. The result is rounded to the
        nearest ``rounding_bucket`` minutes.
        """

        if not self.check_in or not self.check_out:
            return 0
        delta = self.check_out - self.check_in
        minutes = max(0, int(delta.total_seconds() // 60))
        return self._round_nearest_minutes(minutes, rounding_bucket)

    def _shift_bounds_for_date(self):
        """Return (shift_start_dt, shift_end_dt) in local timezone-aware dts."""

        tz = timezone.get_current_timezone()
        start = timezone.make_aware(
            datetime.combine(self.date, self.shift.start_time), tz
        )
        end_date = (
            self.date + timedelta(days=1)
            if (self.shift.is_overnight or self.shift.end_time <= self.shift.start_time)
            else self.date
        )
        end = timezone.make_aware(
            datetime.combine(end_date, self.shift.end_time), tz
        )
        return start, end

    def apply_grace_and_status(
        self, grace_minutes: int = 15, halfday_threshold: int = 360
    ) -> None:
        """Compute late/early/worked minutes and set ``status``.

        - ``late`` = max(0, check_in - shift_start - grace)
        - ``early_out`` = max(0, shift_end - check_out)
        - ``worked`` = rounded minutes between check_in/out
        - ``status`` is determined by ``worked`` against ``halfday_threshold``

        ``PENDING_APPROVAL`` is applied by API endpoints when geofence or other
        checks fail.
        """

        start_dt, end_dt = self._shift_bounds_for_date()

        if self.check_in:
            late = max(
                0,
                int(
                    (
                        self.check_in
                        - (start_dt + timedelta(minutes=grace_minutes))
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
        """Return ``True`` if attendance is open (no checkout yet)."""

        return self.status == "OPEN" and self.check_out is None

    def clean(self) -> None:
        """Validate the attendance record before saving."""

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
    """Approval request attached to an :class:`Attendance` record.

    Outside Geofence and Late requests are generated automatically at punch
    time. Branch Head or Admin users will later approve or reject these via
    dedicated endpoints. Approval of ``ADJUST`` requests must recompute
    attendance metrics.
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
            models.Index(
                fields=["status", "type"], name="attendance__status_type_idx"
            ),
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
        """Approve the request and apply side-effects to the attendance."""

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
        """Mark the request as rejected."""

        from django.utils import timezone

        if self.status != "PENDING":
            return
        self.status = "REJECTED"
        self.decided_by = actor
        self.decided_at = timezone.now()
        self.save(update_fields=["status", "decided_by", "decided_at", "updated_at"])

    def clean(self) -> None:
        """Validate request-specific requirements before saving."""

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
    """Resolve the planned :class:`Shift` for a user on a given date.

    The evaluation order is:

    1. :class:`WeekOff` rules – if the weekday is marked off, the user is off.
    2. :class:`ScheduleException` – explicit per-day overrides or off-day flags.
    3. :class:`AdvisorSchedule` – the user's default schedule.

    WeekOff and exception rules are evaluated before the default schedule. If no
    shift is determined, ``None`` is returned to indicate an off-day.
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
    """Recompute minutes and status when an attendance is finalized.

    When ``check_out`` is set the record is considered finalized. We recompute
    the derived minute fields and update the status accordingly. ``update_fields``
    is inspected to avoid infinite save loops when the signal saves the model
    again.
    """

    computed_fields = {"worked_minutes", "late_minutes", "early_out_minutes", "status"}
    if update_fields and set(update_fields).issubset(computed_fields):
        return
    if instance.check_out:
        instance.apply_grace_and_status()
        instance.save(update_fields=list(computed_fields))

