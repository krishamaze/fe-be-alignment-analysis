from rest_framework import serializers
from .models import Spare


class SpareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spare
        fields = [
            "id",
            "name",
            "sku",
            "price",  # admin-only
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        if not request or getattr(request.user, "role", None) != "system_admin":
            data.pop("price", None)
        return data
