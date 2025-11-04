import pytest
from freezegun import freeze_time
from rest_framework.test import APIClient
from attendance.models import Attendance, AttendanceRequest


@pytest.mark.django_db
def test_checkin_success_inside_geofence(advisor1, day_shift, fake_selfie, localdt):
    client = APIClient()
    client.force_authenticate(user=advisor1)
    with freeze_time(localdt(2025, 8, 12, 9, 5)):
        resp = client.post(
            "/api/attendance/check-in",
            {"shift_id": day_shift.id, "lat": 0, "lon": 0, "photo": fake_selfie()},
            format="multipart",
        )
    assert resp.status_code == 201
    att = Attendance.objects.get(id=resp.data["id"])
    assert att.status == "OPEN"


@pytest.mark.django_db
def test_double_checkin_blocked(advisor1, day_shift, fake_selfie, localdt):
    client = APIClient()
    client.force_authenticate(user=advisor1)
    with freeze_time(localdt(2025, 8, 13, 9, 5)):
        resp1 = client.post(
            "/api/attendance/check-in",
            {"shift_id": day_shift.id, "lat": 0, "lon": 0, "photo": fake_selfie()},
            format="multipart",
        )
    assert resp1.status_code == 201
    with freeze_time(localdt(2025, 8, 13, 9, 6)):
        resp2 = client.post(
            "/api/attendance/check-in",
            {
                "shift_id": day_shift.id,
                "lat": 0,
                "lon": 0,
                "photo": fake_selfie("x.jpg"),
            },
            format="multipart",
        )
    assert resp2.status_code == 400


@pytest.mark.django_db
def test_late_beyond_grace_creates_request(advisor1, day_shift, fake_selfie, localdt):
    client = APIClient()
    client.force_authenticate(user=advisor1)
    with freeze_time(localdt(2025, 8, 14, 9, 20)):
        resp = client.post(
            "/api/attendance/check-in",
            {"shift_id": day_shift.id, "lat": 0, "lon": 0, "photo": fake_selfie()},
            format="multipart",
        )
    assert resp.status_code == 201
    att = Attendance.objects.get(id=resp.data["id"])
    assert att.status == "PENDING_APPROVAL"
    assert (
        AttendanceRequest.objects.filter(
            attendance=att, type="LATE", status="PENDING"
        ).count()
        == 1
    )


@pytest.mark.django_db
def test_outside_geofence_request(advisor1, day_shift, fake_selfie, localdt):
    client = APIClient()
    client.force_authenticate(user=advisor1)
    with freeze_time(localdt(2025, 8, 15, 9, 5)):
        resp = client.post(
            "/api/attendance/check-in",
            {"shift_id": day_shift.id, "lat": 1.0, "lon": 1.0, "photo": fake_selfie()},
            format="multipart",
        )
    assert resp.status_code == 201
    att = Attendance.objects.get(id=resp.data["id"])
    assert att.status == "PENDING_APPROVAL"
    assert AttendanceRequest.objects.filter(
        attendance=att, type="OUTSIDE_GEOFENCE", status="PENDING"
    ).exists()


@pytest.mark.django_db
def test_checkout_present_and_ot_request(advisor1, day_shift, fake_selfie, localdt):
    client = APIClient()
    client.force_authenticate(user=advisor1)
    # Check-in
    with freeze_time(localdt(2025, 8, 16, 9, 0)):
        resp_in = client.post(
            "/api/attendance/check-in",
            {"shift_id": day_shift.id, "lat": 0, "lon": 0, "photo": fake_selfie()},
            format="multipart",
        )
    att_id = resp_in.data["id"]
    # Check-out after ~6h02m -> rounds to 360
    with freeze_time(localdt(2025, 8, 16, 15, 2)):
        resp_out = client.post(
            "/api/attendance/check-out",
            {
                "attendance_id": att_id,
                "lat": 0,
                "lon": 0,
                "photo": fake_selfie("out.jpg"),
                "ot_request_minutes": 90,
            },
            format="multipart",
        )
    assert resp_out.status_code == 200
    att = Attendance.objects.get(id=att_id)
    assert att.status == "PRESENT"
    assert att.worked_minutes == 360
    assert (
        AttendanceRequest.objects.filter(
            attendance=att, type="OT", status="PENDING"
        ).count()
        == 1
    )
