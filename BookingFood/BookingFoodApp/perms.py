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

class IsOrderOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        try:
            has_store = request.user.store
        # neu user ko co store, suy ra, order khong thuoc ve store cua user
        except Store.DoesNotExist:
            # neu order cũng không phải của user thì:
            if obj.user != request.user:
                return False
            else:
                return True
        # user có store thi kiem tra order co thuoc store khong
        else:
            if request.user.store != obj.store:
                # neu ko thuộc store của user thì xem user này có phải người đặt hàng ko (kiểm tra order của user hay ko)
                if obj.user != request.user:
                    return False
                return True
            # nếu order thuoc store thi tra ra data
            else:
                return True

class IsReviewOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (
            obj.user == request.user
        )