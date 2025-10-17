from rest_framework import serializers
from .models import SaleInvoice, SaleInvoiceLineItem
from catalog.models import Product


class SaleInvoiceLineItemSerializer(serializers.ModelSerializer):
    """Serializer for invoice line items"""
    
    class Meta:
        model = SaleInvoiceLineItem
        fields = ['id', 'description', 'hsn_code', 'quantity', 'unit_price', 'amount']
        read_only_fields = ['amount']


class SaleInvoiceSerializer(serializers.ModelSerializer):
    """Serializer for sale invoices"""
    
    line_items = SaleInvoiceLineItemSerializer(many=True)
    
    class Meta:
        model = SaleInvoice
        fields = [
            'id', 'invoice_no', 'invoice_type', 'customer_name', 
            'customer_phone', 'customer_address', 'subtotal', 'cgst', 
            'sgst', 'igst', 'total', 'status', 'line_items', 
            'created_by', 'issued_at', 'created_at'
        ]
        read_only_fields = ['invoice_no', 'created_by', 'created_at']
    
    def create(self, validated_data):
        line_items_data = validated_data.pop('line_items')
        
        # Set created_by from request user
        validated_data['created_by'] = self.context['request'].user
        
        # Create invoice
        invoice = SaleInvoice.objects.create(**validated_data)
        
        # Create line items
        for item_data in line_items_data:
            SaleInvoiceLineItem.objects.create(invoice=invoice, **item_data)
        
        return invoice


class ProductSearchSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product search"""
    
    category_hsn = serializers.CharField(source='subcategory.category.hsn_code', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock', 'category_hsn']
