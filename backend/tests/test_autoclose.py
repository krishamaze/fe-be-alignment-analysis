from datetime import date, datetime, timedelta, time

from django.test import TestCase
from django.utils import timezone

from accounts.models import CustomUser
from attendance.models import Attendance, AdvisorSchedule, Shift
from attendance.tasks import autoclose_for_date
from store.models import Store


class AutoCloseTests(TestCase):
    def setUp(self):
        self.store = Store.objects.create(store_name="S", code="S1")
        self.day_shift = Shift.objects.create(
            name="Day", start_time=time(9, 0), end_time=time(18, 0)
        )
        self.night_shift = Shift.objects.create(
            name="Night", start_time=time(22, 0), end_time=time(6, 0), is_overnight=True
        )
        self.anchor_monday = date(2024, 1, 1)  # Monday

    def _make_user(self, username: str, shift: Shift) -> CustomUser:
        user = CustomUser.objects.create_user(
            username=username,
            password="pw",
            email=f"{username}@example.com",
            role="advisor",
            store=self.store,
        )
        AdvisorSchedule.objects.create(
            user=user,
            rule_type="fixed",
            anchor_monday=self.anchor_monday,
            default_shift=shift,
        )
        return user

    def test_absent_created_for_planned_shift(self):
        user = self._make_user("u1", self.day_shift)
        target = date(2024, 1, 2)

        result = autoclose_for_date(target)
        self.assertEqual(result["absents_created"], 1)
        att = Attendance.objects.get(user=user, date=target)
        self.assertEqual(att.status, "ABSENT")

    def test_open_attendance_autoclosed_present(self):
        user = self._make_user("u2", self.day_shift)
        target = date(2024, 1, 2)
        check_in = timezone.make_aware(datetime(2024, 1, 2, 9, 0))
        Attendance.objects.create(
            user=user,
            store=self.store,
            date=target,
            shift=self.day_shift,
            check_in=check_in,
            status="OPEN",
        )

        result = autoclose_for_date(target)
        self.assertEqual(result["finalized"], 1)
        att = Attendance.objects.get(user=user, date=target)
        self.assertIsNotNone(att.check_out)
        self.assertEqual(timezone.localtime(att.check_out).time(), time(18, 0))
        self.assertEqual(att.status, "PRESENT")

    def test_overnight_shift_absent_on_start_date(self):
        user = self._make_user("u3", self.night_shift)
        target = date(2024, 1, 2)

        result = autoclose_for_date(target)
        self.assertEqual(result["absents_created"], 1)
        att = Attendance.objects.get(user=user, date=target)
        self.assertEqual(att.shift, self.night_shift)
        self.assertEqual(att.status, "ABSENT")
        self.assertFalse(
            Attendance.objects.filter(user=user, date=target + timedelta(days=1)).exists()
        )

    def test_idempotent(self):
        user = self._make_user("u4", self.day_shift)
        target = date(2024, 1, 2)
        check_in = timezone.make_aware(datetime(2024, 1, 2, 9, 0))
        Attendance.objects.create(
            user=user,
            store=self.store,
            date=target,
            shift=self.day_shift,
            check_in=check_in,
        )

        first = autoclose_for_date(target)
        att = Attendance.objects.get(user=user, date=target)
        checkout_first = att.check_out

        second = autoclose_for_date(target)
        att.refresh_from_db()
        self.assertEqual(att.check_out, checkout_first)
        self.assertEqual(Attendance.objects.filter(user=user, date=target).count(), 1)
        self.assertEqual(second["finalized"], 0)
        self.assertEqual(second["absents_created"], 0)
