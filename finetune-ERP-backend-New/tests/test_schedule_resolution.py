import pytest
from datetime import date, timedelta
from attendance.models import (
    AdvisorSchedule,
    WeekOff,
    ScheduleException,
    resolve_planned_shift,
)


@pytest.mark.django_db
def test_fixed_schedule_returns_default_shift(advisor1, day_shift):
    anchor = date(2025, 8, 11)  # Monday
    AdvisorSchedule.objects.create(
        user=advisor1,
        rule_type="fixed",
        anchor_monday=anchor,
        default_shift=day_shift,
    )
    resolved = resolve_planned_shift(advisor1, date(2025, 8, 12))
    assert resolved == day_shift


@pytest.mark.django_db
def test_alternate_weekly_parity(advisor1, advisor2, day_shift, night_shift):
    anchor = date(2025, 8, 11)  # Monday
    AdvisorSchedule.objects.create(
        user=advisor1,
        rule_type="alternate_weekly",
        anchor_monday=anchor,
        week_even_shift=day_shift,
        week_odd_shift=night_shift,
        parity_offset=0,
    )
    AdvisorSchedule.objects.create(
        user=advisor2,
        rule_type="alternate_weekly",
        anchor_monday=anchor,
        week_even_shift=day_shift,
        week_odd_shift=night_shift,
        parity_offset=1,
    )
    assert resolve_planned_shift(advisor1, anchor) == day_shift
    assert resolve_planned_shift(advisor1, anchor + timedelta(days=7)) == night_shift
    assert resolve_planned_shift(advisor2, anchor) == night_shift
    assert resolve_planned_shift(advisor2, anchor + timedelta(days=7)) == day_shift


@pytest.mark.django_db
def test_weekoff_and_schedule_exception(advisor1, day_shift, night_shift):
    anchor = date(2025, 8, 11)
    AdvisorSchedule.objects.create(
        user=advisor1,
        rule_type="fixed",
        anchor_monday=anchor,
        default_shift=day_shift,
    )
    # WeekOff on Wednesday (weekday=2)
    WeekOff.objects.create(user=advisor1, weekday=2)
    wednesday = date(2025, 8, 13)
    assert resolve_planned_shift(advisor1, wednesday) is None

    # ScheduleException mark_off
    off_date = date(2025, 8, 14)
    ScheduleException.objects.create(
        user=advisor1,
        date=off_date,
        mark_off=True,
        created_by=advisor1,
    )
    assert resolve_planned_shift(advisor1, off_date) is None

    # ScheduleException override_shift
    override_date = date(2025, 8, 15)
    ScheduleException.objects.create(
        user=advisor1,
        date=override_date,
        override_shift=night_shift,
        created_by=advisor1,
    )
    assert resolve_planned_shift(advisor1, override_date) == night_shift
