from django.urls import path
from .views import SpareListView, SpareDetailView

urlpatterns = [
    path("spares/", SpareListView.as_view(), name="spare-list"),
    path("spares/<int:pk>/", SpareDetailView.as_view(), name="spare-detail"),
]
