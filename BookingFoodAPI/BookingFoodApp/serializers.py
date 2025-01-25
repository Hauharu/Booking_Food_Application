from django.template.defaulttags import comment
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import User, Store, Menu, Category, Comment, Food, Order, OrderDetail, Address, UserFollowedStore, Review
from . import cloud_path

class UserDetailSerializer(ModelSerializer):
    image = serializers.SerializerMethodField(source='avatar')

    def get_image(self, user):
            if user.avatar:
                return '{cloud_path}{image_name}'.format(cloud_path=cloud_path, image_name=user.avatar)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'date_joined', 'last_login', 'image', 'phone']
        extra_kwargs = {
            'avatar': {'write_only': True},
            'password': {'write_only': True}
        }

class StoreSerializer(serializers.ModelSerializer):
    follower_number = serializers.SerializerMethodField()

    def get_follower_number(self, store):
        return UserFollowedStore.objects.filter(store=store).count()

    image = serializers.SerializerMethodField(source='avatar')

    def get_image(self, store):
            if store.avatar:
                return '{cloud_path}{image_name}'.format(cloud_path=cloud_path, image_name=store.avatar)

    # user = UserDetailSerializer()

    class Meta:
        model = Store
        fields = ['id', 'name', 'active', 'description', 'image', 'address_line', 'latitude', 'follower_number',
                 'longitude','user']

    # def update(self, instance, validated_data):
    #     request = self.context.get('request')
    #     if 'active' in validated_data and request.user.is_staff:
    #         instance.active = validated_data.pop('active')
    #         if instance.active:
    #             instance.user.is_store_owner = True
    #             instance.user.save()
    #     return super().update(instance, validated_data)

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['address_ship', 'latitude', 'longitude', 'user']

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollowedStore
        fields = ['id', 'user', 'store', 'followed_at']

class UserSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(source='avatar')

    def get_image(self, user):
            if user.avatar:
                return '{cloud_path}{image_name}'.format(cloud_path=cloud_path, image_name=user.avatar)

    def create(self, validated_data):
        data = validated_data.copy()
        user = User(**data)
        user.set_password(user.password)
        user.save()

        return user

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'date_joined', 'last_login', 'image', 'phone',
                  'user_role']
        extra_kwargs = {
            'avatar': {'write_only': True},
            'password': {'write_only': True}
        }

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['id', 'name', 'description', 'store']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class FoodSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True)
    image = serializers.SerializerMethodField()

    def get_image(self, food):
        if food.image:
            return '{cloud_path}{image_name}'.format(cloud_path=cloud_path, image_name=food.image)
        return None  # Return None if no image is available

    class Meta:
        model = Food
        fields = ['id', 'name', 'price', 'description', 'start_time', 'end_time', 'status',
                  'average_rating', 'image', 'store', 'menu', 'categories']


class FoodInCategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(source='avatar')

    def get_image(self, food):
            if food.image:
                return '{cloud_path}{image_name}'.format(cloud_path=cloud_path, image_name=food.image)
    class Meta:
        model = Food
        fields = ['id', 'name', 'image', 'price', 'average_rating', 'store', 'start_time', 'end_time', 'status']


# class SimpleUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email']

class CommentSerializer(serializers.ModelSerializer):
    # user = UserDetailSerializer()

    class Meta:
        model = Comment
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    # user = UserDetailSerializer()

    class Meta:
        model = Review
        fields = '__all__'

class FoodDetailSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True)
    image = serializers.SerializerMethodField()

    def get_image(self, food):
        if food.image:
            return '{cloud_path}{image_name}'.format(cloud_path=cloud_path, image_name=food.image)
        return None  # Return None if no image is available

    class Meta:
        model = Food
        fields = ['id', 'name', 'price',
                'image', 'store', 'menu', 'categories']

class OrderDetailSerializer(serializers.ModelSerializer):
    food = FoodDetailSerializer()
    class Meta:
        model = OrderDetail
        fields = ['food', 'unit_price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    details = serializers.SerializerMethodField()

    def get_details(self, order):
        order_details = order.order_details.all()
        return OrderDetailSerializer(order_details, many=True).data

    food_price = serializers.SerializerMethodField()

    def get_food_price(self, order):
        return order.total - order.delivery_fee

    user_name = serializers.SerializerMethodField()

    def get_user_name(self, order):
        name = order.user.first_name + ' ' + order.user.last_name
        if name == ' ':
            return order.user.username
        return name

    address = serializers.SerializerMethodField()

    def get_address(self, order):
        return order.address_ship.address_ship

    class Meta:
        model = Order
        fields = ['id', 'address', 'user', 'user_name', 'store', 'order_status',
                  'payment_status', 'total', 'delivery_fee', 'food_price', 'created_date'
                  , 'details']