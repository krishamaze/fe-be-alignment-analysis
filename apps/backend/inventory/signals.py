from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from catalog.models import Variant

from .models import StockEntry, StockLedger, PriceLog


@receiver(post_save, sender=StockEntry)
def update_ledger(sender, instance, created, **kwargs):
    if not created:
        return
    ledger, _ = StockLedger.objects.get_or_create(
        store=instance.store, product_variant=instance.product_variant
    )
    if instance.entry_type in [
        StockEntry.PURCHASE,
        StockEntry.RETURN_IN,
        StockEntry.TRANSFER_IN,
    ]:
        ledger.quantity += instance.quantity
    else:
        ledger.quantity -= instance.quantity
    ledger.save()


@receiver(pre_save, sender=Variant)
def log_price_change(sender, instance, **kwargs):
    if not instance.pk:
        return
    previous = Variant.objects.get(pk=instance.pk)
    if previous.price != instance.price:
        PriceLog.objects.create(
            product_variant=instance,
            old_price=previous.price,
            new_price=instance.price,
        )
