import pytest
from datetime import time
from attendance.models import Shift


@pytest.mark.django_db
def test_day_shift_total_minutes_and_str(day_shift):
    assert day_shift.total_minutes() == 540
    assert str(day_shift) == "Day (09:00:00–18:00:00)"


@pytest.mark.django_db
def test_night_shift_total_minutes(night_shift):
    assert night_shift.total_minutes() == 480


@pytest.mark.django_db
def test_end_before_start_treated_as_overnight(db):
    s = Shift.objects.create(name="Weird", start_time=time(22, 0), end_time=time(6, 0))
    assert s.total_minutes() == 480
