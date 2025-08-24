from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from bookings.models import Booking
from catalog.models import (
    Product,
    Variant,
    Department,
    Category,
    SubCategory,
    Unit,
    Quality,
)
from spares.models import Spare
from store.models import Store
from .models import EventLog


def _create_log(instance, action):
    EventLog.objects.create(
        actor=getattr(instance, "user", None),
        entity_type=instance._meta.model_name,
        entity_id=str(instance.pk),
        action=action,
        reason=getattr(instance, "reason", None),
    )


@receiver(post_save, sender=Booking)
def log_booking_save(sender, instance, created, **kwargs):
    _create_log(instance, "created" if created else "updated")


@receiver(post_delete, sender=Booking)
def log_booking_delete(sender, instance, **kwargs):
    _create_log(instance, "deleted")


@receiver(post_save, sender=Product)
def log_product_save(sender, instance, created, **kwargs):
    _create_log(instance, "created" if created else "updated")


@receiver(post_delete, sender=Product)
def log_product_delete(sender, instance, **kwargs):
    _create_log(instance, "deleted")


@receiver(post_save, sender=Variant)
def log_variant_save(sender, instance, created, **kwargs):
    _create_log(instance, "created" if created else "updated")


@receiver(post_delete, sender=Variant)
def log_variant_delete(sender, instance, **kwargs):
    _create_log(instance, "deleted")


@receiver(post_save, sender=Spare)
def log_spare_save(sender, instance, created, **kwargs):
    _create_log(instance, "created" if created else "updated")


@receiver(post_delete, sender=Spare)
def log_spare_delete(sender, instance, **kwargs):
    _create_log(instance, "deleted")


@receiver(post_save, sender=Store)
def log_store_save(sender, instance, created, **kwargs):
    _create_log(instance, "created" if created else "updated")


@receiver(post_delete, sender=Store)
def log_store_delete(sender, instance, **kwargs):
    _create_log(instance, "deleted")


for model in [Department, Category, SubCategory, Unit, Quality]:
    @receiver(post_save, sender=model)
    def _save(sender, instance, created, **kwargs):
        _create_log(instance, "created" if created else "updated")

    @receiver(post_delete, sender=model)
    def _delete(sender, instance, **kwargs):
        _create_log(instance, "deleted")
