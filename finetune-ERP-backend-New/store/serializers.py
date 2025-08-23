from rest_framework import serializers
from .models import Store


class StoreSerializer(serializers.ModelSerializer):
    store_address = serializers.CharField(source="address")
    lat = serializers.DecimalField(
        source="geofence.latitude",
        max_digits=9,
        decimal_places=6,
        read_only=True,
        allow_null=True,
    )
    lon = serializers.DecimalField(
        source="geofence.longitude",
        max_digits=9,
        decimal_places=6,
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = Store
        fields = ["id", "store_name", "store_address", "lat", "lon"]
        read_only_fields = fields
