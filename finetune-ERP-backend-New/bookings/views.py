from rest_framework import viewsets
from .models import Booking
from .serializers import BookingSerializer
from store.permissions import IsSystemAdminOrBookingCreate
from .throttles import BookingRateThrottle
from .notifications import send_booking_notifications


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-date_created')
    serializer_class = BookingSerializer
    permission_classes = [IsSystemAdminOrBookingCreate]
    throttle_classes = [BookingRateThrottle]

    def perform_create(self, serializer):
        booking = serializer.save()
        send_booking_notifications(booking)
