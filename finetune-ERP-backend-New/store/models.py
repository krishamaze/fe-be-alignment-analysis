from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Store(models.Model):
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
        return f"{self.store_name} - {self.code}"


class StoreGeofence(models.Model):
    """Geofence checked at check-in / check-out; outside attendance triggers a
    PENDING approval request in later phases."""

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
        return (
            f"{self.store} ⦿ ({self.latitude}, {self.longitude}) " f"r={self.radius_m}m"
        )
