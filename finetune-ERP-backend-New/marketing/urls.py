from django.urls import path
from .views import ContactCreateView, ScheduleCallCreateView

urlpatterns = [
    path("contact/", ContactCreateView.as_view(), name="contact-create"),
    path("schedule-call/", ScheduleCallCreateView.as_view(), name="schedule-call"),
]
