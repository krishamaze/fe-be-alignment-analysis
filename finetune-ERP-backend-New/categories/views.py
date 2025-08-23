from rest_framework import viewsets
from store.permissions import IsSystemAdminOrReadOnly
from .models import Category
from .serializers import CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.select_related('department', 'parent').prefetch_related('children')
    serializer_class = CategorySerializer
    permission_classes = [IsSystemAdminOrReadOnly]
    lookup_field = 'slug'

from django.views.generic import RedirectView
from django.shortcuts import get_object_or_404


class CategoryLegacyRedirect(RedirectView):
    permanent = True

    def get_redirect_url(self, *args, **kwargs):
        obj = get_object_or_404(Category, pk=kwargs['pk'])
        return f"/api/categories/{obj.slug}"
