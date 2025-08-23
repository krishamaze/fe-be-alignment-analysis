from datetime import datetime
from django.conf import settings
from django.db import models
from django.utils import timezone


class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    issue = models.CharField(max_length=100, blank=True)
    date = models.DateField()
    time = models.TimeField()
    message = models.TextField(blank=True)
    status = models.CharField(
        max_length=12, choices=STATUS_CHOICES, default="pending"
    )
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} on {self.date}"

    def update_status_if_needed(self):
        now = timezone.localtime()
        booking_dt = datetime.combine(self.date, self.time, tzinfo=now.tzinfo)
        if self.status == "confirmed" and now >= booking_dt:
            self.status = "in_progress"
            self.save(update_fields=["status"])
        elif self.status == "in_progress" and now.date() > self.date:
            self.status = "completed"
            self.save(update_fields=["status"])
