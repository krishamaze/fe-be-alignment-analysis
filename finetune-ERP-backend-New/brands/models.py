from django.db import models


class Brand(models.Model):
    name = models.CharField(max_length=100)
    logo = models.URLField(blank=True)

    def __str__(self) -> str:
        return self.name
