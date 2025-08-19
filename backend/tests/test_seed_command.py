from io import StringIO

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase

from attendance.models import AdvisorPayrollProfile, Shift
from store.models import Store, StoreGeofence


class SeedCommandTests(TestCase):
    def test_seed_creates_records_and_is_idempotent(self):
        User = get_user_model()
        store = Store.objects.create(store_name="S1", code="S1")
        advisor = User.objects.create_user(
            username="adv1",
            password="pw",
            email="adv1@example.com",
            role="advisor",
            store=store,
        )
        advisor_no_store = User.objects.create_user(
            username="adv2",
            password="pw",
            email="adv2@example.com",
            role="advisor",
        )

        out = StringIO()
        call_command("seed_attendance_basics", stdout=out)

        self.assertEqual(Shift.objects.count(), 3)
        self.assertTrue(AdvisorPayrollProfile.objects.filter(user=advisor).exists())
        self.assertTrue(
            AdvisorPayrollProfile.objects.filter(user=advisor_no_store).exists()
        )
        self.assertTrue(StoreGeofence.objects.filter(store=store).exists())
        output = out.getvalue()
        self.assertIn("Shifts created: 3", output)
        self.assertIn("Payroll profiles: 2", output)
        self.assertIn("Geofences: 1", output)
        self.assertIn("Advisors without store: 1", output)

        out = StringIO()
        call_command("seed_attendance_basics", stdout=out)

        self.assertEqual(Shift.objects.count(), 3)
        self.assertEqual(AdvisorPayrollProfile.objects.count(), 2)
        self.assertEqual(StoreGeofence.objects.count(), 1)
        output2 = out.getvalue()
        self.assertIn("Shifts created: 0", output2)
        self.assertIn("Payroll profiles: 0", output2)
        self.assertIn("Geofences: 0", output2)
        self.assertIn("Advisors without store: 1", output2)
