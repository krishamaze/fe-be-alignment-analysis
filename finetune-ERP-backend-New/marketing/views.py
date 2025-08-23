from rest_framework import generics
from rest_framework.throttling import ScopedRateThrottle
from .models import Brand, Contact, ScheduleCall
from .serializers import BrandSerializer, ContactSerializer, ScheduleCallSerializer


class BrandListView(generics.ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer


class ContactCreateView(generics.CreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'contact'


class ScheduleCallCreateView(generics.CreateAPIView):
    queryset = ScheduleCall.objects.all()
    serializer_class = ScheduleCallSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'schedule_call'
