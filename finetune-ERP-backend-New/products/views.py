from django.db.models import Q
from rest_framework import viewsets
from store.permissions import IsSystemAdminOrReadOnly
from .models import Product, Variant
from .serializers import ProductSerializer, VariantSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category', 'department').prefetch_related('variants')
    serializer_class = ProductSerializer
    permission_classes = [IsSystemAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        brand = self.request.query_params.get('brand')
        if brand:
            qs = qs.filter(brand__iexact=brand)
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__slug=category)
        department = self.request.query_params.get('department')
        if department:
            qs = qs.filter(department__slug=department)
        min_price = self.request.query_params.get('min_price')
        if min_price:
            qs = qs.filter(price__gte=min_price)
        max_price = self.request.query_params.get('max_price')
        if max_price:
            qs = qs.filter(price__lte=max_price)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(brand__icontains=search))
        ordering = self.request.query_params.get('ordering', 'name')
        allowed = {'name', '-name', 'brand', '-brand', 'price', '-price', 'id', '-id'}
        qs = qs.order_by(ordering if ordering in allowed else 'name')
        return qs


class VariantViewSet(viewsets.ModelViewSet):
    queryset = Variant.objects.select_related('product').all()
    serializer_class = VariantSerializer
    permission_classes = [IsSystemAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        product_id = self.request.query_params.get('product')
        if product_id:
            qs = qs.filter(product_id=product_id)
        min_price = self.request.query_params.get('min_price')
        if min_price:
            qs = qs.filter(price__gte=min_price)
        max_price = self.request.query_params.get('max_price')
        if max_price:
            qs = qs.filter(price__lte=max_price)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(sku__icontains=search))
        ordering = self.request.query_params.get('ordering', 'name')
        allowed = {'name', '-name', 'sku', '-sku', 'price', '-price', 'id', '-id'}
        qs = qs.order_by(ordering if ordering in allowed else 'name')
        return qs
