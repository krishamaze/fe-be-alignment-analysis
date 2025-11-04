from django.conf import settings
from django.db import models


class EventLog(models.Model):
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    entity_type = models.CharField(max_length=50)
    entity_id = models.CharField(max_length=36)
    action = models.CharField(max_length=20)
    reason = models.TextField(null=True, blank=True)
    metadata = models.JSONField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]

    def save(self, *args, **kwargs):
        if self.pk:
            raise ValueError("EventLog entries are immutable")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValueError("EventLog entries are immutable")
