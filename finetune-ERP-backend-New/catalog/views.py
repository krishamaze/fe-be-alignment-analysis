from rest_framework import viewsets
from store.permissions import IsSystemAdminOrReadOnly
from .models import Product, Variant
from .serializers import ProductSerializer, VariantSerializer


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
