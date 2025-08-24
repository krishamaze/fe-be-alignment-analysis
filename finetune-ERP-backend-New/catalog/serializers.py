from rest_framework import serializers
from marketing.models import Brand
from .models import Department, Category, SubCategory, Product, Variant


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name", "slug"]


class CategorySerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "department"]


class SubCategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = SubCategory
        fields = ["id", "name", "slug", "category"]


class ProductSerializer(serializers.ModelSerializer):
    brand = serializers.PrimaryKeyRelatedField(queryset=Brand.objects.all())
    brand_name = serializers.CharField(source="brand.name", read_only=True)
    subcategory = serializers.PrimaryKeyRelatedField(queryset=SubCategory.objects.all())
    subcategory_name = serializers.CharField(source="subcategory.name", read_only=True)
    subcategory_slug = serializers.CharField(source="subcategory.slug", read_only=True)
    category_name = serializers.CharField(
        source="subcategory.category.name", read_only=True
    )
    category_slug = serializers.CharField(
        source="subcategory.category.slug", read_only=True
    )
    department_name = serializers.CharField(
        source="subcategory.category.department.name", read_only=True
    )
    department_slug = serializers.CharField(
        source="subcategory.category.department.slug", read_only=True
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "brand",
            "brand_name",
            "subcategory",
            "subcategory_name",
            "subcategory_slug",
            "category_name",
            "category_slug",
            "department_name",
            "department_slug",
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
