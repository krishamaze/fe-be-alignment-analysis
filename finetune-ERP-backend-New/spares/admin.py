from django.contrib import admin
from .models import Spare


@admin.register(Spare)
class SpareAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "sku", "price", "is_active")
    search_fields = ("name", "sku")
    list_filter = ("is_active",)
