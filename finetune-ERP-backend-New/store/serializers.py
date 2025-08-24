from rest_framework import serializers
from .models import Store


class StoreSerializer(serializers.ModelSerializer):
    authority_name = serializers.SerializerMethodField()
    authority_email = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = [
            "id",
            "store_name",
            "code",
            "address",
            "phone",
            "store_type",
            "is_active",
            "authority",
            "authority_name",
            "authority_email",
        ]

    def get_authority_name(self, obj):
        if obj.authority:
            return f"{obj.authority.first_name} {obj.authority.last_name}".strip()
        return None

    def get_authority_email(self, obj):
        return obj.authority.email if obj.authority else None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        if not request or getattr(request.user, "role", None) != "system_admin":
            for field in ("authority", "authority_name", "authority_email"):
                data.pop(field, None)
        return data

    def validate(self, attrs):
        store_type = attrs.get("store_type", getattr(self.instance, "store_type", None))
        authority = attrs.get("authority", getattr(self.instance, "authority", None))
        if store_type == "BRANCH":
            if authority is None:
                raise serializers.ValidationError({"authority": "Branch stores require a branch head."})
            if authority.role != "branch_head":
                raise serializers.ValidationError({"authority": "Authority must be a branch head."})
        elif store_type == "HQ" and authority and authority.role != "system_admin":
            raise serializers.ValidationError({"authority": "HQ authority must be a system admin."})
        return attrs
