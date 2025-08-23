from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "date", "time", "status")
    search_fields = ("name", "email")
    list_filter = ("status",)
