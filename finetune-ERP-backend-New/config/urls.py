"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path
from django.urls import include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls.auth_urls")),
    path("api/", include("accounts.urls.user_urls")),
    path("api/", include("store.urls")),
    path("api/", include("spares.urls")),
    path("api/", include("catalog.urls")),
    path("api/", include("bookings.urls")),
    path("api/", include("invoicing.urls")),
    path("api/sales/", include("sales.urls")),
    path("api/", include("marketing.brand_urls")),
    path("api/marketing/", include("marketing.urls")),
    path("api/attendance/", include("attendance.urls")),
    path("api/", include("activity.urls")),
    path("api/", include("inventory.urls")),
    path("api/token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify", TokenVerifyView.as_view(), name="token_verify"),
]  # ← THIS CLOSING BRACKET WAS MISSING
