from django.conf import settings
from django.core.mail import send_mail
import requests
from accounts.models import CustomUser


def send_booking_notifications(booking):
    channels = getattr(settings, 'BOOKING_NOTIFICATION_CHANNELS', [])
    content = (
        f"Booking #{booking.id} for {booking.issue} is {booking.status}"
    )

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

    if "email" in channels and emails:
        try:
            send_mail(
                "Booking Submitted",
                content,
                settings.DEFAULT_FROM_EMAIL,
                emails,
                fail_silently=True,
            )
        except Exception:
            pass

    if "sms" in channels and settings.SMS_GATEWAY_URL:
        for phone in phones:
            try:
                requests.post(
                    settings.SMS_GATEWAY_URL,
                    data={
                        "to": phone,
                        "token": getattr(settings, "SMS_GATEWAY_TOKEN", ""),
                        "message": content,
                    },
                    timeout=5,
                )
            except requests.RequestException:
                continue
