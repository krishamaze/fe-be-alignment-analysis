from rest_framework import viewsets
from store.permissions import IsSystemAdminOrReadOnly
from .models import Department
from .serializers import DepartmentSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsSystemAdminOrReadOnly]
    lookup_field = 'slug'

from django.views.generic import RedirectView
from django.shortcuts import get_object_or_404


class DepartmentLegacyRedirect(RedirectView):
    permanent = True

    def get_redirect_url(self, *args, **kwargs):
        obj = get_object_or_404(Department, pk=kwargs['pk'])
        return f"/api/departments/{obj.slug}"
