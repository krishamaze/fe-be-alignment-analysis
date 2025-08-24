from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet,
    CategoryViewSet,
    SubCategoryViewSet,
    ProductViewSet,
    VariantViewSet,
    UnitViewSet,
    QualityViewSet,
    legacy_product_redirect,
)

router = DefaultRouter(trailing_slash=False)
router.register(r"departments", DepartmentViewSet, basename="department")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"subcategories", SubCategoryViewSet, basename="subcategory")
router.register(r"products", ProductViewSet, basename="product")
router.register(r"variants", VariantViewSet, basename="variant")
router.register(r"units", UnitViewSet, basename="unit")
router.register(r"qualities", QualityViewSet, basename="quality")

urlpatterns = router.urls + [
    path("productdetail/<str:model>/<str:brand>/", legacy_product_redirect),
]
