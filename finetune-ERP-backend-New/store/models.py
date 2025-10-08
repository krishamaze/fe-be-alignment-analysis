"""
Store and geofence models for location-based attendance tracking.

This module defines Store and StoreGeofence models for managing branch locations
and geographic boundaries used in the Workledger attendance system.
"""

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Store(models.Model):
    """
    Store/branch location model with authority assignment.

    Represents physical store locations (HQ or branches) with optional branch head
    authority assignment. Supports soft deletion and active/inactive status.

    Attributes:
        store_name (CharField): Store display name (max 100 characters).
        address (CharField): Physical address (max 255 characters, optional).
        code (CharField): Unique store code (max 10 characters).
        phone (CharField): Contact phone number (max 20 characters, optional).
        store_type (CharField): Store type - "HQ" (Head Office) or "BRANCH" (default).
        is_active (BooleanField): Whether store is currently active (default: True).
        deleted (BooleanField): Soft deletion flag (default: False).
        authority (ForeignKey): Optional branch head user (SET_NULL on user deletion).

    Example:
        >>> store = Store.objects.create(
        ...     store_name="Main Branch",
        ...     code="MB001",
        ...     store_type="BRANCH",
        ...     authority=branch_head_user
        ... )
        >>> str(store)
        'Main Branch - MB001'

    Note:
        The authority field creates a reverse relationship (managed_stores) on
        CustomUser for branch heads to access their assigned stores.
    """
    store_name = models.CharField(max_length=100)
    address = models.CharField(max_length=255, blank=True)
    code = models.CharField(max_length=10, unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    store_type = models.CharField(
        max_length=6,
        choices=[("HQ", "Head Office"), ("BRANCH", "Branch")],
        default="BRANCH",
    )
    is_active = models.BooleanField(default=True)
    deleted = models.BooleanField(default=False)
    authority = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_stores",
    )

    def __str__(self) -> str:
        """
        Return string representation of the store.

        Returns:
            str: Store name and code in format "store_name - code".
        """
        return f"{self.store_name} - {self.code}"


class StoreGeofence(models.Model):
    """
    Geographic boundary for location-based attendance validation.

    Defines a circular geofence around a store location used to validate
    check-in/check-out attendance. Attendance outside the geofence triggers
    a PENDING approval request in the Workledger system.

    Attributes:
        store (OneToOneField): Associated store (CASCADE on deletion).
        latitude (DecimalField): Latitude coordinate (-90 to 90, 6 decimal places).
        longitude (DecimalField): Longitude coordinate (-180 to 180, 6 decimal places).
        radius_m (PositiveIntegerField): Allowed radius in meters (default: 200).
        is_active (BooleanField): Whether geofence validation is enabled (default: True).
        created_at (DateTimeField): Timestamp of geofence creation.
        updated_at (DateTimeField): Timestamp of last update.

    Example:
        >>> geofence = StoreGeofence.objects.create(
        ...     store=store_instance,
        ...     latitude=12.345678,
        ...     longitude=56.789012,
        ...     radius_m=100
        ... )
        >>> str(geofence)
        'Main Branch - MB001 ⦿ (12.345678, 56.789012) r=100m'

    Note:
        Geofence validation is performed during check-in/check-out operations
        in the attendance module. Coordinates use 6 decimal places for ~0.1m precision.
    """

    store = models.OneToOneField(
        "store.Store", on_delete=models.CASCADE, related_name="geofence"
    )
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        validators=[MinValueValidator(-90), MaxValueValidator(90)],
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        validators=[MinValueValidator(-180), MaxValueValidator(180)],
    )
    radius_m = models.PositiveIntegerField(
        default=200, help_text="Allowed radius in meters"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Store Geofence"
        verbose_name_plural = "Store Geofences"

    def __str__(self) -> str:
        """
        Return string representation of the geofence.

        Returns:
            str: Store, coordinates, and radius in format "store ⦿ (lat, lon) r=Xm".
        """
        return (
            f"{self.store} ⦿ ({self.latitude}, {self.longitude}) " f"r={self.radius_m}m"
        )
