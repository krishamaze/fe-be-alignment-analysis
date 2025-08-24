from rest_framework import serializers
from .models import Product, Variant


class ProductSerializer(serializers.ModelSerializer):
    brand = serializers.CharField(source="brand.name", read_only=True)
    category = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "brand",
            "slug",
            "price",
            "availability",
            "category",
        ]


class VariantSerializer(serializers.ModelSerializer):
    product = serializers.SlugRelatedField(read_only=True, slug_field="slug")

    class Meta:
        model = Variant
        fields = [
            "id",
            "product",
            "variant_name",
            "slug",
            "price",
            "availability",
        ]
