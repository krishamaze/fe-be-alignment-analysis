from rest_framework import routers
from .views import EventLogViewSet

router = routers.DefaultRouter()
router.register(r"logs", EventLogViewSet, basename="eventlog")

urlpatterns = router.urls
