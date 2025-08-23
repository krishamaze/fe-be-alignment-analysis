from rest_framework import serializers
from categories.models import Category
from departments.models import Department
from .models import Product, Variant


class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = ['id', 'product', 'name', 'sku', 'price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=True)
    category = serializers.SlugRelatedField(slug_field='slug', queryset=Category.objects.all())
    department = serializers.SlugRelatedField(slug_field='slug', queryset=Department.objects.all())

    class Meta:
        model = Product
        fields = ['id', 'name', 'brand', 'category', 'department', 'price', 'is_active', 'created_at', 'updated_at', 'variants']
        read_only_fields = ['id', 'created_at', 'updated_at']
