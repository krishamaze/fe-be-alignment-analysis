from rest_framework import serializers
from .models import Product, Variant


class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = ['id', 'product', 'name', 'sku', 'price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'brand', 'category', 'price', 'is_active', 'created_at', 'updated_at', 'variants']
        read_only_fields = ['id', 'created_at', 'updated_at']
