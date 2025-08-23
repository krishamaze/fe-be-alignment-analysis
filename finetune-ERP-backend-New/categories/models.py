from django.db import models
from django.core.exceptions import ValidationError
from departments.models import Department


class Category(models.Model):
    department = models.ForeignKey(Department, related_name='categories', on_delete=models.CASCADE)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='children', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        level = 0
        parent = self.parent
        while parent:
            level += 1
            if level >= 3:
                raise ValidationError('Category hierarchy supports up to 3 levels')
            parent = parent.parent

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name
