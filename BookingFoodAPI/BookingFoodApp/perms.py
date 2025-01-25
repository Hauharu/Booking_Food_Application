from rest_framework import permissions
from .models import Store

class IsStoreOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Check if the user is staff and is verified (is_verified = True)
        return request.user.is_verified and obj.user == request.user

class IsCommentOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (
            obj.users == request.user
        )