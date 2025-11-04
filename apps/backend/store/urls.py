# urls.py
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import StoreViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r"stores", StoreViewSet, basename="store")

urlpatterns = router.urls
