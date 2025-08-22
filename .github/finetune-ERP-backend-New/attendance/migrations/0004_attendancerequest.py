# Generated manually for AttendanceRequest model
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("attendance", "0003_attendance"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="AttendanceRequest",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "type",
                    models.CharField(choices=[("LATE", "Late Check-in"), ("OUTSIDE_GEOFENCE", "Outside Geofence"), ("OT", "Overtime"), ("ADJUST", "Manual Adjustment")], max_length=32),
                ),
                ("reason", models.TextField(blank=True)),
                (
                    "status",
                    models.CharField(choices=[("PENDING", "Pending"), ("APPROVED", "Approved"), ("REJECTED", "Rejected")], db_index=True, default="PENDING", max_length=16),
                ),
                ("decided_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("meta", models.JSONField(blank=True, default=dict)),
                (
                    "attendance",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="requests", to="attendance.attendance"),
                ),
                (
                    "decided_by",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name="attendance_requests_decided", to=settings.AUTH_USER_MODEL),
                ),
                (
                    "requested_by",
                    models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="attendance_requests_made", to=settings.AUTH_USER_MODEL),
                ),
            ],
            options={
                "ordering": ["-created_at"],
                "indexes": [
                    models.Index(fields=["status", "type"], name="attendance__status_type_idx"),
                    models.Index(fields=["created_at"], name="attendance__created_at_idx"),
                ],
            },
        ),
    ]
