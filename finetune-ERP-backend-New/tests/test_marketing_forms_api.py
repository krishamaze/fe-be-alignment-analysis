import requests
import pytest
from django.conf import settings
from django.test.utils import override_settings
from rest_framework.test import APIClient
from marketing.models import Contact, ScheduleCall


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
        "DEFAULT_THROTTLE_RATES": {"contact": "1/min", "schedule_call": "1/min"},
    }
)
def test_contact_form_submission(monkeypatch):
    client = APIClient()
    monkeypatch.setattr(requests, "post", _captcha_ok)
    data = {
        "name": "John",
        "mobile_no": "1234567890",
        "message": "hi",
        "captcha_token": "tok",
    }
    resp = client.post("/api/marketing/contact/", data)
    assert resp.status_code == 201
    assert Contact.objects.count() == 1


@pytest.mark.django_db
def test_contact_form_invalid_captcha(monkeypatch):
    client = APIClient()
    monkeypatch.setattr(requests, "post", _captcha_fail)
    data = {
        "name": "John",
        "mobile_no": "",
        "message": "",
        "captcha_token": "bad",
    }
    resp = client.post("/api/marketing/contact/", data)
    assert resp.status_code == 400


@pytest.mark.django_db
@override_settings(
    REST_FRAMEWORK={
        **settings.REST_FRAMEWORK,
        "DEFAULT_THROTTLE_RATES": {"contact": "1/min", "schedule_call": "1/min"},
    }
)
def test_schedule_call_submission(monkeypatch):
    client = APIClient()
    monkeypatch.setattr(requests, "post", _captcha_ok)
    data = {
        "name": "John",
        "date": "2024-01-01",
        "time": "10:00",
        "message": "hi",
        "captcha_token": "tok",
    }
    resp = client.post("/api/marketing/schedule-call/", data)
    assert resp.status_code == 201
    assert ScheduleCall.objects.count() == 1
