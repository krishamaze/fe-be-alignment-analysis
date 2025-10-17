from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class SaleInvoice(models.Model):
    """Standalone product sale invoice (no booking required)"""
    
    INVOICE_TYPE_CHOICES = [
        ('retail_sale', 'Retail Sale'),
        ('repair_service', 'Repair Service'),  # Future use
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('issued', 'Issued'),
        ('paid', 'Paid'),
    ]
    
    invoice_no = models.CharField(max_length=20, unique=True, blank=True)
    invoice_type = models.CharField(max_length=20, choices=INVOICE_TYPE_CHOICES, default='retail_sale')
    
    # Customer details
    customer_name = models.CharField(max_length=200)
    customer_phone = models.CharField(max_length=15)
    customer_address = models.TextField(blank=True)
    
    # Amounts
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    igst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sale_invoices')
    issued_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['invoice_no']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"{self.invoice_no} - {self.customer_name}"
    
    def save(self, *args, **kwargs):
        # Auto-generate invoice number if not set
        if not self.invoice_no:
            last_invoice = SaleInvoice.objects.order_by('-id').first()
            if last_invoice and last_invoice.invoice_no:
                try:
                    last_num = int(last_invoice.invoice_no.split('-')[-1])
                    self.invoice_no = f"FT-SALE-{last_num + 1:04d}"
                except (ValueError, IndexError):
                    self.invoice_no = "FT-SALE-0001"
            else:
                self.invoice_no = "FT-SALE-0001"
        
        super().save(*args, **kwargs)


class SaleInvoiceLineItem(models.Model):
    """Line items for sale invoice"""
    
    invoice = models.ForeignKey(SaleInvoice, on_delete=models.CASCADE, related_name='line_items')
    
    # Product details
    description = models.CharField(max_length=300)
    hsn_code = models.CharField(max_length=8, blank=True)
    
    # Quantity & pricing
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return f"{self.description} - ₹{self.amount}"
    
    def save(self, *args, **kwargs):
        # Auto-calculate amount
        self.amount = self.quantity * self.unit_price
        super().save(*args, **kwargs)
