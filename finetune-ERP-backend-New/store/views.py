from rest_framework import generics
from .models import Store
from .serializers import StoreSerializer


class StoreListView(generics.ListAPIView):
    queryset = Store.objects.filter(deleted=False, is_active=True)
    serializer_class = StoreSerializer


class StoreDetailView(generics.RetrieveAPIView):
    queryset = Store.objects.filter(deleted=False, is_active=True)
    serializer_class = StoreSerializer
