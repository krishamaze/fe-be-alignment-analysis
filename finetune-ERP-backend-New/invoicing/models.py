from decimal import Decimal
from django.conf import settings
from django.db import models, transaction
from django.utils import timezone


class InvoiceSequence(models.Model):
    """Stores last used invoice number for global sequencing."""

    current = models.PositiveIntegerField(default=0)

    @classmethod
    def next(cls) -> int:
        with transaction.atomic():
            obj, _ = cls.objects.select_for_update().get_or_create(pk=1)
            obj.current += 1
            obj.save(update_fields=["current"])
            return obj.current


class Invoice(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("issued", "Issued"),
        ("paid", "Paid"),
    ]

    booking = models.ForeignKey(
        "bookings.Booking", on_delete=models.CASCADE, related_name="invoices"
    )
    invoice_no = models.CharField(max_length=20, unique=True, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sgst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    igst = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="draft"
    )
    issued_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.invoice_no:
            next_no = InvoiceSequence.next()
            self.invoice_no = f"FT-INV-{next_no:04d}"
        if self.status == "issued" and not self.issued_at:
            self.issued_at = timezone.now()
        super().save(*args, **kwargs)


class InvoiceLineItem(models.Model):
    invoice = models.ForeignKey(
        Invoice, on_delete=models.CASCADE, related_name="line_items"
    )
    description = models.CharField(max_length=255)
    hsn_code = models.CharField(max_length=20, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.amount = (Decimal(self.quantity) * Decimal(self.unit_price)).quantize(
            Decimal("0.01")
        )
        super().save(*args, **kwargs)


class PaymentRecord(models.Model):
    MODE_CHOICES = [
        ("cash", "Cash"),
        ("card", "Card"),
        ("upi", "UPI"),
        ("emi", "EMI"),
    ]

    invoice = models.ForeignKey(
        Invoice, on_delete=models.CASCADE, related_name="payments"
    )
    mode = models.CharField(max_length=10, choices=MODE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    ref_no = models.CharField(max_length=50, blank=True)
    date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
