# accounts/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import CustomUser
@receiver(post_save, sender=CustomUser)
def auto_unassign_authority_on_user_change(sender, instance: CustomUser, **kwargs):
    """If a branch head becomes inactive or deleted, detach them from stores."""
    if instance.role != "branch_head":
        return
    if instance.deleted or not instance.is_active:
        for store in instance.managed_stores.all():
            store.authority = None
            store.save(update_fields=["authority"])
        if instance.store_id:
            instance.store = None
            instance.save(update_fields=["store"])
