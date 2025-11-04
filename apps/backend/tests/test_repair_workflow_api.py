import pytest
import requests
from django.conf import settings
from django.test.utils import override_settings
from rest_framework.test import APIClient
from accounts.models import CustomUser
from bookings.models import Booking, Issue, Question


class DummyResponse:
    def __init__(self, success: bool):
        self.success = success

    def json(self):
        return {"success": self.success}


def _captcha_ok(*args, **kwargs):
    return DummyResponse(True)


@pytest.mark.django_db
def test_issue_crud_requires_admin():
    client = APIClient()
    # anonymous cannot create
    assert client.post("/api/issues", {"issue_name": "Battery"}).status_code in (401, 403)
    admin = CustomUser.objects.create_user(
        username="admin", email="a@b.com", password="x", role="system_admin"
    )
    client.force_authenticate(admin)
    assert client.post("/api/issues", {"issue_name": "Battery"}).status_code == 201
    assert (
        client.post("/api/otherissues", {"other_issue": "Other"}).status_code == 201
    )
    assert (
        client.post(
            "/api/questions", {"question_set_name": "A", "question": "Q?"}
        ).status_code
        == 201
    )


@pytest.mark.django_db
@override_settings(
    REST_FRAMEWORK={
        **settings.REST_FRAMEWORK,
        "DEFAULT_THROTTLE_RATES": {"booking": "1/min"},
    }
)
def test_booking_with_nested_details_and_responses(monkeypatch):
    monkeypatch.setattr(requests, "post", _captcha_ok)
    client = APIClient()
    issue = Issue.objects.create(issue_name="Screen")
    question = Question.objects.create(question_set_name="A", question="Is it working?")
    data = {
        "name": "John",
        "email": "j@example.com",
        "date": "2024-01-01",
        "time": "10:00",
        "captcha_token": "tok",
        "details": {"issues": [issue.id], "brand": "Apple", "product": "iPhone"},
        "responses": [
            {
                "question_set_name": "A",
                "question": question.question,
                "response": "Yes",
            }
        ],
    }
    resp = client.post("/api/bookings", data, format="json")
    assert resp.status_code == 201
    booking = Booking.objects.get()
    assert booking.details.brand == "Apple"
    assert booking.customerresponse_set.count() == 1


@pytest.mark.django_db
@override_settings(
    REST_FRAMEWORK={
        **settings.REST_FRAMEWORK,
        "DEFAULT_THROTTLE_RATES": {"booking": "1/min"},
    }
)
def test_customer_response_immutable(monkeypatch):
    monkeypatch.setattr(requests, "post", _captcha_ok)
    client = APIClient()
    data = {
        "name": "Jane",
        "email": "j@example.com",
        "date": "2024-01-01",
        "time": "10:00",
        "captcha_token": "tok",
    }
    resp = client.post("/api/bookings", data)
    booking_id = resp.json()["id"]
    response = client.post(
        "/api/responses",
        {
            "booking": booking_id,
            "question_set_name": "A",
            "question": "Test?",
            "response": "Ans",
        },
    )
    assert response.status_code == 201
    resp_id = response.json()["id"]
    # list requires admin
    assert client.get("/api/responses").status_code in (401, 403)
    admin = CustomUser.objects.create_user(
        username="admin", email="a@b.com", password="x", role="system_admin"
    )
    client.force_authenticate(admin)
    patch_resp = client.patch(f"/api/responses/{resp_id}", {"response": "new"})
    assert patch_resp.status_code == 405
    assert client.get("/api/responses").status_code == 200
