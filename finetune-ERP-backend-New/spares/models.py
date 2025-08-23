from django.db import models


class Spare(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    is_available = models.BooleanField(default=True)
    sku = models.CharField(max_length=50, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.sku})"
