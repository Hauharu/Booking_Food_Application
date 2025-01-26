import calendar
from datetime import datetime
from collections import defaultdict
from .models import Menu, Food, Store, User, Comment, Order, OrderDetail, UserFollowedStore, Address, Category, Review
from . import cloud_path
from django.db.models import Count
from . import dao
from django.urls import path
from django.template.response import TemplateResponse
from django.contrib import admin
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.utils.safestring import mark_safe


# Lớp AdminSite tùy chỉnh để quản lý giao diện quản trị
class BookingFoodAdminSite(admin.AdminSite):
    site_header = 'Quản lý đặt đồ ăn'
    site_title = "BookingFood Admin"
    index_title = "Chào mừng đến với trang quản trị"

    # Định nghĩa các URL tùy chỉnh cho admin
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('stats/', self.stats_view),  # Thêm một view tùy chỉnh để hiển thị thống kê
        ]
        return custom_urls + urls

    # View để hiển thị thống kê về các đơn hàng của cửa hàng
    def stats_view(self, request):
        current_year = datetime.now().year  # Lấy năm hiện tại
        user_store = Store.objects.filter(user=request.user).first()  # Lấy cửa hàng của người dùng đang đăng nhập

        # Lấy tất cả các đơn hàng của cửa hàng
        all_orders = Order.objects.filter(store=user_store)

        # Tính toán dữ liệu cho biểu đồ hàng tháng
        monthly_data = [0] * 12
        for order in all_orders:
            month = order.order_date.month - 1
            year = order.order_date.year
            if year == current_year:
                monthly_data[month] += order.total

        monthly_labels = [calendar.month_name[i] for i in range(1, 13)]  # Lấy tên tháng

        # Tính toán dữ liệu cho biểu đồ hàng quý
        quarterly_data = [0] * 4
        for order in all_orders:
            quarter = (order.order_date.month - 1) // 3  # Xác định quý của đơn hàng
            year = order.order_date.year
            if year == current_year:
                quarterly_data[quarter] += order.total

        quarterly_labels = [f'Quý {i}' for i in range(1, 5)]  # Tạo nhãn cho các quý

        # Tính toán doanh thu hàng năm cho biểu đồ
        yearly_revenue = defaultdict(int)
        for order in all_orders:
            year = order.order_date.year
            yearly_revenue[year] += order.total

        yearly_labels = sorted(yearly_revenue.keys())  # Sắp xếp các năm
        yearly_data = [yearly_revenue[year] for year in yearly_labels]  # Lấy doanh thu cho từng năm

        # Lấy tổng số nhà hàng và người dùng
        total_store = dao.count_store()
        total_user = dao.count_user()

        # Thống kê món ăn của nhà hàng
        stats = Store.objects \
            .annotate(food_count=Count('food')) \
            .values('id', 'name', 'food_count')

        # Chuẩn bị dữ liệu gửi vào template để hiển thị
        context = {
            'total_user': total_user,
            'total_store': total_store,
            'store_stats': stats,
            'monthly_labels': monthly_labels,
            'monthly_data': monthly_data,
            'quarterly_labels': quarterly_labels,
            'quarterly_data': quarterly_data,
            'yearly_labels': yearly_labels,
            'yearly_data': yearly_data,
            'current_year': current_year,
        }
        return TemplateResponse(request, 'admin/stats.html', context)


# Đăng ký AdminSite tùy chỉnh
admin_site = BookingFoodAdminSite(name="BookingFood")


# # Form để tùy chỉnh mô hình User trong giao diện quản trị
# class UserForm(forms.ModelForm):
#     description = forms.CharField(widget=CKEditorUploadingWidget())
#
#     class Meta:
#         model = User
#         fields = '__all__'


# Cấu hình cho mô hình User
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'user_role', 'image', 'email', 'phone', 'is_verified', 'date_joined', 'is_active']
    search_fields = ['username', 'email', 'phone']
    list_filter = ['user_role', 'is_verified', 'is_active']
    readonly_fields = ['date_joined', 'last_login']
    # form = UserForm

    def image(self, user):
        # Hiển thị ảnh đại diện của người dùng dưới dạng hình ảnh trong admin panel
        if user.avatar:
            return mark_safe(
                "<img src='{cloud_path}{image_name}' width='50' height='50' />".format(cloud_path=cloud_path,
                                                                                       image_name=user.avatar))


# Form để tùy chỉnh mô hình Store trong giao diện quản trị
class StoreandMenuForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget())

    class Meta:
        model = Store
        fields = '__all__'

# Cấu hình cho mô hình Store
class StoreAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'image_display', 'rating', 'description', 'address_line', 'created_date', 'active']
    search_fields = ['name', 'address_line']
    list_filter = ['active']
    form = StoreandMenuForm

    def image_display(self, store):
        # Hiển thị ảnh đại diện của cửa hàng dưới dạng hình ảnh trong admin panel
        if store.image:
            return mark_safe(
                "<img src='{cloud_path}{image_name}' width='50' height='50' />".format(cloud_path=cloud_path,
                                                                                       image_name=store.image))

    def save_model(self, request, obj, form, change):
        if change:
            original_obj = self.model.objects.get(id=obj.id)
            if obj.active and not original_obj.active:
                if not obj.user.is_verified:
                    obj.user.is_verified = True
                    obj.user.user_role = User.STORE
                    obj.user.save()
        super().save_model(request, obj, form, change)


# Cấu hình cho mô hình Address
class AddressShippingAdmin(admin.ModelAdmin):
    list_display = ['user', 'address_ship', 'latitude', 'longitude']  # Các cột hiển thị
    search_fields = ['user', 'address_ship']
    list_filter = ['user']


# Form để tùy chỉnh mô hình Food trong giao diện quản trị
class FoodForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Food
        fields = '__all__'


class FoodAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'food_image', 'average_rating', 'store', 'price', 'status', 'start_time', 'end_time',
                    'menu', 'get_categories', 'created_date']
    search_fields = ['name', 'store__name', 'menu__name']
    list_filter = ['categories', 'average_rating', 'store__name']
    readonly_fields = ['food_image']
    form = FoodForm

    def food_image(self, food):
        # Hiển thị hình ảnh món ăn trong admin panel
        if food:
            return mark_safe(
                "<img src='{cloud_path}{image_name}' width='50' height='50' />".format(cloud_path=cloud_path,
                                                                                       image_name=food.image))

    def get_categories(self, obj):
        # Lấy các thể loại của món ăn và hiển thị dưới dạng chuỗi
        return ", ".join([c.name for c in obj.categories.all()])

    get_categories.short_description = 'Categories'  # Tên cột hiển thị


# Cấu hình cho mô hình Category
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


# Cấu hình form cho mô hình Order
class OrderDetailInline(admin.TabularInline):
    model = OrderDetail
    extra = 1


# Cấu hình cho mô hình Order
class OrderAdmin(admin.ModelAdmin):
    list_display = ['user', 'total', 'delivery_fee', 'payment_status', 'order_status']  # Các cột hiển thị
    list_filter = ['order_status', 'payment_status', 'user']
    search_fields = ['user__username', 'user__email']
    inlines = [OrderDetailInline]

    def get_order_details(self, obj):
        # Hiển thị chi tiết đơn hàng dưới dạng chuỗi
        return "\n".join(
            [f"{detail.food.name} ({detail.quantity} x {detail.unit_price})" for detail in obj.order_details.all()])

    get_order_details.short_description = 'Order Details'


# Form để tùy chỉnh mô hình Comment trong giao diện quản trị
class CommentForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget())

    class Meta:
        model = Comment
        fields = '__all__'


# Cấu hình cho mô hình Comment
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'store', 'rate', 'content']
    form = CommentForm


# Form để tùy chỉnh mô hình Review trong giao diện quản trị
class ReviewForm(forms.ModelForm):
    review = forms.CharField(widget=CKEditorUploadingWidget())

    class Meta:
        model = Review
        fields = '__all__'


# Cấu hình cho mô hình Review
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'food', 'review', 'rating']


form = ReviewForm


# Form để tùy chỉnh mô hình Menu trong giao diện quản trị
class MenuForm(forms.Form):
    description = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Menu
        field = '__all__'


# Cấu hình form cho mô hình Menu
class MenuAdmin(admin.ModelAdmin):
    list_display = ["name", 'description', 'store']
    list_filter = ["store"]
    forms = StoreandMenuForm


# Cấu hình Admin cho mô hình Follow
class FollowAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'store', 'followed_at']


# Đăng ký các mô hình với AdminSite tùy chỉnh
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
