from rest_framework import serializers
from marketing.models import Brand
from .models import Category, Product, Variant


class ProductSerializer(serializers.ModelSerializer):
    brand = serializers.PrimaryKeyRelatedField(queryset=Brand.objects.all())
    brand_name = serializers.CharField(source="brand.name", read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "brand",
            "brand_name",
            "category",
            "category_name",
            "slug",
            "price",
            "stock",
            "availability",
        ]
        read_only_fields = ["id", "slug"]

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative")
        return value

    def validate_availability(self, value):
        stock = self.initial_data.get("stock")
        try:
            stock = int(stock)
        except (TypeError, ValueError):
            stock = None
        if stock == 0 and value:
            raise serializers.ValidationError("Unavailable when stock is zero")
        if value and (stock is None or stock <= 0):
            raise serializers.ValidationError("Stock must be > 0 when available")
        return value


class VariantSerializer(serializers.ModelSerializer):
    product = serializers.SlugRelatedField(
        queryset=Product.objects.all(), slug_field="slug"
    )
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Variant
        fields = [
            "id",
            "product",
            "product_name",
            "variant_name",
            "slug",
            "price",
            "stock",
            "availability",
        ]
        read_only_fields = ["id", "slug"]

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative")
        return value

    def validate_availability(self, value):
        stock = self.initial_data.get("stock")
        try:
            stock = int(stock)
        except (TypeError, ValueError):
            stock = None
        if stock == 0 and value:
            raise serializers.ValidationError("Unavailable when stock is zero")
        if value and (stock is None or stock <= 0):
            raise serializers.ValidationError("Stock must be > 0 when available")
        return value
