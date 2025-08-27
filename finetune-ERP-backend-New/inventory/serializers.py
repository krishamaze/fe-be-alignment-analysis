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
    serial_numbers = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = StockEntry
        fields = '__all__'

    def validate(self, attrs):
        entry_type = attrs.get("entry_type")
        booking = attrs.get("booking")
        variant = attrs.get("product_variant")
        store = attrs.get("store")
        quantity = attrs.get("quantity", 0)
        serials = attrs.get("serial_numbers") or []
        category = getattr(getattr(variant.product, "subcategory", None), "category", None)

        if entry_type == StockEntry.SALE and not booking:
            raise serializers.ValidationError(
                {"booking": "Booking is required for sale entries."}
            )

        config = getattr(category, "inventory_config", None)
        if config and config.track_serials and entry_type in [
            StockEntry.SALE,
            StockEntry.PURCHASE,
            StockEntry.RETURN_IN,
            StockEntry.TRANSFER_IN,
        ]:
            if len(serials) != quantity:
                raise serializers.ValidationError(
                    {"serial_numbers": "Serial count must match quantity."}
                )
            if entry_type == StockEntry.SALE:
                available = SerialNumber.objects.filter(
                    serial_no__in=serials,
                    product_variant=variant,
                    store=store,
                    status=SerialNumber.STATUS_AVAILABLE,
                ).count()
                if available != quantity:
                    raise serializers.ValidationError(
                        {"serial_numbers": "Serials not available."}
                    )
        return super().validate(attrs)

    def create(self, validated_data):
        serials = validated_data.pop("serial_numbers", [])
        entry = super().create(validated_data)
        variant = entry.product_variant
        category = getattr(getattr(variant.product, "subcategory", None), "category", None)
        config = getattr(category, "inventory_config", None)
        if config and config.track_serials and serials:
            if entry.entry_type == StockEntry.SALE:
                for sn in serials:
                    obj = SerialNumber.objects.get(
                        serial_no=sn,
                        product_variant=variant,
                        store=entry.store,
                        status=SerialNumber.STATUS_AVAILABLE,
                    )
                    obj.status = SerialNumber.STATUS_SOLD
                    obj.store = None
                    obj.save()
            else:
                for sn in serials:
                    SerialNumber.objects.create(
                        product_variant=variant,
                        serial_no=sn,
                        store=entry.store,
                    )
        return entry


class SerialNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = SerialNumber
        fields = '__all__'


class PriceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceLog
        fields = '__all__'
