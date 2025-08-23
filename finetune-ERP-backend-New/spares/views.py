from django.db.models import Q
from rest_framework import viewsets
from .models import Spare
from .serializers import SpareSerializer
from store.permissions import IsSystemAdminOrReadOnly


class SpareViewSet(viewsets.ModelViewSet):
    queryset = Spare.objects.all()
    serializer_class = SpareSerializer
    permission_classes = [IsSystemAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(sku__icontains=search))
        min_price = self.request.query_params.get("min_price")
        if min_price:
            qs = qs.filter(price__gte=min_price)
        max_price = self.request.query_params.get("max_price")
        if max_price:
            qs = qs.filter(price__lte=max_price)
        ordering = self.request.query_params.get("ordering", "name")
        allowed = {"name", "-name", "sku", "-sku", "price", "-price", "id", "-id"}
        qs = qs.order_by(ordering if ordering in allowed else "name")
        return qs
