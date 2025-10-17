from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SaleInvoiceViewSet, ProductSearchViewSet

router = DefaultRouter()
router.register(r'invoices', SaleInvoiceViewSet, basename='sale-invoice')
router.register(r'products', ProductSearchViewSet, basename='product-search')

urlpatterns = [
    path('', include(router.urls)),
]
