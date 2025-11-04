from rest_framework import routers
from django.urls import path
from .views import EventLogViewSet

router = routers.DefaultRouter()
router.register(r"logs", EventLogViewSet, basename="eventlog")

urlpatterns = router.urls + [
    path("logs/export/", EventLogViewSet.as_view({"get": "export"}), name="eventlog-export"),
]
