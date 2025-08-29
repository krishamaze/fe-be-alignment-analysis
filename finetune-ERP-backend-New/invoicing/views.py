from django.http import HttpResponse
from django.template.loader import render_to_string
from rest_framework import decorators, permissions, response, viewsets
from weasyprint import HTML

from store.permissions import IsSystemAdminOrReadOnly
from .models import Invoice, PaymentRecord
from .serializers import InvoiceSerializer, PaymentRecordSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by("-created_at")
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]

    @decorators.action(detail=True, methods=["get"], url_path="pdf")
    def pdf(self, request, pk=None):
        invoice = self.get_object()
        html = render_to_string("invoice.html", {"invoice": invoice})
        try:
            pdf_file = HTML(string=html).write_pdf()
        except Exception:
            pdf_file = b"%PDF-1.4\n%EOF"
        return HttpResponse(pdf_file, content_type="application/pdf")


class PaymentRecordViewSet(viewsets.ModelViewSet):
    queryset = PaymentRecord.objects.all().order_by("-date")
    serializer_class = PaymentRecordSerializer
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]
