from django.contrib import admin
from .models import SaleInvoice, SaleInvoiceLineItem


class SaleInvoiceLineItemInline(admin.TabularInline):
    model = SaleInvoiceLineItem
    extra = 1
    fields = ['description', 'hsn_code', 'quantity', 'unit_price', 'amount']
    readonly_fields = ['amount']


@admin.register(SaleInvoice)
class SaleInvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_no', 'customer_name', 'total', 'status', 'created_at']
    list_filter = ['status', 'invoice_type', 'created_at']
    search_fields = ['invoice_no', 'customer_name', 'customer_phone']
    readonly_fields = ['invoice_no', 'created_at', 'updated_at']
    inlines = [SaleInvoiceLineItemInline]
    
    fieldsets = (
        ('Invoice Details', {
            'fields': ('invoice_no', 'invoice_type', 'status')
        }),
        ('Customer Information', {
            'fields': ('customer_name', 'customer_phone', 'customer_address')
        }),
        ('Amounts', {
            'fields': ('subtotal', 'cgst', 'sgst', 'igst', 'total')
        }),
        ('Metadata', {
            'fields': ('created_by', 'issued_at', 'created_at', 'updated_at')
        }),
    )
