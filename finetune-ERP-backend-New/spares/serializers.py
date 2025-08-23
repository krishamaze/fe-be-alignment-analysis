from rest_framework import serializers
from .models import Spare


class SpareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spare
        fields = ["id", "name", "sku", "price", "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
