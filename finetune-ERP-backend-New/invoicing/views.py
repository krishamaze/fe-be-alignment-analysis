from rest_framework import decorators, permissions, response, viewsets

# from weasyprint import HTML  # TODO: Re-enable WeasyPrint when system libraries are installed on Railway

from store.permissions import IsSystemAdminOrReadOnly
from .models import Invoice, PaymentRecord
from .serializers import InvoiceSerializer, PaymentRecordSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by("-created_at")
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]

    @decorators.action(detail=True, methods=["get"], url_path="pdf")
    def pdf(self, request, pk=None):
        # TODO: Re-enable WeasyPrint when system libraries are installed on Railway
        return response.Response(
            {
                "status": "coming_soon",
                "message": "PDF generation temporarily disabled",
            }
        )


class PaymentRecordViewSet(viewsets.ModelViewSet):
    queryset = PaymentRecord.objects.all().order_by("-date")
    serializer_class = PaymentRecordSerializer
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]
