# accounts/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import CustomUser
from store.models import Store

@receiver(post_save, sender=CustomUser)
def auto_unassign_branch_head_on_user_change(sender, instance: CustomUser, **kwargs):
    """
    If a branch head user becomes inactive or deleted, unassign them from the store
    and clear the user's store reference.
    """
    if instance.role != 'branch_head':
        return
    if instance.deleted or not instance.is_active:
        try:
            store = instance.headed_store  # via related_name
        except Store.DoesNotExist:
            store = None
        if store and store.branch_head_id == instance.id:
            store.branch_head = None
            store.save(update_fields=['branch_head'])
        if instance.store_id:
            instance.store = None
            instance.save(update_fields=['store'])
