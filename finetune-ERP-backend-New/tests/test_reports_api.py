import pytest
from datetime import date
from rest_framework.test import APIClient
from attendance.models import Attendance, AdvisorPayrollProfile


@pytest.fixture
def seed_reports(advisor1, store_s1, day_shift):
    AdvisorPayrollProfile.objects.create(user=advisor1, hourly_rate=100)
    Attendance.objects.create(
        user=advisor1,
        store=store_s1,
        date=date(2025, 8, 10),
        shift=day_shift,
        status="PRESENT",
        worked_minutes=480,
        ot_minutes=60,
    )
    Attendance.objects.create(
        user=advisor1,
        store=store_s1,
        date=date(2025, 8, 11),
        shift=day_shift,
        status="HALF_DAY",
        worked_minutes=300,
        ot_minutes=0,
    )
    return advisor1


@pytest.mark.django_db
def test_system_admin_store_report(admin_user, store_s1, seed_reports):
    client = APIClient()
    client.force_authenticate(admin_user)
    url = f"/api/attendance/reports/store/{store_s1.id}?month=2025-08"
    resp = client.get(url)
    assert resp.status_code == 200
    data = resp.json()
    assert data["store_id"] == store_s1.id
    assert data["totals"]["worked_minutes"] == 780
    assert data["totals"]["approved_ot_minutes"] == 60
    assert len(data["advisors"]) == 1
    csv_resp = client.get(url + "&format=csv")
    assert csv_resp.status_code == 200
    assert csv_resp["Content-Type"] == "text/csv"
    assert b"User ID" in csv_resp.content.splitlines()[0]


@pytest.mark.django_db
def test_advisor_me_report(advisor1, seed_reports):
    client = APIClient()
    client.force_authenticate(advisor1)
    resp = client.get("/api/attendance/reports/me?month=2025-08")
    assert resp.status_code == 200
    data = resp.json()
    assert data["summary"]["worked_minutes"] == 780
    assert data["summary"]["approved_ot_minutes"] == 60
    assert len(data["by_day"]) == 2
    csv_resp = client.get("/api/attendance/reports/me?month=2025-08&format=csv")
    assert csv_resp.status_code == 200
    assert csv_resp["Content-Type"] == "text/csv"
    assert b"Date" in csv_resp.content.splitlines()[0]


@pytest.mark.django_db
def test_branch_head_scoping(branch_head, store_s2, seed_reports):
    client = APIClient()
    client.force_authenticate(branch_head)
    ok = client.get(
        f"/api/attendance/reports/store/{branch_head.store_id}?month=2025-08"
    )
    assert ok.status_code == 200
    forbidden = client.get(f"/api/attendance/reports/store/{store_s2.id}?month=2025-08")
    assert forbidden.status_code == 403
