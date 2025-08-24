from rest_framework import serializers
from catalog.models import Quality
from .models import Spare


class SpareSerializer(serializers.ModelSerializer):
    quality = serializers.PrimaryKeyRelatedField(
        queryset=Quality.objects.all(), required=False, allow_null=True
    )
    quality_name = serializers.CharField(source="quality.name", read_only=True)
    quality_slug = serializers.CharField(source="quality.slug", read_only=True)
    class Meta:
        model = Spare
        fields = [
            "id",
            "name",
            "sku",
            "price",  # admin-only
            "quality",
            "quality_name",
            "quality_slug",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "quality_name",
            "quality_slug",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        if not request or getattr(request.user, "role", None) != "system_admin":
            data.pop("price", None)
        return data
