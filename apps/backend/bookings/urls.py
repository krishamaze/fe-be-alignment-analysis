from rest_framework.routers import DefaultRouter
from .views import (
    BookingViewSet,
    IssueViewSet,
    OtherIssueViewSet,
    QuestionViewSet,
    CustomerResponseViewSet,
)

router = DefaultRouter(trailing_slash=False)
router.register(r"bookings", BookingViewSet, basename="booking")
router.register(r"issues", IssueViewSet, basename="issue")
router.register(r"otherissues", OtherIssueViewSet, basename="otherissue")
router.register(r"questions", QuestionViewSet, basename="question")
router.register(r"responses", CustomerResponseViewSet, basename="response")

urlpatterns = router.urls
