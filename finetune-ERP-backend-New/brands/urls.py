from django.urls import path
from .views import BrandListView, BrandDetailView

urlpatterns = [
    path("brands/", BrandListView.as_view(), name="brand-list"),
    path("brands/<int:pk>/", BrandDetailView.as_view(), name="brand-detail"),
]
