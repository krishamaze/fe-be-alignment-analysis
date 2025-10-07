"""
Custom user model for Finetune ERP with role-based access control.

This module extends Django's AbstractUser to provide role-based authentication
and authorization for the ERP system, supporting system administrators, branch
heads, advisors, and customers with store-based relationships.
"""

from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models
from store.models import Store


class CustomUser(AbstractUser):
    """
    Custom user model with role-based access control and store relationships.

    Extends Django's AbstractUser to add role-based permissions, phone contact,
    store assignment, and soft deletion capabilities. Supports four user roles:
    system_admin, branch_head, advisor, and customer.

    Attributes:
        ROLE_CHOICES (tuple): Available user roles with display names.
        role (CharField): User's role in the system (default: "advisor").
        phone (CharField): Optional 10-digit phone number.
        store (ForeignKey): Optional store assignment (SET_NULL on store deletion).
        email (EmailField): Unique email address for authentication.
        is_active (BooleanField): Whether the user account is active.
        deleted (BooleanField): Soft deletion flag (default: False).
        managed_stores (RelatedManager): Reverse relation for stores where user is authority.

    Note:
        Branch heads can be assigned as authority to stores via the Store.authority
        field, creating a managed_stores reverse relationship. The clean() method
        enforces that a branch head can only be assigned to a store if they are
        not already the authority for a different store.

    Example:
        >>> admin = CustomUser.objects.create_user(
        ...     username="admin",
        ...     email="admin@example.com",
        ...     role="system_admin"
        ... )
        >>> advisor = CustomUser.objects.create_user(
        ...     username="advisor1",
        ...     email="advisor@example.com",
        ...     role="advisor",
        ...     store=store_instance
        ... )
    """
    ROLE_CHOICES = (
        ("system_admin", "System Admin"),
        ("branch_head", "Branch Head"),
        ("advisor", "Advisor"),
        ("customer", "Customer"),
    )
    role = models.CharField(max_length=12, choices=ROLE_CHOICES, default="advisor")
    phone = models.CharField(max_length=10, blank=True, null=True)
    store = models.ForeignKey(Store, on_delete=models.SET_NULL, null=True, blank=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        """
        Return string representation of the user.

        Returns:
            str: Username and role in format "username - (role)".

        Example:
            >>> user = CustomUser(username="john", role="advisor")
            >>> str(user)
            'john - (advisor)'
        """
        return f"{self.username} - ({self.role})"

    def clean(self):
        """
        Validate user data before saving.

        Ensures that branch heads cannot be assigned to a store that already
        has a different branch head as its authority. This prevents conflicts
        in store management hierarchy.

        Raises:
            ValidationError: If attempting to assign a branch head to a store
                that already has a different branch head as authority.

        Note:
            This validation is called automatically by Django's full_clean()
            method and in the admin interface via save_model().

        Example:
            >>> branch_head = CustomUser(role="branch_head", store=store1)
            >>> branch_head.clean()  # Validates store assignment
        """
        super().clean()
        if self.role == "branch_head" and self.store_id:
            authority_id = getattr(self.store, "authority_id", None)
            if authority_id and authority_id != self.id:
                raise ValidationError(
                    {"store": "Store already has a different branch head"}
                )
