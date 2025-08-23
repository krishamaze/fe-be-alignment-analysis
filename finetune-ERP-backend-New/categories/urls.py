from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, CategoryLegacyRedirect

router = DefaultRouter(trailing_slash=False)
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = router.urls + [
    path('category/<int:pk>', CategoryLegacyRedirect.as_view()),
]
