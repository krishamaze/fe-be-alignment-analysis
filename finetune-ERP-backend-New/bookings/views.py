from rest_framework import viewsets
from rest_framework.throttling import ScopedRateThrottle
from .models import Booking
from .serializers import BookingSerializer
from store.permissions import IsSystemAdminOrBookingCreate


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-date_created')
    serializer_class = BookingSerializer
    permission_classes = [IsSystemAdminOrBookingCreate]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'booking'
