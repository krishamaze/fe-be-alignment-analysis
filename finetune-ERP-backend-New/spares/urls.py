from rest_framework.routers import DefaultRouter
from .views import SpareViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r"spares", SpareViewSet, basename="spare")

urlpatterns = router.urls
