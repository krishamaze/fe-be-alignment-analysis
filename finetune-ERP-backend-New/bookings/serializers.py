from rest_framework import serializers
from django.conf import settings
import requests
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    captcha_token = serializers.CharField(write_only=True)
    issue = serializers.CharField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "name",
            "email",
            "issue",
            "date",
            "time",
            "message",
            "status",
            "captcha_token",
        ]
        read_only_fields = ["id"]

    def validate_captcha_token(self, value):
        response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data={'secret': settings.RECAPTCHA_SECRET_KEY, 'response': value},
            timeout=5,
        )
        if not response.json().get('success'):
            raise serializers.ValidationError('Invalid captcha')
        return value

    def create(self, validated_data):
        validated_data.pop("captcha_token", None)
        validated_data.pop("status", None)
        request = self.context.get("request")
        if request:
            validated_data["user"] = request.user
        validated_data["status"] = "pending"
        return super().create(validated_data)

    def to_representation(self, instance):
        instance.update_status_if_needed()
        return super().to_representation(instance)
