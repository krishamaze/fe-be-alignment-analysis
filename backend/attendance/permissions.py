"""Permission classes for attendance-related API views.

These classes implement role-based access control for the attendance app.
Views should typically combine :class:`IsAuthenticatedRole` with
``IsSelfAdvisorOrManager`` (or stricter permissions) to ensure only
authorized users may access or modify attendance resources.
"""

from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAuthenticatedRole(BasePermission):
    """Allow only authenticated users."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)


class IsSystemAdmin(BasePermission):
    """System admins or superusers."""

    def has_permission(self, request, view):
        u = request.user
        return bool(
            u and u.is_authenticated and (u.is_superuser or getattr(u, "role", None) == "system_admin")
        )


class IsBranchHead(BasePermission):
    """Branch heads only."""

    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and getattr(u, "role", None) == "branch_head")


class IsAdvisor(BasePermission):
    """Advisors only."""

    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and getattr(u, "role", None) == "advisor")


class IsSelfAdvisorOrManager(BasePermission):
    """
    Advisors: can access ONLY their own attendance/resources.
    Branch-head: can access advisors within their store.
    System admin: can access anything.
    View must either:
      - provide `get_target_user(obj|kwargs)` helper on the view, OR
      - use `lookup_field="user_id"` in URL to resolve a target user id, OR
      - operate on Attendance/AttendanceRequest instances that have `.user` or `.attendance.user`.
    """

    def has_permission(self, request, view):
        # Allow basic auth; object-level check will decide access.
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        u = request.user
        if not u.is_authenticated:
            return False

        # System admin full access
        if u.is_superuser or getattr(u, "role", None) == "system_admin":
            return True

        # Resolve target user from obj
        target_user = None

        # Attendance instance
        if hasattr(obj, "user"):
            target_user = getattr(obj, "user", None)

        # AttendanceRequest instance
        if target_user is None and hasattr(obj, "attendance"):
            att = getattr(obj, "attendance", None)
            target_user = getattr(att, "user", None)

        if target_user is None:
            # Fallback: view may expose get_target_user(...)
            getter = getattr(view, "get_target_user", None)
            if callable(getter):
                target_user = getter(obj)

        if target_user is None:
            # If we couldn't resolve, deny by default
            return False

        # Advisor self-only
        if getattr(u, "role", None) == "advisor":
            return target_user_id(target_user) == u.id

        # Branch-head: same store only, and ONLY target is advisor
        if getattr(u, "role", None) == "branch_head":
            if getattr(target_user, "role", None) != "advisor":
                return False
            return (
                getattr(u, "store_id", None) is not None
                and getattr(target_user, "store_id", None) == getattr(u, "store_id", None)
            )

        return False


def target_user_id(user_obj):
    """Return ``user_obj``'s ``id`` as an ``int`` if possible."""

    try:
        return int(getattr(user_obj, "id", None))
    except Exception:  # pragma: no cover - defensive
        return None

