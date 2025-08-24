from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q

from accounts.models import CustomUser
from accounts.serializers import CustomUserSerializer, RegisterUserSerializer
from accounts.permissions import IsSystemAdminUser


class AdminUserViewSet(viewsets.ModelViewSet):
    """System admin: Manage users"""

    queryset = CustomUser.objects.filter(deleted=False).select_related("store")
    permission_classes = [IsAuthenticated, IsSystemAdminUser]

    def get_serializer_class(self):
        return (
            RegisterUserSerializer if self.action == "create" else CustomUserSerializer
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(CustomUserSerializer(user).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
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
        # Mirror the same rules (self-disable & branch-head store assignment) for PATCH
        return self.update(request, *args, **kwargs)

    def get_queryset(self):
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
