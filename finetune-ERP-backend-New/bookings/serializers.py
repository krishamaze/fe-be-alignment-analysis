from rest_framework import serializers
from django.conf import settings
import requests
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    captcha_token = serializers.CharField(write_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "store",
            "attendant",
            "order_id",
            "priority",
            "verification_flags",
            "name",
            "email",
            "issue",
            "address",
            "remarks",
            "date",
            "time",
            "message",
            "reason",
            "status",
            "captcha_token",
        ]
        read_only_fields = [
            "id",
            "store",
            "attendant",
            "order_id",
            "priority",
            "verification_flags",
        ]

    def validate_captcha_token(self, value):
        response = requests.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={"secret": settings.RECAPTCHA_SECRET_KEY, "response": value},
            timeout=5,
        )
        if not response.json().get("success"):
            raise serializers.ValidationError("Invalid captcha")
        return value

    def create(self, validated_data):
        validated_data.pop("captcha_token", None)
        validated_data.pop("status", None)
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user
        validated_data["status"] = "pending"
        return super().create(validated_data)

    def update(self, instance, validated_data):
        new_status = validated_data.get("status", instance.status)
        if new_status != instance.status and new_status not in instance.allowed_transitions():
            raise serializers.ValidationError({"status": "Invalid transition"})
        if new_status in ["cancelled", "rejected"] and not validated_data.get("reason"):
            raise serializers.ValidationError({"reason": "This field is required."})
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        instance.update_status_if_needed()
        return super().to_representation(instance)
