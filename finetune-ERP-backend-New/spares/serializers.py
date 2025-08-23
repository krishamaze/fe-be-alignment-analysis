from rest_framework import serializers
from .models import Spare


class SpareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spare
        fields = ["id", "name", "type", "is_available"]
        read_only_fields = fields
