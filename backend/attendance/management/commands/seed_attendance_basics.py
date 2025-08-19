from decimal import Decimal
from datetime import time

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from attendance.models import AdvisorPayrollProfile, Shift
from store.models import Store, StoreGeofence


class Command(BaseCommand):
    """Seed core attendance data like shifts, payroll profiles and geofences."""

    help = "Seed core attendance data like shifts, payroll profiles and geofences."

    def handle(self, *args, **options):
        User = get_user_model()
        created_shifts = 0
        created_payroll_profiles = 0
        created_geofences = 0
        advisors_without_store = 0

        shift_defs = [
            {"name": "Shift A", "start": time(7, 0), "end": time(16, 0)},
            {"name": "Shift B", "start": time(13, 0), "end": time(22, 0)},
            {"name": "Backup", "start": time(9, 0), "end": time(21, 0)},
        ]

        with transaction.atomic():
            for sd in shift_defs:
                _, created = Shift.objects.get_or_create(
                    name=sd["name"],
                    defaults={
                        "start_time": sd["start"],
                        "end_time": sd["end"],
                        "is_overnight": False,
                        "is_active": True,
                    },
                )
                if created:
                    created_shifts += 1

            advisors = User.objects.filter(role="advisor")
            for advisor in advisors:
                if advisor.store_id is None:
                    advisors_without_store += 1
                _, created = AdvisorPayrollProfile.objects.get_or_create(
                    user=advisor,
                    defaults={
                        "hourly_rate": Decimal("120.00"),
                        "is_active": True,
                    },
                )
                if created:
                    created_payroll_profiles += 1

            for store in Store.objects.all():
                try:
                    store.geofence
                except StoreGeofence.DoesNotExist:
                    StoreGeofence.objects.create(
                        store=store,
                        latitude=0.0,
                        longitude=0.0,
                        radius_m=200,
                        is_active=False,
                    )
                    created_geofences += 1

        if advisors_without_store:
            self.stdout.write(
                self.style.WARNING(
                    f"Warning: {advisors_without_store} advisor(s) have no store assigned."
                )
            )

        self.stdout.write(
            f"Shifts created: {created_shifts}; Payroll profiles: {created_payroll_profiles}; "
            f"Geofences: {created_geofences}; Advisors without store: {advisors_without_store}"
        )
        return 0
