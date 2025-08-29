from rest_framework import permissions, viewsets
from store.permissions import IsSystemAdminOrReadOnly

from .models import Department, Category, SubCategory, Product, Variant, Unit, Quality
from .serializers import (
    DepartmentSerializer,
    CategorySerializer,
    SubCategorySerializer,
    ProductSerializer,
    VariantSerializer,
    UnitSerializer,
    QualitySerializer,
)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().order_by("name")
    serializer_class = DepartmentSerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        dept = self.request.query_params.get("department")
        if dept:
            qs = qs.filter(department__slug=dept)
        return qs


class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all().order_by("name")
    serializer_class = SubCategorySerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]

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
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]

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
        min_price = self.request.query_params.get("min_price")
        if min_price is not None:
            qs = qs.filter(price__gte=min_price)
        max_price = self.request.query_params.get("max_price")
        if max_price is not None:
            qs = qs.filter(price__lte=max_price)
        ordering = self.request.query_params.get("ordering")
        if ordering:
            mapping = {
                "date_created": "created_at",
                "-date_created": "-created_at",
            }
            field = mapping.get(ordering, ordering)
            if field in ["price", "-price", "created_at", "-created_at"]:
                qs = qs.order_by(field)
        return qs


class VariantViewSet(viewsets.ModelViewSet):
    queryset = Variant.objects.all().order_by("variant_name")
    serializer_class = VariantSerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        product = self.request.query_params.get("product")
        if product:
            qs = qs.filter(product__slug=product)
        return qs


class UnitViewSet(viewsets.ModelViewSet):
    queryset = Unit.objects.all().order_by("name")
    serializer_class = UnitSerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]


class QualityViewSet(viewsets.ModelViewSet):
    queryset = Quality.objects.all().order_by("name")
    serializer_class = QualitySerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]


