from rest_framework import serializers

from .models import (
    InventoryConfig,
    PriceLog,
    SerialNumber,
    StockEntry,
    StockLedger,
)


class InventoryConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryConfig
        fields = '__all__'


class StockLedgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockLedger
        fields = '__all__'


class StockEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = StockEntry
        fields = '__all__'


class SerialNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = SerialNumber
        fields = '__all__'


class PriceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceLog
        fields = '__all__'
