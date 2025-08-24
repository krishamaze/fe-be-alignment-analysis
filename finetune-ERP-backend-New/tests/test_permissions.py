"""Unit tests for attendance permissions."""

from datetime import date, time

from django.test import TestCase
from rest_framework.test import APIRequestFactory

from accounts.models import CustomUser
from store.models import Store
from attendance.models import Attendance, Shift
from attendance.permissions import (
    IsSystemAdmin,
    IsAdvisor,
    IsBranchHead,
    IsSelfAdvisorOrManager,
)


class PermissionTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.store1 = Store.objects.create(store_name="Store1", code="S1")
        self.store2 = Store.objects.create(store_name="Store2", code="S2")

        self.admin = CustomUser.objects.create_user(
            username="admin",
            password="x",
            email="admin@example.com",
            role="system_admin",
        )
        self.branch_head = CustomUser.objects.create_user(
            username="bh",
            password="x",
            email="bh@example.com",
            role="branch_head",
            store=self.store1,
        )
        self.advisor1 = CustomUser.objects.create_user(
            username="adv1",
            password="x",
            email="adv1@example.com",
            role="advisor",
            store=self.store1,
        )
        self.advisor2 = CustomUser.objects.create_user(
            username="adv2",
            password="x",
            email="adv2@example.com",
            role="advisor",
            store=self.store2,
        )

        self.shift = Shift.objects.create(
            name="Day",
            start_time=time(9, 0),
            end_time=time(17, 0),
        )
        today = date.today()
        self.att1 = Attendance.objects.create(
            user=self.advisor1, store=self.store1, date=today, shift=self.shift
        )
        self.att2 = Attendance.objects.create(
            user=self.advisor2, store=self.store2, date=today, shift=self.shift
        )

    def _get_request(self, user):
        request = self.factory.get("/")
        request.user = user
        return request

    def test_is_system_admin(self):
        perm = IsSystemAdmin()
        self.assertTrue(perm.has_permission(self._get_request(self.admin), None))
        self.assertFalse(perm.has_permission(self._get_request(self.branch_head), None))
        self.assertFalse(perm.has_permission(self._get_request(self.advisor1), None))

    def test_is_branch_head(self):
        perm = IsBranchHead()
        self.assertTrue(perm.has_permission(self._get_request(self.branch_head), None))
        self.assertFalse(perm.has_permission(self._get_request(self.admin), None))
        self.assertFalse(perm.has_permission(self._get_request(self.advisor1), None))

    def test_is_advisor(self):
        perm = IsAdvisor()
        self.assertTrue(perm.has_permission(self._get_request(self.advisor1), None))
        self.assertTrue(perm.has_permission(self._get_request(self.advisor2), None))
        self.assertFalse(perm.has_permission(self._get_request(self.branch_head), None))
        self.assertFalse(perm.has_permission(self._get_request(self.admin), None))

    def test_is_self_advisor_or_manager(self):
        perm = IsSelfAdvisorOrManager()

        # Admin can access anything
        self.assertTrue(
            perm.has_object_permission(self._get_request(self.admin), None, self.att1)
        )

        # Branch head of store1 can access advisor1 but not advisor2
        self.assertTrue(
            perm.has_object_permission(
                self._get_request(self.branch_head), None, self.att1
            )
        )
        self.assertFalse(
            perm.has_object_permission(
                self._get_request(self.branch_head), None, self.att2
            )
        )

        # Advisor1 can access own attendance but not advisor2's
        self.assertTrue(
            perm.has_object_permission(
                self._get_request(self.advisor1), None, self.att1
            )
        )
        self.assertFalse(
            perm.has_object_permission(
                self._get_request(self.advisor1), None, self.att2
            )
        )
