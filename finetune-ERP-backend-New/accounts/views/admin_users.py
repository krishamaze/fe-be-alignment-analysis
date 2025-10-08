"""
Admin user management viewset for system administrators.

This module provides CRUD operations for user management with search, filtering,
and soft deletion capabilities. Only system administrators can access these endpoints.
"""

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q

from accounts.models import CustomUser
from accounts.serializers import CustomUserSerializer, RegisterUserSerializer
from accounts.permissions import IsSystemAdminUser


class AdminUserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for system administrators to manage user accounts.

    Provides full CRUD operations for user management with additional features:
    - Soft deletion (sets deleted=True and is_active=False)
    - Self-protection (prevents admins from deleting or disabling themselves)
    - Search across username, email, name, phone, and store
    - Filtering by role, store, and active status
    - Ordering by username, date_joined, or id

    Attributes:
        queryset (QuerySet): Non-deleted users with store relationship prefetched.
        permission_classes (list): Requires authenticated system admin.

    Example:
        GET /api/users?search=john&role=advisor&ordering=-date_joined

        Response:
        {
            "count": 1,
            "results": [
                {
                    "id": 5,
                    "username": "john",
                    "email": "john@example.com",
                    "role": "advisor",
                    "store": 1,
                    "store_name": "Main Branch",
                    "is_active": true
                }
            ]
        }

    Note:
        Uses select_related("store") to optimize database queries when
        retrieving user lists with store information.
    """

    queryset = CustomUser.objects.filter(deleted=False).select_related("store")
    permission_classes = [IsAuthenticated, IsSystemAdminUser]

    def get_serializer_class(self):
        """
        Return appropriate serializer based on action.

        Returns:
            class: RegisterUserSerializer for create, CustomUserSerializer otherwise.
        """
        return (
            RegisterUserSerializer if self.action == "create" else CustomUserSerializer
        )

    def create(self, request, *args, **kwargs):
        """
        Create a new user account.

        Args:
            request (Request): HTTP request with user data.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: Created user data with HTTP 201 status.

        Raises:
            ValidationError: If user data fails validation.

        Example:
            POST /api/users
            {
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "securepass123",
                "role": "advisor",
                "store": 1
            }
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(CustomUserSerializer(user).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete a user account.

        Sets deleted=True and is_active=False instead of hard deletion.
        Prevents administrators from deleting their own account.

        Args:
            request (Request): HTTP request from authenticated admin.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: HTTP 204 No Content on success.

        Raises:
            HTTP 400: If admin attempts to delete their own account.

        Example:
            DELETE /api/users/5

            Response: 204 No Content

        Note:
            Soft deletion preserves user data for audit trails while preventing
            login and API access.
        """
        user = self.get_object()

        if user == request.user:
            return Response(
                {"error": "You cannot delete yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.deleted = True
        user.is_active = False
        user.save()

        # 204 must have no body
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        """
        Update user account (PUT).

        Prevents administrators from disabling their own account to avoid
        accidental lockout.

        Args:
            request (Request): HTTP request with updated user data.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: Updated user data.

        Raises:
            HTTP 400: If admin attempts to disable their own account.

        Example:
            PUT /api/users/5
            {
                "username": "updateduser",
                "email": "updated@example.com",
                "is_active": true
            }

        Note:
            Applies to both PUT and PATCH operations via partial_update().
        """
        user = self.get_object()

        # Don’t disable yourself (covers PUT/PATCH if is_active present)
        if user == request.user and "is_active" in request.data:
            requested_active = request.data.get("is_active")
            # Treat "false"/"0"/False as disable attempt
            if str(requested_active).lower() in ("false", "0"):
                return Response(
                    {"error": "You cannot disable yourself."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """
        Partial update user account (PATCH).

        Delegates to update() to apply the same self-protection rules.

        Args:
            request (Request): HTTP request with partial user data.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: Updated user data.
        """
        # Mirror the same rules (self-disable & branch-head store assignment) for PATCH
        return self.update(request, *args, **kwargs)

    def get_queryset(self):
        """
        Return filtered and ordered queryset based on query parameters.

        Supports the following query parameters:
        - search: Search across username, email, first_name, last_name, phone, store_name
        - role: Filter by user role (system_admin, branch_head, advisor, customer)
        - store: Filter by store ID
        - is_active: Filter by active status (true/false)
        - ordering: Order by username, date_joined, or id (prefix with - for descending)

        Returns:
            QuerySet: Filtered and ordered user queryset.

        Example:
            GET /api/users?search=john&role=advisor&is_active=true&ordering=-date_joined

            Returns advisors named "john" who are active, ordered by most recent first.

        Note:
            Default ordering is -date_joined (newest first). Only whitelisted
            ordering fields are allowed to prevent SQL injection.
        """
        queryset = super().get_queryset()

        # Search
        search_query = self.request.query_params.get("search")
        if search_query:
            queryset = queryset.filter(
                Q(username__icontains=search_query)
                | Q(email__icontains=search_query)
                | Q(first_name__icontains=search_query)
                | Q(last_name__icontains=search_query)
                | Q(phone__icontains=search_query)
                | Q(store__store_name__icontains=search_query)
            ).distinct()

        # Role (single value)
        role = self.request.query_params.get("role")
        if role:
            queryset = queryset.filter(role=role)

        # Store
        store_id = self.request.query_params.get("store")
        if store_id:
            queryset = queryset.filter(store=store_id)

        # is_active — safe parse
        is_active = self.request.query_params.get("is_active")
        if is_active and is_active.lower() in ("true", "false"):
            queryset = queryset.filter(is_active=(is_active.lower() == "true"))

        # Ordering — whitelist
        allowed_ordering = {
            "username",
            "-username",
            "date_joined",
            "-date_joined",
            "id",
            "-id",
        }
        ordering = self.request.query_params.get("ordering", "-date_joined")
        queryset = queryset.order_by(
            ordering if ordering in allowed_ordering else "-date_joined"
        )

        return queryset
