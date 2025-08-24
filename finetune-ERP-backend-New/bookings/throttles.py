from rest_framework.throttling import ScopedRateThrottle


class BookingRateThrottle(ScopedRateThrottle):
    scope = "booking"

    def allow_request(self, request, view):
        user = getattr(request, "user", None)
        if (
            user
            and user.is_authenticated
            and user.role in ("advisor", "branch_head", "system_admin")
        ):
            return True
        return super().allow_request(request, view)
