"""
Custom permission classes for role-based access control.

This module provides permission classes for restricting API access based on
user roles in the Finetune ERP system.
"""

from rest_framework.permissions import BasePermission


class IsSystemAdminUser(BasePermission):
    """
    Permission class that allows access only to system administrators.

    Checks if the authenticated user has the 'system_admin' role. Used to
    protect administrative endpoints like user management and system configuration.

    Returns:
        bool: True if user is authenticated and has system_admin role, False otherwise.

    Example:
        class AdminUserViewSet(viewsets.ModelViewSet):
            permission_classes = [IsAuthenticated, IsSystemAdminUser]
            ...

    Note:
        This permission should be combined with IsAuthenticated to ensure
        the user is logged in before checking their role.
    """

    def has_permission(self, request, view):
        """
        Check if user has system admin role.

        Args:
            request (Request): HTTP request with authenticated user.
            view (View): The view being accessed.

        Returns:
            bool: True if user is system admin, False otherwise.
        """
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role.lower() == "system_admin"
        )
