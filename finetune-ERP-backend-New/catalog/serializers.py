from rest_framework import serializers
from marketing.models import Brand
from .models import (
    Department,
    Category,
    SubCategory,
    Product,
    Variant,
    Unit,
    Quality,
)


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ["id", "name", "slug"]
        read_only_fields = ["id", "slug"]

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("This field may not be blank.")
        qs = Unit.objects.filter(name__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Unit with this name already exists")
        return value


class QualitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Quality
        fields = ["id", "name", "slug"]
        read_only_fields = ["id", "slug"]

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("This field may not be blank.")
        qs = Quality.objects.filter(name__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Quality with this name already exists")
        return value


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name", "slug"]
        read_only_fields = ["id", "slug"]

    def validate_name(self, value):
        qs = Department.objects.filter(name__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Department with this name already exists")
        return value


class CategorySerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    department_name = serializers.CharField(source="department.name", read_only=True)
    department_slug = serializers.CharField(source="department.slug", read_only=True)

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "department",
            "department_name",
            "department_slug",
        ]
        read_only_fields = ["id", "slug", "department_name", "department_slug"]

    def validate(self, attrs):
        department = attrs.get("department") or getattr(self.instance, "department", None)
        if department is None:
            raise serializers.ValidationError({"department": "This field is required."})
        name = attrs.get("name") or getattr(self.instance, "name", None)
        qs = Category.objects.filter(name__iexact=name, department=department)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError({
                "name": "Category with this name already exists in this department",
            })
        return attrs


class SubCategorySerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_slug = serializers.CharField(source="category.slug", read_only=True)

    class Meta:
        model = SubCategory
        fields = [
            "id",
            "name",
            "slug",
            "category",
            "category_name",
            "category_slug",
        ]
        read_only_fields = ["id", "slug", "category_name", "category_slug"]

    def validate(self, attrs):
        category = attrs.get("category") or getattr(self.instance, "category", None)
        if category is None:
            raise serializers.ValidationError({"category": "This field is required."})
        name = attrs.get("name") or getattr(self.instance, "name", None)
        qs = SubCategory.objects.filter(name__iexact=name, category=category)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError({
                "name": "SubCategory with this name already exists in this category",
            })
        return attrs


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
    unit = serializers.PrimaryKeyRelatedField(
        queryset=Unit.objects.all(), required=False, allow_null=True
    )
    unit_name = serializers.CharField(source="unit.name", read_only=True)
    unit_slug = serializers.CharField(source="unit.slug", read_only=True)

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
            "unit",
            "unit_name",
            "unit_slug",
        ]
        read_only_fields = ["id", "slug", "unit_name", "unit_slug"]

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
    unit_name = serializers.CharField(source="product.unit.name", read_only=True)
    unit_slug = serializers.CharField(source="product.unit.slug", read_only=True)

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
            "unit_name",
            "unit_slug",
        ]
        read_only_fields = ["id", "slug", "unit_name", "unit_slug"]

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
