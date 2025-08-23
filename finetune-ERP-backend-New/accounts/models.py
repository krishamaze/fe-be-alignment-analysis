from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models
from store.models import Store


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ("system_admin", "System Admin"),
        ("branch_head", "Branch Head"),
        ("advisor", "Advisor"),
        ("customer", "Customer"),
    )
    role = models.CharField(max_length=12, choices=ROLE_CHOICES, default='advisor')
    phone = models.CharField(max_length=10, blank=True, null=True)
    store = models.ForeignKey(Store, on_delete=models.SET_NULL, null=True, blank=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} - ({self.role})"

    def clean(self):
        super().clean()
        if self.role == 'branch_head' and self.store_id:
            branch_head_id = getattr(self.store, 'branch_head_id', None)
            if branch_head_id and branch_head_id != self.id:
                raise ValidationError({'store': 'Store already has a different branch head'})
