"""
Authentication views for JWT token management and user registration.

This module provides views for user authentication, registration, logout,
and profile management using JWT tokens via djangorestframework-simplejwt.
"""

from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from accounts.models import CustomUser
from accounts.serializers import (
    RegisterUserSerializer,
    MyTokenObtainPairSerializer,
    CustomUserSerializer,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, BasePermission
from accounts.permissions import IsSystemAdminUser
from accounts.throttles import LoginRateThrottle


class MyTokenObtainPairView(TokenObtainPairView):
    """
    JWT token obtain view with custom serializer and rate limiting.

    Extends djangorestframework-simplejwt's TokenObtainPairView to include
    custom user data (username, role, store) in the token response and apply
    login rate throttling to prevent brute-force attacks.

    Attributes:
        permission_classes (list): Allows any user to attempt login.
        serializer_class (class): Custom serializer that adds user metadata.
        throttle_classes (list): Rate limiting for login attempts.

    Returns:
        Response: JWT access and refresh tokens plus user metadata (username, role, store).

    Example:
        POST /api/auth/login
        {
            "username": "advisor1",
            "password": "password123"
        }

        Response:
        {
            "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
            "username": "advisor1",
            "role": "advisor",
            "store": 1
        }
    """

    permission_classes = [AllowAny]
    serializer_class = MyTokenObtainPairSerializer
    throttle_classes = [LoginRateThrottle]


class RegisterUserView(CreateAPIView):
    """
    User registration endpoint restricted to system administrators.

    Creates new user accounts with role-based permissions. Only system admins
    can register new users to maintain security and control over user creation.

    Attributes:
        permission_classes (list): Requires system admin authentication.
        queryset (QuerySet): All CustomUser objects.
        serializer_class (class): RegisterUserSerializer for user creation.

    Returns:
        Response: Created user data with HTTP 201 status.

    Raises:
        PermissionDenied: If non-admin user attempts to register users.
        ValidationError: If user data fails validation (e.g., duplicate email).

    Example:
        POST /api/auth/register
        {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepass123",
            "role": "advisor",
            "phone": "1234567890",
            "store": 1
        }

        Response:
        {
            "id": 5,
            "username": "newuser",
            "email": "newuser@example.com",
            "role": "advisor",
            "store": 1
        }
    """

    permission_classes = [
        IsSystemAdminUser
    ]  # Only system admins can register new users
    queryset = CustomUser.objects.all()
    serializer_class = RegisterUserSerializer


class LogoutView(APIView):
    """
    Logout endpoint that blacklists JWT refresh tokens.

    Invalidates the provided refresh token by adding it to the blacklist,
    preventing further use for token refresh operations. Requires authentication.

    Attributes:
        permission_classes (list): Requires authenticated user.

    Args:
        request (Request): HTTP request containing refresh token in body.

    Returns:
        Response: Success message with HTTP 205 status on successful logout.

    Raises:
        HTTP 400: If refresh token is missing or blacklisting fails.

    Example:
        POST /api/auth/logout
        {
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
        }

        Response:
        {
            "detail": "Logout successful"
        }

    Note:
        Requires djangorestframework-simplejwt's token blacklist app to be
        installed and configured in INSTALLED_APPS.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Blacklist the provided refresh token.

        Args:
            request (Request): HTTP request with refresh token in body.

        Returns:
            Response: Success or error message with appropriate status code.
        """
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"detail": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": f"Logout failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class MeAPIView(RetrieveUpdateDestroyAPIView):
    """
    Current user profile endpoint with store geofence data.

    Provides GET, PATCH, and DELETE operations for the authenticated user's
    profile. The GET endpoint returns enhanced profile data including store
    geofences for Workledger attendance tracking.

    Attributes:
        queryset (QuerySet): All CustomUser objects.
        serializer_class (class): CustomUserSerializer for user data.
        permission_classes (list): Requires authenticated user.

    Returns:
        Response: User profile with store geofences and workledger settings.

    Example:
        GET /api/auth/me

        Response:
        {
            "id": 1,
            "name": "John Doe",
            "role": "advisor",
            "store_ids": [1],
            "workledger_enabled": true,
            "store_geofences": [
                {
                    "store_id": 1,
                    "lat": 12.34,
                    "lon": 56.78,
                    "radius_m": 100,
                    "is_active": true
                }
            ]
        }

    Note:
        The get() method overrides the default behavior to include store
        geofence data required by the Workledger mobile app for location-based
        attendance tracking.
    """

    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Return the current authenticated user.

        Returns:
            CustomUser: The user making the request.
        """
        return self.request.user

    def get(self, request, *args, **kwargs):
        """
        Return user profile with store geofences for Workledger.

        Retrieves the authenticated user's profile data along with associated
        store geofence information for location-based attendance tracking.

        Args:
            request (Request): HTTP request from authenticated user.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: User profile data including:
                - id: User ID
                - name: Full name or username
                - role: User role
                - store_ids: List of assigned store IDs
                - workledger_enabled: Feature flag for workledger access
                - store_geofences: List of geofence data for assigned stores

        Example:
            >>> response = client.get('/api/auth/me')
            >>> response.data['role']
            'advisor'
            >>> response.data['store_geofences'][0]['radius_m']
            100
        """
        user = request.user
        store_ids = []
        store_geofences = []

        store = getattr(user, "store", None)
        if store:
            store_ids.append(store.id)
            geofence = getattr(store, "geofence", None)
            if geofence:
                store_geofences.append(
                    {
                        "store_id": store.id,
                        "lat": float(geofence.latitude),
                        "lon": float(geofence.longitude),
                        "radius_m": geofence.radius_m,
                        "is_active": geofence.is_active,
                    }
                )

        data = {
            "id": user.id,
            "name": f"{user.first_name} {user.last_name}".strip() or user.username,
            "role": user.role,
            "store_ids": store_ids,
            "workledger_enabled": True,  # TODO: feature flag
            "store_geofences": store_geofences,
        }
        return Response(data)
