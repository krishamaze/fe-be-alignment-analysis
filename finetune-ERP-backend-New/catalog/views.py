from rest_framework import viewsets
from store.permissions import IsSystemAdminOrReadOnly
from .models import Department, Category, SubCategory, Product, Variant
from .serializers import (
    DepartmentSerializer,
    CategorySerializer,
    SubCategorySerializer,
    ProductSerializer,
    VariantSerializer,
)


class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Department.objects.all().order_by("name")
    serializer_class = DepartmentSerializer
    lookup_field = "slug"


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        dept = self.request.query_params.get("department")
        if dept:
            qs = qs.filter(department__slug=dept)
        return qs


class SubCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubCategory.objects.all().order_by("name")
    serializer_class = SubCategorySerializer
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        cat = self.request.query_params.get("category")
        if cat:
            qs = qs.filter(category__slug=cat)
        return qs


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("name")
    serializer_class = ProductSerializer
    lookup_field = "slug"
    permission_classes = [IsSystemAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        brand = self.request.query_params.get("brand")
        if brand:
            qs = qs.filter(brand_id=brand)
        availability = self.request.query_params.get("availability")
        if availability is not None:
            if availability.lower() in ("true", "1", "yes"):
                qs = qs.filter(availability=True)
            elif availability.lower() in ("false", "0", "no"):
                qs = qs.filter(availability=False)
        subcat = self.request.query_params.get("subcategory")
        if subcat:
            qs = qs.filter(subcategory__slug=subcat)
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(subcategory__category__slug=category)
        department = self.request.query_params.get("department")
        if department:
            qs = qs.filter(subcategory__category__department__slug=department)
        return qs


class VariantViewSet(viewsets.ModelViewSet):
    queryset = Variant.objects.all().order_by("variant_name")
    serializer_class = VariantSerializer
    lookup_field = "slug"
    permission_classes = [IsSystemAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        product = self.request.query_params.get("product")
        if product:
            qs = qs.filter(product__slug=product)
        return qs
