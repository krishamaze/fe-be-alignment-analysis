"""Utility functions for the attendance module.

This module provides a collection of helper functions that support various
features within the attendance system. These utilities include:
- **Geospatial Calculations**: Functions for calculating the distance between
  two geographical points (`haversine_km`) and checking if a point is within
  a specified geofence (`within_radius_m`).
- **Idempotency Handling**: Helpers (`idem_get`, `idem_remember`) to support
  idempotent API requests, preventing duplicate operations for critical actions
  like check-in and check-out by using the `Idempotency-Key` header.
"""

import math
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:  # pragma: no cover - avoid circular import at runtime
    from store.models import StoreGeofence


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates the distance between two points on Earth using the Haversine formula.

    This function computes the great-circle distance, which is the shortest
    distance over the Earth's surface, giving an 'as-the-crow-flies' distance.

    Args:
        lat1 (float): Latitude of the first point in decimal degrees.
        lon1 (float): Longitude of the first point in decimal degrees.
        lat2 (float): Latitude of the second point in decimal degrees.
        lon2 (float): Longitude of the second point in decimal degrees.

    Returns:
        float: The distance between the two points in kilometers.

    Example:
        >>> # Distance between two points in London
        >>> lat1, lon1 = 51.5072, -0.1276
        >>> # Distance to a point approx 0.88km away
        >>> lat2, lon2 = 51.51, -0.14
        >>> round(haversine_km(lat1, lon1, lat2, lon2), 2)
        0.88
    """
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


def within_radius_m(
    lat: float, lon: float, geofence: Optional["StoreGeofence"]
) -> bool:
    """Checks if a geographical point is within a store's geofence radius.

    This function uses the `haversine_km` calculation to determine the distance
    between a given latitude/longitude pair and the center of the geofence.
    It then compares this distance (in meters) to the geofence's specified
    radius.

    If the `geofence` object is `None` or marked as inactive, the check
    automatically fails, and the function returns `False`.

    Args:
        lat (float): The latitude of the point to check.
        lon (float): The longitude of the point to check.
        geofence (Optional["StoreGeofence"]): The geofence object to check
            against. It should have `latitude`, `longitude`, `radius_m`, and
            `is_active` attributes.

    Returns:
        bool: `True` if the point is within the geofence radius, `False`
        otherwise.

    Example:
        >>> from collections import namedtuple
        >>> Geofence = namedtuple("Geofence", ["latitude", "longitude", "radius_m", "is_active"])
        >>> # Geofence centered in a city, with a 500m radius
        >>> fence = Geofence(latitude=51.50, longitude=-0.12, radius_m=500, is_active=True)
        >>> # A point within the radius (approx 88m away)
        >>> within_radius_m(51.5008, -0.12, fence)
        True
        >>> # A point outside the radius (approx 880m away)
        >>> within_radius_m(51.508, -0.12, fence)
        False
        >>> # Check with an inactive geofence
        >>> inactive_fence = Geofence(latitude=51.50, longitude=-0.12, radius_m=500, is_active=False)
        >>> within_radius_m(51.5008, -0.12, inactive_fence)
        False
    """
    if not geofence or not geofence.is_active:
        return False

    distance_m = (
        haversine_km(
            lat,
            lon,
            float(geofence.latitude),
            float(geofence.longitude),
        )
        * 1000
    )

    return distance_m <= geofence.radius_m


def idem_get(request, endpoint: str):
    """Retrieves a previously stored idempotent record for a given request.

    This function checks for an `Idempotency-Key` in the request headers. If
    the key is present, it queries the `GenericIdempotency` model to find a
    matching record for the current user and the specified endpoint. This is
    the first step in an idempotent request handling process.

    Args:
        request: The Django request object, used to access headers and the user.
        endpoint (str): A unique name for the endpoint being protected
            (e.g., 'v1:check-in').

    Returns:
        Optional[GenericIdempotency]: The matching `GenericIdempotency` instance
        if found, otherwise `None`.
    """
    key = request.headers.get("Idempotency-Key")
    if not key:
        return None
    from .models import GenericIdempotency

    return GenericIdempotency.objects.filter(
        key=key, user=request.user, endpoint=endpoint
    ).first()


def idem_remember(request, endpoint: str, obj):
    """Stores an idempotency record for a newly created or updated object.

    After a write operation has successfully completed, this function should be
    called. It checks for an `Idempotency-Key` in the request headers. If the
    key exists, it creates a `GenericIdempotency` record, mapping the key,
    user, and endpoint to the primary key of the object that was just handled.
    This "remembers" the result of the operation, allowing `idem_get` to
    retrieve it on subsequent, identical requests.

    Args:
        request: The Django request object.
        endpoint (str): The unique name for the endpoint.
        obj: The model instance that was created or updated. Its primary key
            will be stored.
    """
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