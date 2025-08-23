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
def test_booking_creation(monkeypatch):
    client = APIClient()
    monkeypatch.setattr(requests, "post", _captcha_ok)
    data = {
        "name": "John",
        "email": "j@example.com",
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
        "date": "2024-01-01",
        "time": "10:00",
        "message": "hi",
        "captcha_token": "bad",
    }
    resp = client.post("/api/bookings", data)
    assert resp.status_code == 400


@pytest.mark.django_db
def test_booking_list_admin_only(monkeypatch):
    Booking.objects.create(name="A", email="a@b.com", date="2024-01-01", time="09:00")
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
