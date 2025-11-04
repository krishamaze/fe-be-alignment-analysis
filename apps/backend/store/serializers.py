"""
Store serializer with authority validation and role-based field visibility.

This module provides serialization for Store model with branch head assignment
validation and conditional field visibility based on user role.
"""

from rest_framework import serializers
from .models import Store


class StoreSerializer(serializers.ModelSerializer):
    """
    Serializer for Store model with authority metadata and validation.

    Provides store data with denormalized authority information (name, email)
    and enforces business rules for branch head assignment. Authority fields
    are only visible to system administrators.

    Attributes:
        authority_name (SerializerMethodField): Branch head full name (admin-only).
        authority_email (SerializerMethodField): Branch head email (admin-only).

    Fields:
        id, store_name, code, address, phone, store_type, is_active, authority,
        authority_name, authority_email

    Example:
        >>> store = Store.objects.get(id=1)
        >>> serializer = StoreSerializer(store, context={'request': request})
        >>> serializer.data
        {
            "id": 1,
            "store_name": "Main Branch",
            "code": "MB001",
            "store_type": "BRANCH",
            "is_active": true,
            "authority": 2,  # Only visible to system admins
            "authority_name": "John Doe",  # Only visible to system admins
            "authority_email": "john@example.com"  # Only visible to system admins
        }

    Note:
        Authority fields are automatically removed from response for non-admin users
        via to_representation() method.
    """
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
        """
        Get branch head full name.

        Args:
            obj (Store): Store instance.

        Returns:
            str: Full name of authority user, or None if no authority assigned.
        """
        if obj.authority:
            return f"{obj.authority.first_name} {obj.authority.last_name}".strip()
        return None

    def get_authority_email(self, obj):
        """
        Get branch head email address.

        Args:
            obj (Store): Store instance.

        Returns:
            str: Email of authority user, or None if no authority assigned.
        """
        return obj.authority.email if obj.authority else None

    def to_representation(self, instance):
        """
        Customize representation to hide authority fields from non-admins.

        Args:
            instance (Store): Store instance to serialize.

        Returns:
            dict: Serialized store data with authority fields removed for non-admins.

        Note:
            Authority, authority_name, and authority_email fields are only
            visible to system administrators for security reasons.
        """
        data = super().to_representation(instance)
        request = self.context.get("request")
        if not request or getattr(request.user, "role", None) != "system_admin":
            for field in ("authority", "authority_name", "authority_email"):
                data.pop(field, None)
        return data

    def validate(self, attrs):
        """
        Validate store data with authority assignment rules.

        Args:
            attrs (dict): Store attributes to validate.

        Returns:
            dict: Validated attributes.

        Raises:
            ValidationError: If authority assignment violates business rules:
                - BRANCH stores must have a branch_head authority
                - HQ stores must have a system_admin authority (if assigned)

        Example:
            >>> data = {"store_type": "BRANCH", "authority": advisor_user}
            >>> serializer = StoreSerializer(data=data)
            >>> serializer.is_valid()
            False
            >>> serializer.errors
            {'authority': ['Authority must be a branch head.']}
        """
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
