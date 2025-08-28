from django.conf import settings
from django.db import models


class InventoryConfig(models.Model):
    category = models.OneToOneField('catalog.Category', on_delete=models.CASCADE, related_name='inventory_config')
    track_serials = models.BooleanField(default=False)
    log_price = models.BooleanField(default=False)
    require_stock_in_approval = models.BooleanField(default=False)

    def __str__(self):
        return f"Config for {self.category}"


class StockLedger(models.Model):
    store = models.ForeignKey('store.Store', on_delete=models.CASCADE, related_name='stock_ledgers')
    product_variant = models.ForeignKey('catalog.Variant', on_delete=models.CASCADE, related_name='stock_ledgers')
    quantity = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('store', 'product_variant')

    def __str__(self):
        return f"{self.store} - {self.product_variant}: {self.quantity}"


class StockEntry(models.Model):
    PURCHASE = 'purchase'
    SALE = 'sale'
    RETURN_IN = 'return_in'
    RETURN_OUT = 'return_out'
    TRANSFER_IN = 'transfer_in'
    TRANSFER_OUT = 'transfer_out'

    ENTRY_TYPES = [
        (PURCHASE, 'Purchase'),
        (SALE, 'Sale'),
        (RETURN_IN, 'Return In'),
        (RETURN_OUT, 'Return Out'),
        (TRANSFER_IN, 'Transfer In'),
        (TRANSFER_OUT, 'Transfer Out'),
    ]

    entry_type = models.CharField(max_length=20, choices=ENTRY_TYPES)
    store = models.ForeignKey('store.Store', on_delete=models.CASCADE, related_name='stock_entries')
    product_variant = models.ForeignKey('catalog.Variant', on_delete=models.CASCADE, related_name='stock_entries')
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    entered_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    booking = models.ForeignKey('bookings.Booking', on_delete=models.SET_NULL, null=True, blank=True, related_name='stock_entries')

    def __str__(self):
        return f"{self.entry_type} {self.product_variant} x{self.quantity}"


class SerialNumber(models.Model):
    STATUS_AVAILABLE = 'available'
    STATUS_SOLD = 'sold'
    STATUS_RETURNED = 'returned'

    STATUS_CHOICES = [
        (STATUS_AVAILABLE, 'Available'),
        (STATUS_SOLD, 'Sold'),
        (STATUS_RETURNED, 'Returned'),
    ]

    product_variant = models.ForeignKey('catalog.Variant', on_delete=models.CASCADE, related_name='serials')
    serial_no = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_AVAILABLE)
    store = models.ForeignKey('store.Store', on_delete=models.CASCADE, related_name='serials', null=True, blank=True)

    def __str__(self):
        return self.serial_no


class PriceLog(models.Model):
    product_variant = models.ForeignKey('catalog.Variant', on_delete=models.CASCADE, related_name='price_logs')
    old_price = models.DecimalField(max_digits=10, decimal_places=2)
    new_price = models.DecimalField(max_digits=10, decimal_places=2)
    date_changed = models.DateTimeField(auto_now_add=True)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.product_variant} {self.old_price}->{self.new_price}"
