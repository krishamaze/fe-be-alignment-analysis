from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from django.db.models import Q
from .models import Store
from .serializers import StoreSerializer
from .permissions import IsSystemAdminOrReadOnly
from accounts.models import CustomUser

class StoreViewSet(viewsets.ModelViewSet):
     # Hide soft-deleted by default
    queryset = Store.objects.filter(deleted=False)
    serializer_class = StoreSerializer
    permission_classes = [IsSystemAdminOrReadOnly]

    # Soft delete: mark deleted + deactivate, return 204 with no body
    def destroy(self, request, *args, **kwargs):
        store = self.get_object()
        store.deleted = True
        store.is_active = False
        store.save(update_fields=["deleted", "is_active"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Filters / search / ordering (safe)
    def get_queryset(self):
        qs = super().get_queryset()

        s = self.request.query_params.get("search")
        if s:
            qs = qs.filter(
                Q(store_name__icontains=s) |
                Q(code__icontains=s) |
                Q(address__icontains=s)
            ).distinct()

        is_active = self.request.query_params.get("is_active")
        if is_active and is_active.lower() in ("true", "false"):
            qs = qs.filter(is_active=(is_active.lower() == "true"))

        # Handle 'status' parameter (alias for is_active)
        status = self.request.query_params.get("status")
        if status and status.lower() in ("active", "inactive"):
            qs = qs.filter(is_active=(status.lower() == "active"))

        # Handle 'branch_head_status' parameter
        branch_head_status = self.request.query_params.get("branch_head_status")
        if branch_head_status and branch_head_status.lower() in ("assigned", "unassigned"):
            if branch_head_status.lower() == "assigned":
                qs = qs.filter(branch_head__isnull=False)
            else:
                qs = qs.filter(branch_head__isnull=True)

        id_in = self.request.query_params.get("id__in")
        if id_in:
            ids = [int(x) for x in id_in.split(",") if x.strip().isdigit()]
            if ids:
                qs = qs.filter(id__in=ids)

        allowed = {"store_name", "-store_name", "code", "-code", "id", "-id", "is_active", "-is_active"}
        ordering = self.request.query_params.get("ordering", "store_name")
        qs = qs.order_by(ordering if ordering in allowed else "store_name")
        return qs

    @action(detail=True, methods=['post'], url_path='assign-branch-head')
    def assign_branch_head(self, request, pk=None):
        """Assign a branch head to a store"""
        store = self.get_object()
        user_id = request.data.get('user_id')

        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                store = Store.objects.select_for_update().get(pk=store.pk)
                user = CustomUser.objects.select_for_update().get(
                    id=user_id, role='branch_head', is_active=True, deleted=False
                )

                if store.branch_head_id == user.id and user.store_id == store.id:
                    return Response(StoreSerializer(store).data, status=status.HTTP_200_OK)

                if user.store_id and user.store_id != store.id:
                    other = user.store.store_name if user.store else user.store_id
                    return Response(
                        {'error': f'User is already assigned to {other}'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if store.branch_head and store.branch_head_id != user.id:
                    current_head = CustomUser.objects.select_for_update().get(pk=store.branch_head_id)
                    current_head.store = None
                    current_head.save(update_fields=['store'])

                user.store = store
                user.save(update_fields=['store'])
                store.branch_head = user
                store.save(update_fields=['branch_head'])

            return Response(StoreSerializer(store).data, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({'error': 'Branch head not found or invalid'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='unassign-branch-head')
    def unassign_branch_head(self, request, pk=None):
        """Unassign branch head from a store"""
        store = self.get_object()

        with transaction.atomic():
            store = Store.objects.select_for_update().get(pk=store.pk)
            if not store.branch_head_id:
                return Response(StoreSerializer(store).data, status=status.HTTP_200_OK)

            user = CustomUser.objects.select_for_update().get(pk=store.branch_head_id)
            user.store = None
            user.save(update_fields=['store'])
            store.branch_head = None
            store.save(update_fields=['branch_head'])

        return Response(StoreSerializer(store).data, status=status.HTTP_200_OK)
