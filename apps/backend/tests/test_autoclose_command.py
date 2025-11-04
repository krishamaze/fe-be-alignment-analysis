import pytest
from datetime import date
from django.core.management import call_command
from attendance.models import Attendance, AdvisorSchedule


@pytest.mark.django_db
def test_night_shift_absent_created_and_idempotent(advisor1, night_shift, store_s1):
    AdvisorSchedule.objects.create(
        user=advisor1,
        rule_type="fixed",
        anchor_monday=date(2025, 8, 11),
        default_shift=night_shift,
    )
    call_command("attendance_autoclose", date="2025-08-12")
    att = Attendance.objects.get(user=advisor1, date=date(2025, 8, 12))
    assert att.status == "ABSENT"
    assert att.shift == night_shift
    # run again should not create new attendance
    call_command("attendance_autoclose", date="2025-08-12")
    assert Attendance.objects.filter(user=advisor1, date=date(2025, 8, 12)).count() == 1


@pytest.mark.django_db
def test_open_attendance_finalized_and_idempotent(
    advisor1, day_shift, store_s1, localdt
):
    att = Attendance.objects.create(
        user=advisor1,
        store=store_s1,
        date=date(2025, 8, 13),
        shift=day_shift,
        check_in=localdt(2025, 8, 13, 9, 0),
        status="OPEN",
    )
    call_command("attendance_autoclose", date="2025-08-13")
    att.refresh_from_db()
    assert att.check_out is not None
    assert att.status == "PRESENT"
    first_checkout = att.check_out
    call_command("attendance_autoclose", date="2025-08-13")
    att.refresh_from_db()
    assert att.check_out == first_checkout
    assert Attendance.objects.filter(user=advisor1, date=date(2025, 8, 13)).count() == 1
