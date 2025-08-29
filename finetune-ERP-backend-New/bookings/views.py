from rest_framework import mixins, permissions, viewsets
from .models import Booking, Issue, OtherIssue, Question, CustomerResponse
from .serializers import (
    BookingSerializer,
    IssueSerializer,
    OtherIssueSerializer,
    QuestionSerializer,
    CustomerResponseSerializer,
)
from store.permissions import (
    IsSystemAdminOrBookingCreate,
    IsSystemAdminOrReadOnly,
    IsSystemAdminOrCustomerCreate,
)
from .throttles import BookingRateThrottle
from .notifications import send_booking_notifications


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by("-date_created")
    serializer_class = BookingSerializer
    permission_classes = [IsSystemAdminOrBookingCreate]
    throttle_classes = [BookingRateThrottle]

    def perform_create(self, serializer):
        booking = serializer.save()
        send_booking_notifications(booking)

    def perform_update(self, serializer):
        old_status = serializer.instance.status
        booking = serializer.save()
        if booking.status != old_status:
            send_booking_notifications(booking)


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all().order_by("-date_created")
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]


class OtherIssueViewSet(viewsets.ModelViewSet):
    queryset = OtherIssue.objects.all().order_by("-id")
    serializer_class = OtherIssueSerializer
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by("-id")
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsSystemAdminOrReadOnly]


class CustomerResponseViewSet(
    mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    queryset = CustomerResponse.objects.all().order_by("id")
    serializer_class = CustomerResponseSerializer
    permission_classes = [IsSystemAdminOrCustomerCreate]
