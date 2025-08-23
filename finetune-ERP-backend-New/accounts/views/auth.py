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


class MyTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = MyTokenObtainPairSerializer


class RegisterUserView(CreateAPIView):
    permission_classes = [
        IsSystemAdminUser
    ]  # Only system admins can register new users
    queryset = CustomUser.objects.all()
    serializer_class = RegisterUserSerializer


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
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
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):  # noqa: D401 - DRF signature
        """Return minimal user profile plus store geofences for Workledger."""

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
