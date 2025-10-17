from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse
from io import BytesIO
from xhtml2pdf import pisa
from django.template.loader import render_to_string
from django.utils import timezone

from .models import SaleInvoice
from .serializers import SaleInvoiceSerializer, ProductSearchSerializer
from catalog.models import Product


class SaleInvoiceViewSet(viewsets.ModelViewSet):
    """ViewSet for creating and managing sale invoices"""
    
    queryset = SaleInvoice.objects.all()
    serializer_class = SaleInvoiceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Filter by created_by for non-admin users
        if self.request.user.is_staff or self.request.user.role in ['systemadmin', 'branchhead']:
            return SaleInvoice.objects.all()
        return SaleInvoice.objects.filter(created_by=self.request.user)
    
    def perform_create(self, serializer):
        # Auto-set issued_at when status is 'issued'
        if serializer.validated_data.get('status') == 'issued':
            serializer.save(issued_at=timezone.now())
        else:
            serializer.save()
    
    @action(detail=True, methods=['get'], url_path='pdf')
    def generate_pdf(self, request, pk=None):
        """Generate and download PDF for invoice"""
        invoice = self.get_object()
        
        # Render HTML template
        html_string = render_to_string('sales/invoice_pdf.html', {
            'invoice': invoice,
            'line_items': invoice.line_items.all()
        })
        
        # Create PDF
        buffer = BytesIO()
        pisa_status = pisa.CreatePDF(html_string, dest=buffer)
        
        if pisa_status.err:
            return Response(
                {'error': 'PDF generation failed'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        buffer.seek(0)
        
        return FileResponse(
            buffer,
            as_attachment=True,
            filename=f'invoice_{invoice.invoice_no}.pdf',
            content_type='application/pdf'
        )


class ProductSearchViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for searching products for invoice creation"""
    
    queryset = Product.objects.filter(availability=True)
    serializer_class = ProductSearchSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset[:10]  # Limit to 10 results
