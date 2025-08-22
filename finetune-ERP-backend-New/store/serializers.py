from rest_framework import serializers
from .models import Store
from accounts.models import CustomUser
class StoreSerializer(serializers.ModelSerializer):
    branch_head_name = serializers.SerializerMethodField()
    branch_head_email = serializers.SerializerMethodField()
    
    class Meta:
        model = Store
        fields = ['id', 'store_name', 'code', 'address', 'is_active',
                 'branch_head', 'branch_head_name', 'branch_head_email']
    
    def get_branch_head_name(self, obj):
        if obj.branch_head:
            return f"{obj.branch_head.first_name} {obj.branch_head.last_name}".strip()
        return None
    
    def get_branch_head_email(self, obj):
        return obj.branch_head.email if obj.branch_head else None
