from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet,
    CategoryViewSet,
    SubCategoryViewSet,
    ProductViewSet,
    VariantViewSet,
)

router = DefaultRouter(trailing_slash=False)
router.register(r"departments", DepartmentViewSet, basename="department")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"subcategories", SubCategoryViewSet, basename="subcategory")
router.register(r"products", ProductViewSet, basename="product")
router.register(r"variants", VariantViewSet, basename="variant")

urlpatterns = router.urls
