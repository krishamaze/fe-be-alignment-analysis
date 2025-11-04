from rest_framework import serializers
from .models import Invoice, InvoiceLineItem, PaymentRecord
from .utils import compute_gst, validate_hsn


class InvoiceLineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceLineItem
        fields = ["id", "description", "hsn_code", "quantity", "unit_price", "amount"]
        read_only_fields = ["amount", "id"]

    def validate_hsn_code(self, value):
        if value and not validate_hsn(value):
            raise serializers.ValidationError("Invalid HSN code")
        return value


class InvoiceSerializer(serializers.ModelSerializer):
    line_items = InvoiceLineItemSerializer(many=True)

    class Meta:
        model = Invoice
        fields = [
            "id",
            "invoice_no",
            "booking",
            "subtotal",
            "cgst",
            "sgst",
            "igst",
            "total",
            "status",
            "issued_at",
            "created_by",
            "line_items",
        ]
        read_only_fields = ["invoice_no", "issued_at", "created_by"]

    def create(self, validated_data):
        items_data = validated_data.pop("line_items", [])
        user = self.context["request"].user
        subtotal = sum(
            item["quantity"] * item["unit_price"] for item in items_data
        )
        cgst, sgst, igst, total = compute_gst(
            subtotal, validated_data.get("cgst", 0), validated_data.get("sgst", 0), validated_data.get("igst", 0)
        )
        validated_data.update(
            {
                "subtotal": subtotal,
                "cgst": cgst,
                "sgst": sgst,
                "igst": igst,
                "total": total,
                "created_by": user,
            }
        )
        invoice = Invoice.objects.create(**validated_data)
        for item in items_data:
            InvoiceLineItem.objects.create(invoice=invoice, **item)
        return invoice


class PaymentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentRecord
        fields = ["id", "invoice", "mode", "amount", "ref_no", "date"]
