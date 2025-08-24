from rest_framework import generics, viewsets
from rest_framework.throttling import ScopedRateThrottle
from .models import Brand, Contact, ScheduleCall
from .serializers import BrandSerializer, ContactSerializer, ScheduleCallSerializer
from store.permissions import IsSystemAdminOrReadOnly


class BrandViewSet(viewsets.ModelViewSet):
    """CRUD endpoints for Brand.

    Non-admins get read-only access via
    :class:`store.permissions.IsSystemAdminOrReadOnly`.
    """

    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsSystemAdminOrReadOnly]

    def create(self, request, *args, **kwargs):  # pragma: no cover - simple proxy
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):  # pragma: no cover - simple proxy
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):  # pragma: no cover - simple proxy
        return super().destroy(request, *args, **kwargs)


class ContactCreateView(generics.CreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "contact"


class ScheduleCallCreateView(generics.CreateAPIView):
    queryset = ScheduleCall.objects.all()
    serializer_class = ScheduleCallSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "schedule_call"
