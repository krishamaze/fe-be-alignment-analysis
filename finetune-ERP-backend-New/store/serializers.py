from rest_framework import serializers
from .models import Store
from accounts.models import CustomUser


class StoreSerializer(serializers.ModelSerializer):
    branch_head_name = serializers.SerializerMethodField()
    branch_head_email = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = [
            "id",
            "store_name",
            "code",
            "address",
            "is_active",
            "branch_head",
            "branch_head_name",
            "branch_head_email",
        ]

        # ``branch_head`` related fields are admin-only
        # and are stripped from representations for
        # non-system_admin users.

    def get_branch_head_name(self, obj):
        if obj.branch_head:
            return f"{obj.branch_head.first_name} {obj.branch_head.last_name}".strip()
        return None

    def get_branch_head_email(self, obj):
        return obj.branch_head.email if obj.branch_head else None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        if not request or getattr(request.user, "role", None) != "system_admin":
            for field in ("branch_head", "branch_head_name", "branch_head_email"):
                data.pop(field, None)
        return data
