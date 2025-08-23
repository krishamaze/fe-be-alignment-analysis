from django.urls import path
from .views import BrandListView, ContactCreateView, ScheduleCallCreateView

urlpatterns = [
    path("brands/", BrandListView.as_view(), name="brand-list"),
    path("contact/", ContactCreateView.as_view(), name="contact-create"),
    path("schedule-call/", ScheduleCallCreateView.as_view(), name="schedule-call"),
]
