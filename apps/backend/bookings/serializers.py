from rest_framework import serializers
from django.conf import settings
import requests
from .models import (
    Booking,
    BookingDetails,
    Issue,
    OtherIssue,
    Question,
    CustomerResponse,
)


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ["id", "issue_name", "date_created", "date_modified"]


class OtherIssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = OtherIssue
        fields = ["id", "other_issue", "other_issue_value"]


class BookingDetailsSerializer(serializers.ModelSerializer):
    issues = serializers.PrimaryKeyRelatedField(
        queryset=Issue.objects.all(), many=True, required=False
    )
    other_issues = serializers.PrimaryKeyRelatedField(
        queryset=OtherIssue.objects.all(), many=True, required=False
    )

    class Meta:
        model = BookingDetails
        fields = ["issues", "other_issues", "brand", "product"]


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "question_set_name", "question"]


class CustomerResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerResponse
        fields = ["id", "booking", "question_set_name", "question", "response"]
        read_only_fields = ["id"]
        extra_kwargs = {"booking": {"required": False}}


class BookingSerializer(serializers.ModelSerializer):
    captcha_token = serializers.CharField(write_only=True)
    details = BookingDetailsSerializer(required=False)
    responses = CustomerResponseSerializer(
        many=True, required=False, source="customerresponse_set"
    )

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
            "address",
            "remarks",
            "date",
            "time",
            "message",
            "reason",
            "status",
            "details",
            "responses",
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

    def to_representation(self, instance):
        instance.update_status_if_needed()
        return super().to_representation(instance)

    def _save_details(self, booking, details_data):
        if not details_data:
            return
        issues = details_data.pop("issues", [])
        other_issues = details_data.pop("other_issues", [])
        details, _ = BookingDetails.objects.get_or_create(booking_for=booking)
        for attr, val in details_data.items():
            setattr(details, attr, val)
        details.save()
        if issues:
            details.issues.set(issues)
        if other_issues:
            details.other_issues.set(other_issues)

    def _create_responses(self, booking, responses_data):
        for resp in responses_data:
            CustomerResponse.objects.create(booking=booking, **resp)

    def create(self, validated_data):
        details_data = validated_data.pop("details", None)
        responses_data = validated_data.pop("customerresponse_set", [])
        validated_data.pop("captcha_token", None)
        validated_data.pop("status", None)
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user
        validated_data["status"] = "pending"
        booking = super().create(validated_data)
        self._save_details(booking, details_data)
        self._create_responses(booking, responses_data)
        return booking

    def update(self, instance, validated_data):
        details_data = validated_data.pop("details", None)
        responses_data = validated_data.pop("customerresponse_set", [])
        new_status = validated_data.get("status", instance.status)
        if new_status != instance.status and new_status not in instance.allowed_transitions():
            raise serializers.ValidationError({"status": "Invalid transition"})
        if new_status in ["cancelled", "rejected"] and not validated_data.get("reason"):
            raise serializers.ValidationError({"reason": "This field is required."})
        booking = super().update(instance, validated_data)
        self._save_details(booking, details_data)
        # Append-only: create new responses if provided
        self._create_responses(booking, responses_data)
        return booking
