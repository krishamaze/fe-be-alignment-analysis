from django.db.models import Sum
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from store.permissions import IsSystemAdminOrReadOnly

from .models import (
    InventoryConfig,
    PriceLog,
    SerialNumber,
    StockEntry,
    StockLedger,
)
from .serializers import (
    InventoryConfigSerializer,
    PriceLogSerializer,
    SerialNumberSerializer,
    StockEntrySerializer,
    StockLedgerSerializer,
)


class InventoryConfigViewSet(viewsets.ModelViewSet):
    queryset = InventoryConfig.objects.all()
    serializer_class = InventoryConfigSerializer
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]


class StockLedgerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StockLedger.objects.select_related('store', 'product_variant')
    serializer_class = StockLedgerSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def rollup(self, request):
        data = (
            StockLedger.objects.values('product_variant').annotate(quantity=Sum('quantity'))
        )
        return Response(list(data))


class StockEntryViewSet(viewsets.ModelViewSet):
    queryset = StockEntry.objects.all()
    serializer_class = StockEntrySerializer
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]


class SerialNumberViewSet(viewsets.ModelViewSet):
    queryset = SerialNumber.objects.all()
    serializer_class = SerialNumberSerializer
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]


class PriceLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PriceLog.objects.select_related('product_variant')
    serializer_class = PriceLogSerializer
    permission_classes = [permissions.IsAuthenticated]
