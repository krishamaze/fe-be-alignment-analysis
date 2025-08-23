from rest_framework import generics
from .models import Spare
from .serializers import SpareSerializer


class SpareListView(generics.ListAPIView):
    queryset = Spare.objects.all()
    serializer_class = SpareSerializer


class SpareDetailView(generics.RetrieveAPIView):
    queryset = Spare.objects.all()
    serializer_class = SpareSerializer
