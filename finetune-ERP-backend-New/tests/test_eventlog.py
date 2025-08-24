import pytest
from datetime import date, time as dtime
from bookings.models import Booking
from activity.models import EventLog
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_eventlog_booking_crud(admin_user):
    booking = Booking.objects.create(
        name="Test", email="a@example.com", date=date.today(), time=dtime(9, 0)
    )
    assert EventLog.objects.filter(
        entity_type="booking", entity_id=str(booking.id), action="created"
    ).exists()

    booking.status = "cancelled"
    booking.reason = "user cancel"
    booking.save()
    assert EventLog.objects.filter(action="updated", reason="user cancel").exists()

    bid = booking.id
    booking.delete()
    assert EventLog.objects.filter(entity_id=str(bid), action="deleted").exists()


@pytest.mark.django_db
def test_eventlog_filtering(admin_user):
    Booking.objects.create(
        name="Test2", email="b@example.com", date=date.today(), time=dtime(10, 0)
    )
    admin_user.is_staff = True
    admin_user.save()
    api = APIClient()
    api.force_authenticate(user=admin_user)
    resp = api.get("/api/logs/", {"entity_type": "booking"})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 1
