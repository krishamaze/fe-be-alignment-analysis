from datetime import datetime
from django.conf import settings
from django.db import models
from django.utils import timezone


class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("rejected", "Rejected"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    store = models.ForeignKey(
        "store.Store", on_delete=models.SET_NULL, null=True, blank=True
    )
    attendant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="attended_bookings",
    )
    order_id = models.CharField(max_length=255, null=True, blank=True)
    priority = models.PositiveIntegerField(default=5)
    verification_flags = models.JSONField(default=dict, blank=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    issue = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    remarks = models.TextField(blank=True)
    date = models.DateField()
    time = models.TimeField()
    message = models.TextField(blank=True)
    reason = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default="pending")
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} on {self.date}"

    def allowed_transitions(self):
        return {
            "pending": ["approved", "rejected", "cancelled"],
            "approved": ["in_progress", "cancelled"],
            "in_progress": ["completed", "cancelled"],
            "completed": [],
            "cancelled": [],
            "rejected": [],
        }.get(self.status, [])

    def update_status_if_needed(self):
        now = timezone.localtime()
        booking_dt = datetime.combine(self.date, self.time, tzinfo=now.tzinfo)
        if self.status == "approved" and now >= booking_dt:
            self.status = "in_progress"
            self.save(update_fields=["status"])
        elif self.status == "in_progress" and now.date() > self.date:
            self.status = "completed"
            self.save(update_fields=["status"])


class Issue(models.Model):
    issue_name = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.issue_name


class OtherIssue(models.Model):
    other_issue = models.CharField(max_length=455)
    other_issue_value = models.DecimalField(
        default=0, decimal_places=2, max_digits=10, blank=True, null=True
    )

    def __str__(self):
        return self.other_issue


class BookingDetails(models.Model):
    booking_for = models.OneToOneField(
        Booking, on_delete=models.CASCADE, related_name="details"
    )
    issues = models.ManyToManyField(Issue, blank=True)
    other_issues = models.ManyToManyField(OtherIssue, blank=True)
    brand = models.CharField(max_length=255, blank=True)
    product = models.CharField(max_length=255, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Details for {self.booking_for}"


class Question(models.Model):
    question_set_name = models.CharField(max_length=5)
    question = models.CharField(max_length=655)

    def __str__(self):
        return self.question


class CustomerResponse(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    question_set_name = models.CharField(max_length=5, blank=True)
    question = models.CharField(max_length=655)
    response = models.CharField(max_length=655, blank=True)

    def __str__(self):
        return self.question
