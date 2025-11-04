from datetime import date

from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import CustomUser
from attendance.models import (
    Shift,
    AdvisorSchedule,
    WeekOff,
    ScheduleException,
    AdvisorPayrollProfile,
)
from store.models import Store, StoreGeofence


class AdminAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = CustomUser.objects.create_user(
            username="admin", password="pass", role="system_admin", email="a@a.com"
        )
        self.advisor = CustomUser.objects.create_user(
            username="adv", password="pass", role="advisor", email="b@b.com"
        )
        self.store = Store.objects.create(store_name="S1", code="S1")
        self.client.force_authenticate(self.admin)

    def test_shift_crud_idempotent_and_forbidden_for_non_admin(self):
        url = "/api/attendance/admin/shifts"
        data = {
            "name": "Morn",
            "start_time": "09:00",
            "end_time": "17:00",
        }
        # create
        resp = self.client.post(
            url, data, format="multipart", HTTP_IDEMPOTENCY_KEY="k1"
        )
        self.assertEqual(resp.status_code, 201)
        shift_id = resp.data["id"]
        # idempotent retry
        resp2 = self.client.post(
            url, data, format="multipart", HTTP_IDEMPOTENCY_KEY="k1"
        )
        self.assertEqual(resp2.data["id"], shift_id)
        # json rejected
        resp3 = self.client.post(url, data, format="json")
        self.assertIn(resp3.status_code, (400, 415))
        # delete -> soft
        del_url = f"{url}/{shift_id}"
        resp = self.client.delete(del_url)
        self.assertEqual(resp.status_code, 200)
        self.assertFalse(resp.data["is_active"])
        # non-system-admin forbidden
        self.client.force_authenticate(self.advisor)
        resp = self.client.post(url, data, format="multipart")
        self.assertEqual(resp.status_code, 403)

    def test_schedule_preview_and_soft_delete(self):
        shift = Shift.objects.create(name="S1", start_time="09:00", end_time="17:00")
        data = {
            "user": self.advisor.id,
            "rule_type": "fixed",
            "anchor_monday": "2024-01-01",
            "default_shift": shift.id,
        }
        url = "/api/attendance/admin/schedules"
        resp = self.client.post(
            url, data, format="multipart", HTTP_IDEMPOTENCY_KEY="s1"
        )
        sched_id = resp.data["id"]
        # preview
        prev = self.client.get(
            f"{url}/{sched_id}/preview?start=2024-01-01&end=2024-01-02"
        )
        self.assertIn("2024-01-01", prev.data)
        # delete -> soft
        del_resp = self.client.delete(f"{url}/{sched_id}")
        self.assertEqual(del_resp.data["is_active"], False)

    def test_weekoff_and_exception_and_geofence_and_payroll(self):
        # weekoff
        wurl = "/api/attendance/admin/weekoffs"
        wdata = {"user": self.advisor.id, "weekday": 1}
        resp = self.client.post(wurl, wdata, format="multipart")
        wid = resp.data["id"]
        dup = self.client.post(wurl, wdata, format="multipart")
        self.assertEqual(dup.status_code, 400)
        del_resp = self.client.delete(f"{wurl}/{wid}")
        self.assertFalse(del_resp.data["is_active"])

        # schedule exception idempotent
        shift = Shift.objects.create(name="S2", start_time="10:00", end_time="18:00")
        ex_url = "/api/attendance/admin/exceptions"
        ex_data = {
            "user": self.advisor.id,
            "date": "2024-01-05",
            "override_shift": shift.id,
        }
        resp = self.client.post(
            ex_url, ex_data, format="multipart", HTTP_IDEMPOTENCY_KEY="ex1"
        )
        ex_id = resp.data["id"]
        resp2 = self.client.post(
            ex_url, ex_data, format="multipart", HTTP_IDEMPOTENCY_KEY="ex1"
        )
        self.assertEqual(resp2.data["id"], ex_id)

        # geofence upsert
        g_url = "/api/attendance/admin/geofences"
        gdata = {
            "store": self.store.id,
            "latitude": "1",
            "longitude": "1",
            "radius_m": "100",
        }
        resp = self.client.post(g_url, gdata, format="multipart")
        gid = resp.data["id"]
        gdata2 = {
            "store": self.store.id,
            "latitude": "2",
            "longitude": "2",
            "radius_m": "150",
        }
        resp2 = self.client.post(g_url, gdata2, format="multipart")
        self.assertEqual(resp2.data["id"], gid)
        self.assertEqual(resp2.data["radius_m"], 150)
        del_resp = self.client.delete(f"{g_url}/{gid}")
        self.assertFalse(del_resp.data["is_active"])

        # payroll upsert
        p_url = f"/api/attendance/admin/payroll/{self.advisor.id}"
        pdata = {"hourly_rate": "123.45", "is_active": True}
        resp = self.client.put(
            p_url, pdata, format="multipart", HTTP_IDEMPOTENCY_KEY="p1"
        )
        pid = resp.data["id"]
        resp2 = self.client.patch(
            p_url,
            {"hourly_rate": "123.45"},
            format="multipart",
            HTTP_IDEMPOTENCY_KEY="p1",
        )
        self.assertEqual(resp2.data["id"], pid)
