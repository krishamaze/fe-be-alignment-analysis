from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, DepartmentLegacyRedirect

router = DefaultRouter(trailing_slash=False)
router.register(r'departments', DepartmentViewSet, basename='department')

urlpatterns = router.urls + [
    path('department/<int:pk>', DepartmentLegacyRedirect.as_view()),
]
