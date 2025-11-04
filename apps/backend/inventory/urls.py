from rest_framework.routers import DefaultRouter
from .views import (
    InventoryConfigViewSet,
    PriceLogViewSet,
    SerialNumberViewSet,
    StockEntryViewSet,
    StockLedgerViewSet,
)

router = DefaultRouter()
router.register(r'stock-ledgers', StockLedgerViewSet, basename='stock-ledger')
router.register(r'stock-entries', StockEntryViewSet, basename='stock-entry')
router.register(r'serials', SerialNumberViewSet, basename='serial')
router.register(r'price-logs', PriceLogViewSet, basename='price-log')
router.register(r'inventory-config', InventoryConfigViewSet, basename='inventory-config')

urlpatterns = router.urls
