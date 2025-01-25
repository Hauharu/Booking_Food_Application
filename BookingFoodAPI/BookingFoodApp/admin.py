from django.contrib import admin
from django.utils.safestring import mark_safe
from django.contrib.auth.models import Permission, Group
from django import forms
from .models import (Menu, Food, Store, User, Comment, Order, OrderDetail,
                     UserFollowedStore, Address, Category, Review)
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.utils.html import mark_safe
from . import cloud_path
from django.urls import path
from django.template.response import TemplateResponse
from django.db.models import Count
from ckeditor_uploader.widgets import CKEditorUploadingWidget

class FoodBookingAdminSite(admin.AdminSite):
    site_header = 'Quản lý đặt đồ ăn'

admin_site = FoodBookingAdminSite(name="FoodBooking")

from django.contrib import admin
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.utils.safestring import mark_safe


class UserForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget())

    class Meta:
        model = User
        fields = '__all__'


from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import User  # Make sure this points to your User model

from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import User, Store  # Import both User and Store models

class UserAdmin(admin.ModelAdmin):
    class Media:
        css = {
            'all': ('/static/css/style.css',)
        }

    list_display = [
        'username', 'user_role', 'pk', 'image', 'first_name', 'last_name',
        'email', 'phone', 'is_active', 'is_staff', 'is_superuser',
        'is_verified', 'date_joined'
    ]
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']
    list_filter = ['user_role', 'is_verified', 'is_active']
    readonly_fields = ['date_joined', 'last_login', 'username', 'password']

    def image(self, user):
        if user.avatar:
            return mark_safe(
                "<img src='{cloud_path}{image_name}' width='50' height='50' />".format(
                    cloud_path=cloud_path,  # Replace with your Cloudinary path if needed
                    image_name=user.avatar
                )
            )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    # def save_model(self, request, obj, form, change):
    #     # Check if 'is_verified' was modified
    #     if change and 'is_verified' in form.changed_data:
    #         if obj.is_verified:
    #             # Update the user_role to STORE
    #             obj.user_role = User.STORE
    #
    #             # Update the related Store's active field
    #             if hasattr(obj, 'store') and obj.store:
    #                 obj.store.active = True
    #                 obj.store.save()
    #         else:
    #             # Optionally revert the user_role and store active field if unverified
    #             obj.user_role = User.USER
    #
    #     super().save_model(request, obj, form, change)

class StoreAdmin(admin.ModelAdmin):
    list_display = ['name', 'pk' ,'avatar_display', 'user', 'rating', 'description', 'address_line', 'latitude', 'longitude', 'created_date', 'active']
    search_fields = ['name', 'address_line']
    list_filter = ['active']
    readonly_fields = ['created_date', 'rating', 'user']

    def avatar_display(self, store):
        if store.avatar:
            return mark_safe("<img src='{cloud_path}{image_name}' width='50' height='50' />".format(cloud_path=cloud_path, image_name=store.avatar))

    def save_model(self, request, obj, form, change):
        # Only update the user's verification and role if active is set to True
        if change:  # Ensures this is an update, not a new object creation
            original_obj = self.model.objects.get(pk=obj.pk)  # Get the original object from the database
            if obj.active and not original_obj.active:  # Check if active is being changed to True
                if not obj.user.is_verified:
                    obj.user.is_verified = True
                    obj.user.user_role = User.STORE
                    obj.user.save()
        super().save_model(request, obj, form, change)

class AddressShippingAdmin(admin.ModelAdmin):
    list_display = ['user', 'address_ship', 'latitude', 'longitude']
    search_fields = ['user', 'address_ship']
    list_filter = ['user']

class FoodAdmin(admin.ModelAdmin):
    list_display = ['name', 'pk', 'food_image','average_rating', 'store', 'price', 'status', 'start_time', 'end_time', 'menu', 'get_categories', 'created_date']
    search_fields = ['name', 'store', 'menu']
    list_filter = ['categories', 'average_rating']

    def food_image(self, food):
        if food.image:
            return mark_safe("<img src='{cloud_path}{image_name}' width='50' height='50' />".format(cloud_path=cloud_path, image_name=food.image))

    def get_categories(self, obj):
        return ", ".join([c.name for c in obj.categories.all()])

    get_categories.short_description = 'Categories'

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['code']

class OrderDetailInline(admin.TabularInline):
        model = OrderDetail
        extra = 1


class OrderAdmin(admin.ModelAdmin):
    list_display = ['user', 'total', 'delivery_fee', 'payment_status', 'order_status']
    list_filter = ['order_status', 'payment_status', 'user']
    search_fields = ['user__username', 'user__email']
    inlines = [OrderDetailInline]

    def get_order_details(self, obj):
        return "\n".join([f"{detail.food.name} ({detail.quantity} x {detail.unit_price})" for detail in obj.order_details.all()])

    get_order_details.short_description = 'Order Details'

class CommentForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget())

    class Meta:
        model = Comment
        fields = '__all__'

class CommentAdmin(admin.ModelAdmin):
    form = CommentForm
    list_display = ['pk', 'user', 'store', 'rate', 'content']

class ReviewForm(forms.ModelForm):
        review = forms.CharField(widget=CKEditorUploadingWidget())

        class Meta:
            model = Review
            fields = '__all__'

class ReviewAdmin(admin.ModelAdmin):
        form = ReviewForm
        list_display = ['pk', 'user', 'food', 'review', 'rating']


class MenuForm(forms.Form):
    description = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Menu
        field = '__all__'

class MenuAdmin(admin.ModelAdmin):
    forms = UserForm
    list_display = ["name", "pk",  'description', 'store']
    list_filter = ["store"]

class FollowAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'store', 'followed_at']


admin_site.register(User, UserAdmin)
admin_site.register(Store, StoreAdmin)
admin_site.register(Food, FoodAdmin)
admin_site.register(Category, CategoryAdmin)
admin_site.register(Address, AddressShippingAdmin)
admin_site.register(Order, OrderAdmin)
admin_site.register(Menu, MenuAdmin)
admin_site.register(Comment, CommentAdmin)
admin_site.register(Review, ReviewAdmin)
admin_site.register(UserFollowedStore, FollowAdmin)