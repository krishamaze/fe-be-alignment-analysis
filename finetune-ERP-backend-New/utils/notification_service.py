import requests
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string


class NotificationService:
    @staticmethod
    def send_email(to, subject, template, context):
        html_message = render_to_string(template, context)
        send_mail(subject, "", settings.DEFAULT_FROM_EMAIL, [to], html_message=html_message)

    @staticmethod
    def send_sms(to, template, context):
        if not getattr(settings, "SMS_GATEWAY_URL", None):
            return
        message = render_to_string(template, context).strip()
        try:
            requests.post(
                settings.SMS_GATEWAY_URL,
                data={
                    "to": to,
                    "token": getattr(settings, "SMS_GATEWAY_TOKEN", ""),
                    "message": message,
                },
                timeout=5,
            )
        except requests.RequestException:
            pass
