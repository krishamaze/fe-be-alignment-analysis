"""Tests for Django admin custom actions."""

from datetime import date, time

from django.contrib.admin.sites import AdminSite
from django.contrib.messages.storage.fallback import FallbackStorage
from django.test import RequestFactory, TestCase

from accounts.models import CustomUser
from store.models import Store
from attendance.models import Attendance, AttendanceRequest, Shift
from attendance.admin import AttendanceRequestAdmin


class AttendanceAdminActionTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.site = AdminSite()

        self.store1 = Store.objects.create(store_name="Store1", code="S1")
        self.store2 = Store.objects.create(store_name="Store2", code="S2")

        self.admin_user = CustomUser.objects.create_user(
            username="admin",
            password="x",
            email="admin@example.com",
            role="system_admin",
        )
        self.branch_head_other = CustomUser.objects.create_user(
            username="bh2",
            password="x",
            email="bh2@example.com",
            role="branch_head",
            store=self.store2,
        )
        self.advisor = CustomUser.objects.create_user(
            username="adv",
            password="x",
            email="adv@example.com",
            role="advisor",
            store=self.store1,
        )
        self.shift = Shift.objects.create(
            name="Day", start_time=time(9, 0), end_time=time(17, 0)
        )
        self.attendance = Attendance.objects.create(
            user=self.advisor,
            store=self.store1,
            date=date.today(),
            shift=self.shift,
        )
        self.request = AttendanceRequest.objects.create(
            attendance=self.attendance,
            type="OT",
            requested_by=self.advisor,
            meta={"requested_minutes": 30},
        )
        self.admin = AttendanceRequestAdmin(AttendanceRequest, self.site)

    def _build_request(self, user):
        request = self.factory.post("/")
        request.user = user
        # Messages framework requires these attributes
        setattr(request, "session", {})
        messages = FallbackStorage(request)
        setattr(request, "_messages", messages)
        return request

    def test_system_admin_can_approve_request(self):
        request = self._build_request(self.admin_user)
        queryset = AttendanceRequest.objects.filter(pk=self.request.pk)
        self.admin.approve_selected(request, queryset)
        self.request.refresh_from_db()
        self.attendance.refresh_from_db()
        self.assertEqual(self.request.status, "APPROVED")
        self.assertEqual(self.attendance.ot_minutes, 30)

    def test_branch_head_other_store_denied(self):
        request = self._build_request(self.branch_head_other)
        queryset = AttendanceRequest.objects.filter(pk=self.request.pk)
        self.admin.approve_selected(request, queryset)
        self.request.refresh_from_db()
        self.attendance.refresh_from_db()
        self.assertEqual(self.request.status, "PENDING")
        self.assertEqual(self.attendance.ot_minutes, 0)
