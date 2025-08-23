from rest_framework import permissions

class IsSystemAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'system_admin'


class IsSystemAdminOrBookingCreate(permissions.BasePermission):
    def has_permission(self, request, view):
        if getattr(view, 'action', None) == 'create':
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'system_admin'
