from rest_framework import serializers
from .models import Brand, Contact, ScheduleCall


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["id", "name", "logo"]


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ["id", "name", "mobile_no", "message"]


class ScheduleCallSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleCall
        fields = ["id", "name", "date", "time", "message"]
