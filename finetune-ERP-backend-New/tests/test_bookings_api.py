import requests
import pytest
from django.conf import settings
from django.test.utils import override_settings
from rest_framework.test import APIClient
from accounts.models import CustomUser
from bookings.models import Booking


class DummyResponse:
    def __init__(self, success: bool):
        self.success = success

    def json(self):
        return {"success": self.success}


def _captcha_ok(*args, **kwargs):
    return DummyResponse(True)


def _captcha_fail(*args, **kwargs):
    return DummyResponse(False)


@pytest.mark.django_db
@override_settings(
    REST_FRAMEWORK={
        **settings.REST_FRAMEWORK,
        "DEFAULT_THROTTLE_RATES": {"booking": "1/min"},
    }
)
def test_booking_creation_public(monkeypatch):
    client = APIClient()
    monkeypatch.setattr(requests, "post", _captcha_ok)
    data = {
        "name": "John",
        "email": "j@example.com",
        "issue": "screen",
        "date": "2024-01-01",
        "time": "10:00",
        "message": "hi",
        "captcha_token": "tok",
    }
    resp = client.post("/api/bookings", data)
    assert resp.status_code == 201
    assert Booking.objects.count() == 1


@pytest.mark.django_db
def test_booking_invalid_captcha(monkeypatch):
    client = APIClient()
    monkeypatch.setattr(requests, "post", _captcha_fail)
    data = {
        "name": "John",
        "email": "j@example.com",
        "issue": "screen",
        "date": "2024-01-01",
        "time": "10:00",
        "message": "hi",
        "captcha_token": "bad",
    }
    resp = client.post("/api/bookings", data)
    assert resp.status_code == 400


@pytest.mark.django_db
def test_booking_list_admin_only(monkeypatch):
    Booking.objects.create(
        name="A", email="a@b.com", issue="screen", date="2024-01-01", time="09:00"
    )
    client = APIClient()
    # anonymous should not access list
    resp = client.get("/api/bookings")
    assert resp.status_code in (401, 403)

    user = CustomUser.objects.create_user(
        username="admin", email="a@b.com", password="x", role="system_admin"
    )
    client.force_authenticate(user=user)
    resp = client.get("/api/bookings")
    assert resp.status_code == 200
    assert resp.json()["content"][0]["name"] == "A"


@pytest.mark.django_db
@override_settings(
    REST_FRAMEWORK={
        **settings.REST_FRAMEWORK,
        "DEFAULT_THROTTLE_RATES": {"booking": "1/min"},
    }
)
def test_booking_staff_bypasses_throttle(monkeypatch):
    monkeypatch.setattr(requests, "post", _captcha_ok)
    client = APIClient()
    staff = CustomUser.objects.create_user(
        username="admin", email="a@example.com", password="x", role="system_admin"
    )
    client.force_authenticate(user=staff)
    data = {
        "name": "John",
        "email": "j@example.com",
        "issue": "screen",
        "date": "2024-01-01",
        "time": "10:00",
        "message": "hi",
        "captcha_token": "tok",
    }
    for _ in range(6):
        assert client.post("/api/bookings", data).status_code == 201


@pytest.mark.django_db
def test_invalid_status_transition(monkeypatch):
    monkeypatch.setattr(requests, "post", _captcha_ok)
    client = APIClient()
    data = {
        "name": "John",
        "email": "j@example.com",
        "issue": "screen",
        "date": "2024-01-01",
        "time": "10:00",
        "message": "hi",
        "captcha_token": "tok",
    }
    resp = client.post("/api/bookings", data)
    booking_id = resp.json()["id"]
    user = CustomUser.objects.create_user(
        username="admin", email="a@b.com", password="x", role="system_admin"
    )
    client.force_authenticate(user=user)
    resp = client.patch(f"/api/bookings/{booking_id}", {"status": "completed"})
    assert resp.status_code == 400


@pytest.mark.django_db
def test_status_change_requires_admin(monkeypatch):
    monkeypatch.setattr(requests, "post", _captcha_ok)
    client = APIClient()
    data = {
        "name": "John",
        "email": "j@example.com",
        "issue": "screen",
        "date": "2024-01-01",
        "time": "10:00",
        "message": "hi",
        "captcha_token": "tok",
    }
    resp = client.post("/api/bookings", data)
    booking_id = resp.json()["id"]
    # attempt to update without admin
    resp = client.patch(f"/api/bookings/{booking_id}", {"status": "approved"})
    assert resp.status_code in (401, 403)


@pytest.mark.django_db
def test_cancel_and_reject_require_reason(monkeypatch):
    monkeypatch.setattr(requests, "post", _captcha_ok)
    client = APIClient()
    data = {
        "name": "John",
        "email": "j@example.com",
        "issue": "screen",
        "date": "2024-01-01",
        "time": "10:00",
        "message": "hi",
        "captcha_token": "tok",
    }
    resp = client.post("/api/bookings", data)
    booking_id = resp.json()["id"]
    user = CustomUser.objects.create_user(
        username="admin", email="a@b.com", password="x", role="system_admin"
    )
    client.force_authenticate(user=user)
    # reject without reason
    resp = client.patch(f"/api/bookings/{booking_id}", {"status": "rejected"})
    assert resp.status_code == 400
    resp = client.patch(
        f"/api/bookings/{booking_id}",
        {"status": "rejected", "reason": "invalid"},
    )
    assert resp.status_code == 200
    # new booking for cancel test
    resp = client.post("/api/bookings", data)
    booking_id = resp.json()["id"]
    resp = client.patch(f"/api/bookings/{booking_id}", {"status": "cancelled"})
    assert resp.status_code == 400
    resp = client.patch(
        f"/api/bookings/{booking_id}",
        {"status": "cancelled", "reason": "customer request"},
    )
    assert resp.status_code == 200


@pytest.mark.django_db
@override_settings(
    BOOKING_NOTIFICATION_CHANNELS=["email", "sms"],
    SMS_GATEWAY_URL="http://sms",
    REST_FRAMEWORK={
        **settings.REST_FRAMEWORK,
        "DEFAULT_THROTTLE_RATES": {"booking": "5/hour"},
    },
)
def test_booking_notifications(monkeypatch):
    sent = {}

    def _send_mail(subject, message, from_email, recipient_list, fail_silently):
        sent["email"] = (subject, message, tuple(recipient_list))

    def _sms(url, data=None, timeout=5):
        sent.setdefault("sms", []).append((url, data))
        return DummyResponse(True)

    monkeypatch.setattr(requests, "post", _captcha_ok)
    monkeypatch.setattr("bookings.notifications.send_mail", _send_mail)
    monkeypatch.setattr("bookings.notifications.requests.post", _sms)
    client = APIClient()
    user = CustomUser.objects.create_user(
        username="cust",
        email="c@example.com",
        password="x",
        role="customer",
        phone="1234567890",
    )
    client.force_authenticate(user=user)
    data = {
        "name": "John",
        "email": "j@example.com",
        "issue": "screen",
        "date": "2024-01-01",
        "time": "10:00",
        "message": "hi",
        "captcha_token": "tok",
    }
    resp = client.post("/api/bookings", data)
    assert resp.status_code == 201
    booking_id = resp.json()["id"]
    # cancel with reason to trigger notification
    admin = CustomUser.objects.create_user(
        username="admin", email="a@b.com", password="x", role="system_admin"
    )
    client.force_authenticate(user=admin)
    sent.clear()
    resp = client.patch(
        f"/api/bookings/{booking_id}",
        {"status": "cancelled", "reason": "changed plans"},
    )
    assert resp.status_code == 200
    assert "email" in sent and "sms" in sent
    assert "changed plans" in sent["email"][1]
