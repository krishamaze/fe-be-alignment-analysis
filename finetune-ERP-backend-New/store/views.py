"""
Store management viewset with public read access and admin-only modifications.

This module provides CRUD operations for store management with soft deletion,
search, filtering, and ordering capabilities.
"""

from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from django.db.models import Q

from accounts.permissions import IsSystemAdminUser
from .models import Store
from .serializers import StoreSerializer


class StoreViewSet(viewsets.ModelViewSet):
    """
    ViewSet for store/branch management with role-based permissions.

    Provides full CRUD operations for stores with public read access and
    system admin-only write access. Supports soft deletion, search across
    name/code/address, filtering by type/status, and ordering.

    Attributes:
        queryset (QuerySet): Non-deleted stores.
        serializer_class (class): StoreSerializer for store data.

    Permissions:
        - GET/HEAD/OPTIONS: AllowAny (public read access)
        - POST/PUT/PATCH/DELETE: IsAuthenticated + IsSystemAdminUser

    Example:
        GET /api/stores?search=main&store_type=BRANCH&ordering=store_name

        Response:
        {
            "count": 1,
            "results": [
                {
                    "id": 1,
                    "store_name": "Main Branch",
                    "code": "MB001",
                    "store_type": "BRANCH",
                    "is_active": true,
                    "authority": 2
                }
            ]
        }

    Note:
        Default filtering shows only active BRANCH stores unless store_type
        parameter is explicitly provided.
    """

    # Hide soft-deleted by default
    queryset = Store.objects.filter(deleted=False)
    serializer_class = StoreSerializer

    def get_permissions(self):
        """
        Return permission classes based on request method.

        Returns:
            list: AllowAny for safe methods, IsAuthenticated + IsSystemAdminUser otherwise.
        """
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsSystemAdminUser()]

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete a store.

        Sets deleted=True and is_active=False instead of hard deletion.

        Args:
            request (Request): HTTP request from authenticated admin.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: HTTP 204 No Content on success.

        Example:
            DELETE /api/stores/1

            Response: 204 No Content

        Note:
            Soft deletion preserves store data for audit trails and maintains
            referential integrity with related models.
        """
        # Soft delete: mark deleted + deactivate, return 204 with no body
        store = self.get_object()
        store.deleted = True
        store.is_active = False
        store.save(update_fields=["deleted", "is_active"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        """
        Return filtered and ordered queryset based on query parameters.

        Supports the following query parameters:
        - search: Search across store_name, code, and address
        - store_type: Filter by "HQ" or "BRANCH" (default: active BRANCH stores)
        - is_active: Filter by active status (true/false)
        - id__in: Filter by comma-separated list of IDs
        - ordering: Order by store_name, code, id, or is_active (prefix with - for descending)

        Returns:
            QuerySet: Filtered and ordered store queryset.

        Example:
            GET /api/stores?search=main&store_type=BRANCH&is_active=true&ordering=-store_name

            Returns active branch stores matching "main", ordered by name descending.

        Note:
            Default ordering is store_name (ascending). Only whitelisted ordering
            fields are allowed to prevent SQL injection.
        """
        # Filters / search / ordering (safe)
        qs = super().get_queryset()

        s = self.request.query_params.get("search")
        if s:
            qs = qs.filter(
                Q(store_name__icontains=s)
                | Q(code__icontains=s)
                | Q(address__icontains=s)
            ).distinct()

        store_type = self.request.query_params.get("store_type")
        if store_type in ("HQ", "BRANCH"):
            qs = qs.filter(store_type=store_type)
        else:
            qs = qs.filter(store_type="BRANCH", is_active=True)

        is_active = self.request.query_params.get("is_active")
        if is_active and is_active.lower() in ("true", "false"):
            qs = qs.filter(is_active=(is_active.lower() == "true"))

        id_in = self.request.query_params.get("id__in")
        if id_in:
            ids = [int(x) for x in id_in.split(",") if x.strip().isdigit()]
            if ids:
                qs = qs.filter(id__in=ids)

        allowed = {
            "store_name",
            "-store_name",
            "code",
            "-code",
            "id",
            "-id",
            "is_active",
            "-is_active",
        }
        ordering = self.request.query_params.get("ordering", "store_name")
        qs = qs.order_by(ordering if ordering in allowed else "store_name")
        return qs
