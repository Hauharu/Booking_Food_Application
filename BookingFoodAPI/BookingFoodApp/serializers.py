from django.template.defaulttags import comment
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import User, Store, Menu, Category, Comment, Food, Order, OrderDetail, Address, UserFollowedStore, Review
from . import cloud_path


# Serializer quản lý dữ liệu cửa hàng
class StoreSerializer(serializers.ModelSerializer):
    follower_number = serializers.SerializerMethodField()

    def get_follower_number(self, store):
        # Đếm số lượng người dùng theo dõi cửa hàng
        return UserFollowedStore.objects.filter(store=store).count()

    image = serializers.SerializerMethodField(source='avatar')

    def get_image(self, store):
        # Trả về URL hình ảnh đại diện của cửa hàng nếu tồn tại
        if store.avatar:
            return '{cloud_path}{image_name}'.format(cloud_path=cloud_path, image_name=store.avatar)

    class Meta:
        model = Store  # Gắn serializer với model Store
        fields = ['id', 'name', 'active', 'description', 'image', 'address_line',
                  'follower_number', 'user']

    # Serializer quản lý địa chỉ giao hàng


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['address_ship', 'latitude', 'longitude', 'user']


# Serializer quản lý thông tin theo dõi cửa hàng
class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollowedStore
        fields = ['id', 'user', 'store', 'followed_at']

    # Serializer quản lý thông tin người dùng


class UserSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(source='avatar')

    def get_image(self, user):
        # Trả về URL ảnh đại diện của người dùng nếu tồn tại
        if user.avatar:
            return '{cloud_path}{image_name}'.format(cloud_path=cloud_path, image_name=user.avatar)

    def create(self, validated_data):
        # Tạo người dùng mới từ dữ liệu đã validate
        data = validated_data.copy()
        user = User(**data)
        user.set_password(user.password)
        user.save()
        return user

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'date_joined', 'last_login', 'image', 'phone', 'user_role']
        extra_kwargs = {
            'avatar': {'write_only': True},
            'password': {'write_only': True}
        }


# Serializer quản lý thực đơn
class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['id', 'name', 'description', 'store']

    # Serializer quản lý danh mục món ăn


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

    # Serializer quản lý món ăn


class FoodSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True)
    image = serializers.SerializerMethodField()

    def get_image(self, food):
        # Trả về URL ảnh món ăn nếu tồn tại
        if food.image:
            return '{cloud_path}{image_name}'.format(cloud_path=cloud_path, image_name=food.image)
        return None

    class Meta:
        model = Food
        fields = ['id', 'name', 'price', 'description', 'start_time', 'end_time', 'status',
                  'average_rating', 'image', 'store', 'menu', 'categories']


# Serializer quản lý món ăn trong danh mục
class FoodInCategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(source='avatar')

    def get_image(self, food):
        # Trả về URL ảnh món ăn nếu tồn tại
        if food.image:
            return '{cloud_path}{image_name}'.format(cloud_path=cloud_path, image_name=food.image)

    class Meta:
        model = Food
        fields = ['id', 'name', 'image', 'price', 'average_rating', 'store', 'start_time', 'end_time', 'status']


# Serializer quản lý bình luận
class CommentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, comment):
        # Lấy tên người dùng từ user của comment
        return comment.user.username

    class Meta:
        model = Comment
        fields = ['id', 'content', 'rate', 'name', 'store']
    # Serializer quản lý đánh giá món ăn


class ReviewSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, review):
        # Lấy tên người dùng từ user của review
        return review.user.username

    class Meta:
        model = Review
        fields = ['id', 'review', 'rating', 'name', 'food']

    # Serializer quản lý chi tiết đơn hàng


class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetail
        fields = ['food', 'unit_price', 'quantity']

    # Serializer quản lý đơn hàng


class OrderSerializer(serializers.ModelSerializer):
    details = serializers.SerializerMethodField()

    def get_details(self, order):
        # Lấy danh sách chi tiết đơn hàng
        order_details = order.order_details.all()
        return OrderDetailSerializer(order_details, many=True).data

    food_price = serializers.SerializerMethodField()

    def get_food_price(self, order):
        # Tính giá món ăn bằng cách trừ phí giao hàng từ tổng giá
        return order.total - order.delivery_fee

    user_name = serializers.SerializerMethodField()

    def get_user_name(self, order):
        # Lấy tên đầy đủ của người dùng, nếu không có thì lấy username
        name = order.user.first_name + ' ' + order.user.last_name
        if name == ' ':
            return order.user.username
        return name

    address = serializers.SerializerMethodField()  # Trường tùy chỉnh để lấy địa chỉ giao hàng

    def get_address(self, order):
        # Lấy địa chỉ giao hàng từ order
        return order.address_ship.address_ship

    class Meta:
        model = Order  # Gắn serializer với model Order
        fields = ['id', 'address', 'user', 'user_name', 'store', 'order_status',
                  'payment_status', 'total', 'delivery_fee', 'food_price', 'created_date', 'details']
