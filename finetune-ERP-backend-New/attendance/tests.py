"""Tests for attendance models and helpers."""

from datetime import date, datetime, time

from django.test import TestCase
from django.utils import timezone

from accounts.models import CustomUser
from attendance.models import Attendance, Shift, AdvisorSchedule
from store.models import Store
from rest_framework.test import APIClient


class AttendanceModelTests(TestCase):
    """Verify helper calculations and signal behaviour."""

    def setUp(self):
        self.store = Store.objects.create(store_name="S1", code="S1")
        self.user = CustomUser.objects.create_user(
            username="advisor",
            password="pw",
            role="advisor",
            store=self.store,
            email="advisor@example.com",
        )
        self.shift = Shift.objects.create(
            name="Day",
            start_time=time(9, 0),
            end_time=time(17, 0),
            is_overnight=False,
        )

    def test_compute_worked_minutes_rounding(self):
        """Worked minutes are rounded to the nearest 5."""

        check_in = timezone.make_aware(
            datetime.combine(date(2025, 1, 1), time(9, 0))
        )
        check_out = timezone.make_aware(
            datetime.combine(date(2025, 1, 1), time(9, 7))
        )
        attendance = Attendance(
            user=self.user,
            store=self.store,
            date=date(2025, 1, 1),
            shift=self.shift,
            check_in=check_in,
            check_out=check_out,
        )
        self.assertEqual(attendance.compute_worked_minutes(), 5)

    def test_apply_grace_and_status(self):
        """Grace and status computation works as expected."""

        check_in = timezone.make_aware(
            datetime.combine(date(2025, 1, 1), time(9, 20))
        )
        check_out = timezone.make_aware(
            datetime.combine(date(2025, 1, 1), time(16, 40))
        )
        attendance = Attendance(
            user=self.user,
            store=self.store,
            date=date(2025, 1, 1),
            shift=self.shift,
            check_in=check_in,
            check_out=check_out,
        )
        attendance.apply_grace_and_status()
        self.assertEqual(attendance.late_minutes, 5)
        self.assertEqual(attendance.early_out_minutes, 20)
        self.assertEqual(attendance.worked_minutes, 440)
        self.assertEqual(attendance.status, "PRESENT")

    def test_post_save_finalize_updates_fields(self):
        """Saving with a checkout triggers recomputation via signal."""

        day = date(2025, 1, 1)
        check_in = timezone.make_aware(datetime.combine(day, time(9, 0)))
        attendance = Attendance.objects.create(
            user=self.user,
            store=self.store,
            date=day,
            shift=self.shift,
            check_in=check_in,
        )
        self.assertTrue(attendance.is_open)
        check_out = timezone.make_aware(datetime.combine(day, time(17, 0)))
        attendance.check_out = check_out
        attendance.save()
        attendance.refresh_from_db()
        self.assertEqual(attendance.worked_minutes, 480)
        self.assertEqual(attendance.late_minutes, 0)
        self.assertEqual(attendance.early_out_minutes, 0)
        self.assertEqual(attendance.status, "PRESENT")
        self.assertFalse(attendance.is_open)
 

class MeTodayAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.store = Store.objects.create(store_name="S1", code="S1")
        self.user = CustomUser.objects.create_user(
            username="adv", password="pw", role="advisor", store=self.store, email="adv@example.com"
        )
        self.shift = Shift.objects.create(
            name="Day", start_time=time(9, 0), end_time=time(17, 0), is_overnight=False
        )
        AdvisorSchedule.objects.create(
            user=self.user, rule_type="fixed", anchor_monday=date(2024, 1, 1), default_shift=self.shift
        )
        self.client.force_authenticate(self.user)

    def test_me_today_returns_basic_fields(self):
        resp = self.client.get("/api/attendance/me/today")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["cta_state"], "start")
        self.assertIsNone(resp.data["attendance_id"])
        self.assertEqual(resp.data["early_checkin_window_min"], 15)
        self.assertIn("server_time", resp.data)
