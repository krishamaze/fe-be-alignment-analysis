from rest_framework import serializers
from .models import EventLog


class EventLogSerializer(serializers.ModelSerializer):
    actor = serializers.StringRelatedField()

    class Meta:
        model = EventLog
        fields = [
            "id",
            "actor",
            "entity_type",
            "entity_id",
            "action",
            "reason",
            "metadata",
            "timestamp",
        ]
        read_only_fields = fields
