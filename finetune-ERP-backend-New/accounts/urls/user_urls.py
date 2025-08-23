from django.urls import path, include
from rest_framework.routers import DefaultRouter
from accounts.views.admin_users import AdminUserViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r"users", AdminUserViewSet, basename="admin-users")

# URL patterns for admin user management
urlpatterns = [path("", include(router.urls))]
