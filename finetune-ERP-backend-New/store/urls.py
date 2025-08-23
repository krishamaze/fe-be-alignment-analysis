# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StoreViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r"stores", StoreViewSet, basename="store")

# Add custom endpoints for branch head management
urlpatterns = router.urls + [
    path(
        "stores/<int:store_id>/assign-branch-head",
        StoreViewSet.as_view({"post": "assign_branch_head"}),
        name="assign-branch-head",
    ),
    path(
        "stores/<int:store_id>/unassign-branch-head",
        StoreViewSet.as_view({"post": "unassign_branch_head"}),
        name="unassign-branch-head",
    ),
]
