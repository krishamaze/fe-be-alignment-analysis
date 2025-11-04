from django.conf import settings
from accounts.models import CustomUser
from utils.notification_service import NotificationService


def send_booking_notifications(booking):
    channels = getattr(settings, "BOOKING_NOTIFICATION_CHANNELS", [])
    context = {"booking": booking}

    staff_qs = CustomUser.objects.filter(
        role__in=["advisor", "branch_head", "system_admin"]
    )
    emails = list(staff_qs.values_list("email", flat=True))
    phones = list(staff_qs.exclude(phone="").values_list("phone", flat=True))

    user = booking.user
    if user:
        if user.email:
            emails.append(user.email)
        if user.phone:
            phones.append(user.phone)

    subject = "Booking Update"
    if "email" in channels:
        for email in emails:
            NotificationService.send_email(
                email,
                subject,
                "emails/booking_notification.html",
                context,
            )
    if "sms" in channels:
        for phone in phones:
            NotificationService.send_sms(
                phone,
                "sms/booking_notification.txt",
                context,
            )
