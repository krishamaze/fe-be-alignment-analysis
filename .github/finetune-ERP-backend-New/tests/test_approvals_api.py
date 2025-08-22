import pytest
from datetime import date
from rest_framework.test import APIClient
from attendance.models import Attendance, AttendanceRequest
from accounts.models import CustomUser

@pytest.fixture
def attendance_with_requests(advisor1, store_s1, day_shift):
    att = Attendance.objects.create(
        user=advisor1,
        store=store_s1,
        date=date(2025, 8, 12),
        shift=day_shift,
        status="PENDING_APPROVAL",
    )
    req1 = AttendanceRequest.objects.create(
        attendance=att, type="OUTSIDE_GEOFENCE", requested_by=advisor1
    )
    req2 = AttendanceRequest.objects.create(
        attendance=att,
        type="OT",
        requested_by=advisor1,
        meta={"requested_minutes": 600},
    )
    return att, req1, req2

@pytest.mark.django_db
def test_branch_head_list_and_approve(branch_head, attendance_with_requests):
    att, req_out, req_ot = attendance_with_requests
    client = APIClient()
    client.force_authenticate(branch_head)
    resp = client.get("/api/attendance/approvals")
    assert resp.status_code == 200
    assert resp.data["count"] == 2
    appr = client.post(f"/api/attendance/approvals/{req_ot.id}/approve")
    assert appr.status_code == 200
    att.refresh_from_db()
    assert att.ot_minutes == 480  # capped

@pytest.mark.django_db
def test_branch_head_other_store_cannot_access(attendance_with_requests, store_s2):
    att, req_out, req_ot = attendance_with_requests
    bh2 = CustomUser.objects.create_user(
        username="bh2", password="pw", email="bh2@example.com", role="branch_head", store=store_s2
    )
    client = APIClient()
    client.force_authenticate(bh2)
    resp = client.post(f"/api/attendance/approvals/{req_ot.id}/approve")
    assert resp.status_code == 404

@pytest.mark.django_db
def test_system_admin_can_decide_any(admin_user, attendance_with_requests):
    att, req_out, req_ot = attendance_with_requests
    client = APIClient()
    client.force_authenticate(admin_user)
    resp = client.get("/api/attendance/approvals")
    assert resp.status_code == 200
    assert resp.data["count"] == 2
    client.post(f"/api/attendance/approvals/{req_out.id}/reject")
    client.post(f"/api/attendance/approvals/{req_ot.id}/approve")
    att.refresh_from_db()
    assert att.ot_minutes == 480
    req_out.refresh_from_db()
    assert req_out.status == "REJECTED"

@pytest.mark.django_db
def test_advisor_gets_empty_list_and_cannot_decide(advisor1, attendance_with_requests):
    _, req_out, _ = attendance_with_requests
    client = APIClient()
    client.force_authenticate(advisor1)
    resp = client.get("/api/attendance/approvals")
    assert resp.status_code == 200
    assert resp.data["count"] == 0
    resp2 = client.post(f"/api/attendance/approvals/{req_out.id}/approve")
    assert resp2.status_code == 404
