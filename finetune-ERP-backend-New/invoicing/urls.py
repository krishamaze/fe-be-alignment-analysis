from rest_framework.routers import DefaultRouter
from .views import InvoiceViewSet, PaymentRecordViewSet

# TODO: Re-enable WeasyPrint when system libraries are installed on Railway

router = DefaultRouter()
router.register(r"invoices", InvoiceViewSet, basename="invoice")
router.register(r"payments", PaymentRecordViewSet, basename="payment")

urlpatterns = router.urls
