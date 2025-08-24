from rest_framework import viewsets, permissions
from .models import EventLog
from .serializers import EventLogSerializer


class EventLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventLog.objects.all()
    serializer_class = EventLogSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params
        entity_type = params.get("entity_type")
        actor = params.get("actor")
        start = params.get("start")
        end = params.get("end")
        if entity_type:
            qs = qs.filter(entity_type=entity_type)
        if actor:
            qs = qs.filter(actor__id=actor)
        if start:
            qs = qs.filter(timestamp__gte=start)
        if end:
            qs = qs.filter(timestamp__lte=end)
        return qs
