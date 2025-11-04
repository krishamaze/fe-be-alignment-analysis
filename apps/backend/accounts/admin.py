from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ["username", "email", "role", "is_staff", "is_superuser"]
    fieldsets = UserAdmin.fieldsets + (("Role Info", {"fields": ("role",)}),)
    add_fieldsets = UserAdmin.add_fieldsets + (("Role Info", {"fields": ("role",)}),)

    def save_model(self, request, obj, form, change):
        obj.full_clean()
        super().save_model(request, obj, form, change)


admin.site.register(CustomUser, CustomUserAdmin)
