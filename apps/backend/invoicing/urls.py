from rest_framework.routers import DefaultRouter
from .views import InvoiceViewSet, PaymentRecordViewSet

# TODO(v1.1): Enable invoice PDF once Railway system libraries available

router = DefaultRouter()
router.register(r"invoices", InvoiceViewSet, basename="invoice")
router.register(r"payments", PaymentRecordViewSet, basename="payment")

urlpatterns = router.urls
