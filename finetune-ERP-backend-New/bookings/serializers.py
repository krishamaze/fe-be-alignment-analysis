from rest_framework import serializers
from django.conf import settings
import requests
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    captcha_token = serializers.CharField(write_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'name', 'email', 'date', 'time', 'message', 'status', 'captcha_token'
        ]
        read_only_fields = ['status']

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
        validated_data.pop('captcha_token', None)
        return super().create(validated_data)
