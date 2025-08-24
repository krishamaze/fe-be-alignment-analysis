from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, VariantViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r"products", ProductViewSet, basename="product")
router.register(r"variants", VariantViewSet, basename="variant")

urlpatterns = router.urls
