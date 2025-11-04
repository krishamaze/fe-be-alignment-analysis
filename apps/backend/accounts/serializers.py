"""
Serializers for user authentication and management.

This module provides serializers for user registration, JWT token authentication,
and user profile management with validation and custom field handling.
"""

from rest_framework import serializers
from accounts.models import CustomUser
from store.models import Store
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import models


class RegisterUserSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration with password hashing and validation.

    Handles user creation with automatic password hashing, email normalization,
    and phone number validation. Used by system administrators to create new
    user accounts.

    Attributes:
        store (PrimaryKeyRelatedField): Optional store assignment.

    Fields:
        id, first_name, last_name, username, email, password, role, phone, store

    Example:
        >>> data = {
        ...     "username": "newuser",
        ...     "email": "newuser@example.com",
        ...     "password": "securepass123",
        ...     "role": "advisor",
        ...     "phone": "1234567890",
        ...     "store": 1
        ... }
        >>> serializer = RegisterUserSerializer(data=data)
        >>> serializer.is_valid()
        True
        >>> user = serializer.save()

    Note:
        Password is write-only and automatically hashed using Django's
        set_password() method before saving.
    """
    store = serializers.PrimaryKeyRelatedField(
        queryset=Store.objects.all(), allow_null=True, required=False
    )

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
            "role",
            "phone",
            "store",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        """
        Normalize email to lowercase and strip whitespace.

        Args:
            value (str): Email address to validate.

        Returns:
            str: Normalized email address.
        """
        return value.lower().strip()

    def validate_phone(self, value):
        """
        Validate phone number format.

        Args:
            value (str): Phone number to validate.

        Returns:
            str: Validated phone number.

        Raises:
            ValidationError: If phone number is not exactly 10 digits.
        """
        if value and (not value.isdigit() or len(value) != 10):
            raise serializers.ValidationError("Phone number must be 10 digits")
        return value

    def create(self, validated_data):
        """
        Create new user with hashed password.

        Args:
            validated_data (dict): Validated user data.

        Returns:
            CustomUser: Created user instance.

        Example:
            >>> serializer = RegisterUserSerializer(data=user_data)
            >>> serializer.is_valid()
            >>> user = serializer.save()
        """
        password = validated_data.pop("password")
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def validate(self, attrs):
        """
        Validate all user data.

        Args:
            attrs (dict): User attributes to validate.

        Returns:
            dict: Validated attributes.
        """
        return super().validate(attrs)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer with additional user metadata.

    Extends djangorestframework-simplejwt's TokenObtainPairSerializer to include
    username, role, and store ID in the token response for frontend state management.

    Returns:
        dict: JWT tokens plus user metadata (username, role, store).

    Example:
        Response from /api/auth/login:
        {
            "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
            "username": "advisor1",
            "role": "advisor",
            "store": 1
        }

    Note:
        Store ID is validated to ensure it exists before including in response.
        Returns None if store is deleted or invalid.
    """

    def validate(self, attrs):
        """
        Validate credentials and add custom user metadata to token response.

        Args:
            attrs (dict): Authentication credentials (username, password).

        Returns:
            dict: JWT tokens plus username, role, and store ID.

        Example:
            >>> serializer = MyTokenObtainPairSerializer(data=credentials)
            >>> serializer.is_valid()
            >>> tokens = serializer.validated_data
        """
        data = super().validate(attrs)

        # Add custom fields to response using safe attribute access
        data["username"] = getattr(self.user, "username", None)
        data["role"] = getattr(self.user, "role", None)

        store_id = getattr(self.user, "store_id", None)
        if store_id and not Store.objects.filter(id=store_id).exists():
            store_id = None
        data["store"] = store_id

        return data


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile display and updates.

    Provides read and write operations for user profiles with store name
    denormalization for efficient display. Used for user list and detail views.

    Attributes:
        store_name (CharField): Read-only store name from related Store model.

    Fields:
        id, first_name, last_name, username, email, role, phone, store,
        store_name, is_active, date_joined, last_login

    Example:
        >>> user = CustomUser.objects.get(id=1)
        >>> serializer = CustomUserSerializer(user)
        >>> serializer.data
        {
            "id": 1,
            "username": "advisor1",
            "email": "advisor@example.com",
            "role": "advisor",
            "store": 1,
            "store_name": "Main Branch",
            "is_active": true,
            ...
        }

    Note:
        Username and email are not required for updates to allow partial
        updates via PATCH requests.
    """

    store_name = serializers.CharField(source="store.store_name", read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "role",
            "phone",
            "store",
            "store_name",
            "is_active",
            "date_joined",
            "last_login",
        ]
        extra_kwargs = {
            "username": {"required": False},
            "email": {"required": False},
        }
