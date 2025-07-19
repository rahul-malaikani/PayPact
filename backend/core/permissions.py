from rest_framework.permissions import BasePermission
from .models import GroupMember

class IsMember(BasePermission):
    """
    Allows access only to users who are members of the group (by group_id).
    """
    def has_permission(self, request, view):
        group_id =( view.kwargs.get('group_id') or view.kwargs.get('pk')  or
    request.data.get('group'))
        if not group_id:
            return False
        return GroupMember.objects.filter(user=request.user, group__id=group_id).exists()
