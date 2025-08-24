from rest_framework import serializers
from accounts.models import CustomUser
from store.models import Store
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import models


class RegisterUserSerializer(serializers.ModelSerializer):
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
        return value.lower().strip()

    def validate_phone(self, value):
        if value and (not value.isdigit() or len(value) != 10):
            raise serializers.ValidationError("Phone number must be 10 digits")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def validate(self, attrs):
        return super().validate(attrs)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add custom fields to response
        data["username"] = self.user.username
        data["role"] = self.user.role
        data["store"] = self.user.store_id if self.user.store else None

        return data


class CustomUserSerializer(serializers.ModelSerializer):
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
