from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Store
from .serializers import StoreSerializer
from .permissions import IsSystemAdminOrReadOnly


class StoreViewSet(viewsets.ModelViewSet):
    # Hide soft-deleted by default
    queryset = Store.objects.filter(deleted=False)
    serializer_class = StoreSerializer
    permission_classes = [IsSystemAdminOrReadOnly]

    # Soft delete: mark deleted + deactivate, return 204 with no body
    def destroy(self, request, *args, **kwargs):
        store = self.get_object()
        store.deleted = True
        store.is_active = False
        store.save(update_fields=["deleted", "is_active"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Filters / search / ordering (safe)
    def get_queryset(self):
        qs = super().get_queryset()

        s = self.request.query_params.get("search")
        if s:
            qs = qs.filter(
                Q(store_name__icontains=s)
                | Q(code__icontains=s)
                | Q(address__icontains=s)
            ).distinct()

        store_type = self.request.query_params.get("store_type")
        if store_type in ("HQ", "BRANCH"):
            qs = qs.filter(store_type=store_type)
        else:
            qs = qs.filter(store_type="BRANCH", is_active=True)

        is_active = self.request.query_params.get("is_active")
        if is_active and is_active.lower() in ("true", "false"):
            qs = qs.filter(is_active=(is_active.lower() == "true"))

        id_in = self.request.query_params.get("id__in")
        if id_in:
            ids = [int(x) for x in id_in.split(",") if x.strip().isdigit()]
            if ids:
                qs = qs.filter(id__in=ids)

        allowed = {
            "store_name",
            "-store_name",
            "code",
            "-code",
            "id",
            "-id",
            "is_active",
            "-is_active",
        }
        ordering = self.request.query_params.get("ordering", "store_name")
        qs = qs.order_by(ordering if ordering in allowed else "store_name")
        return qs
