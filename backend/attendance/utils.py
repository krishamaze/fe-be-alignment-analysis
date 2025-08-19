"""Utility helpers for the attendance app.

All datetime operations should use timezone-aware values.

Geofence checked at check-in / check-out; outside attendance triggers a
PENDING approval request in later phases.
"""

import math
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:  # pragma: no cover - avoid circular import at runtime
    from store.models import StoreGeofence


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Return great-circle distance in kilometers using the haversine formula."""

    # Earth radius in kilometers
    radius = 6371.0

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return radius * c


def within_radius_m(lat: float, lon: float, geofence: Optional['StoreGeofence']) -> bool:
    """
    Return True if ``(lat, lon)`` is within ``geofence.radius_m`` of geofence center.

    Computes :func:`haversine_km` * 1000 and compares to radius. Handles ``None`` or
    inactive geofence by returning ``False``.
    """

    if not geofence or not geofence.is_active:
        return False

    distance_m = haversine_km(
        lat,
        lon,
        float(geofence.latitude),
        float(geofence.longitude),
    ) * 1000

    return distance_m <= geofence.radius_m


def idem_get(request, endpoint: str):
    """Return previously stored idempotent record for this request.

    If the ``Idempotency-Key`` header is not provided, ``None`` is returned.
    Otherwise the matching :class:`GenericIdempotency` instance is looked up for
    the requesting user and endpoint.
    """

    key = request.headers.get("Idempotency-Key")
    if not key:
        return None
    from .models import GenericIdempotency

    return GenericIdempotency.objects.filter(
        key=key, user=request.user, endpoint=endpoint
    ).first()


def idem_remember(request, endpoint: str, obj):
    """Persist an idempotency record for ``obj`` if key header is present."""

    key = request.headers.get("Idempotency-Key")
    if not key:
        return
    from .models import GenericIdempotency

    GenericIdempotency.objects.get_or_create(
        key=key,
        user=request.user,
        endpoint=endpoint,
        defaults={"object_pk": str(getattr(obj, "pk", ""))},
    )


