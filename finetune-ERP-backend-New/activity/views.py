from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
import csv

from accounts.permissions import IsSystemAdminUser
from .models import EventLog
from .serializers import EventLogSerializer


class EventLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventLog.objects.all()
    serializer_class = EventLogSerializer
    permission_classes = [IsSystemAdminUser]

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

    @action(detail=False, methods=["get"])
    def export(self, request):
        fmt = request.query_params.get("format", "csv")
        logs = self.get_queryset()
        if fmt == "json":
            serializer = self.get_serializer(logs, many=True)
            return Response(serializer.data)
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = "attachment; filename=event_logs.csv"
        writer = csv.writer(response)
        writer.writerow(["id", "actor", "entity_type", "action", "reason", "timestamp"])
        for log in logs:
            writer.writerow(
                [
                    log.id,
                    getattr(log.actor, "username", ""),
                    log.entity_type,
                    log.action,
                    log.reason or "",
                    log.timestamp.isoformat(),
                ]
            )
        return response
