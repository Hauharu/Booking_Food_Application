from cloudinary.cache.responsive_breakpoints_cache import instance
from django.db.models.functions import TruncQuarter, ExtractMonth, ExtractYear, TruncYear, ExtractQuarter
from django.forms import DecimalField
from django.shortcuts import render
from django.http import HttpResponse
from django.utils.dateparse import parse_time
from django.views.decorators.csrf import csrf_exempt
from datetime import time, datetime
from pytz import timezone
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from . import paginators, utils
from rest_framework import viewsets, permissions, generics, parsers, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action, permission_classes
from rest_framework.views import Response, APIView
from .models import *
from .perms import *
from .serializers import (UserSerializer, StoreSerializer, MenuSerializer, CategorySerializer,
                          CommentSerializer, FoodInCategorySerializer, OrderSerializer, FoodSerializer,
                          AddressSerializer, ReviewSerializer, UserFollowedStoreSerializer, CartSerializer,
                          YearlyRevenueSerializer, MonthlyRevenueSerializer, QuarterlyRevenueSerializer)

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q, Count, FloatField
from .models import Food
from .serializers import FoodSerializer


# API tìm kiếm đồ ăn
class FoodSearchView(APIView):
    def get(self, request):
        # # Retrieve form-data
        # query = request.data.get('q', '')  # Search term
        # category = request.data.get('category', None)  # Category ID
        # store = request.data.get('store', None)  # Store ID
        # min_price = request.data.get('min_price', None)  # Minimum price
        # max_price = request.data.get('max_price', None)
        #
        # # Base query
        # foods = Food.objects.all()
        #
        # # Filter by query if provided
        # if query:
        #     foods = foods.filter(name__icontains=query)
        #
        # # Filter by category if provided
        # if category:
        #     foods = foods.filter(categories__id=category)
        #
        # # Filter by store if provided
        # if store:
        #     foods = foods.filter(store_id=store)
        #
        # # Filter by min_price if provided
        # if min_price:
        #     foods = foods.filter(price__gte=min_price)
        #
        # # Filter by max_price if provided
        # if max_price:
        #     foods = foods.filter(price__lte=max_price)
        #
        # # Serialize the data
        # serializer = FoodSerializer(foods, many=True)
        # return Response(serializer.data)

        query = request.query_params.get('q', '')  # Search term
        category = request.query_params.get('category', None)  # Category ID
        store = request.query_params.get('store', None)  # Store ID
        min_price = request.query_params.get('min_price', None)  # Minimum price
        max_price = request.query_params.get('max_price', None)
        max_rating = request.query_params.get('max_rating', None)

        # Base query
        foods = Food.objects.all()

        # Lọc theo tên
        if query:
            foods = foods.filter(name__icontains=query)

        # Lọc theo danh mục
        if category:
            foods = foods.filter(categories__id=category)

        # Lọc theo cửa hàng
        if store:
            foods = foods.filter(store_id=store)

        # Lọc trong khoảng giá xác định
        if min_price:
            foods = foods.filter(price__gte=min_price)

        if max_price:
            foods = foods.filter(price__lte=max_price)

        # Lọc theo đánh giá (Less than equal)
        if max_rating:
            foods = foods.filter(average_rating__lte=max_rating)

        # Serialize the data
        serializer = FoodSerializer(foods, many=True)
        return Response(serializer.data)


# Viewset cửa hàng
class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_queryset(self):
        queryset = self.queryset
        q = self.request.query_params.get('q')
        if q:
            queryset = Store.objects.filter(active=True).filter(name__icontains=q)
        if (self.action == 'list' and not q) or self.action in ['follow', 'comment']:
            queryset = Store.objects.filter(active=True)

        return queryset

    def get_permissions(self):
        if self.action in ['list', 'manage_food'] or (self.action == 'comment' and self.request.method == 'GET'):
            return [permissions.AllowAny(), ]
        if self.action == 'retrieve':
            id = self.kwargs.get('pk')  # self.kwargs.get('pk') trả về 1 str
            instance = Store.objects.get(pk=id)
            if instance.active == True:
                return [permissions.AllowAny()]
            else:
                return [IsStoreOwner()]
        if self.action in ['follow'] or (self.action == 'comment' and self.request.method == 'POST'):
            return [permissions.IsAuthenticated()]
        return [IsStoreOwner(), permissions.IsAuthenticated()]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.active = False
        instance.save()
        return Response(data='Cửa hàng đã ngừng hoạt động', status=status.HTTP_204_NO_CONTENT)

    def create(self, request, *args, **kwargs):
        data = request.data
        store = Store.objects.create(name=data['name'], description=data['description'],
                                     address_line=data['address_line'], user=request.user, latitude=data['latitude'],
                                     longitude=data['longitude'],
                                     image=data['image'])

        return Response(data=StoreSerializer(store).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        store = self.get_object()  # Get the Store instance
        data = request.data  # Get the data to update

        # Check if the user is the store owner
        if request.user != store.user:
            return Response(data='Không thể sửa cửa hàng của người khác!', status=status.HTTP_400_BAD_REQUEST)

        for field, value in data.items():
            setattr(store, field, value)  # Update the fields

        store.save()  # Save the updated instance

        return Response(StoreSerializer(store).data, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=True, url_path='menus', url_name='menus')
    def list_Menu_of_TaiKhoan(self, request, *args, **kwargs):
        store_id = kwargs.get('pk')
        try:
            store_id = Store.objects.get(pk=store_id)
            menus = Menu.objects.filter(store=store_id)
            serializer = MenuSerializer(menus, many=True)
            return Response(serializer.data)
        except Store.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    # @action(methods=['get'], url_path='foods', detail=True)
    # def get_food(self, request, pk):
    #     instance = self.get_object()
    #     food = None
    #     if instance.user == request.user:
    #         food = instance.food
    #     else:
    #         food = instance.food.filter(active=True)
    #     return Response(data=FoodSerializer(food, many=True).data, status=status.HTTP_200_OK)

    # @action(methods=['patch'], url_path='update', detail=True)
    # def patch_store(self, request, pk=None):
    #     store = self.get_object()  # Get the Store instance
    #     data = request.data  # Get the data to update
    #     if request.user != self.get_object().user:
    #         return Response(data='Không thể sửa cửa hàng của người khác!',
    #                         status=status.HTTP_400_BAD_REQUEST
    #         )
    #
    #     for field, value in data.items():
    #         setattr(store, field, value)  # Update the fields
    #
    #     # Save the updated instance
    #     store.save()
    #
    #     return Response(StoreSerializer(store).data, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=True, url_path='foods', url_name='foods')
    def get_foods(self, request, pk=None):
        store = self.get_object()  # Get the Store instance
        foods = store.foods.all()  # Assuming there's a related field `foods` in Store
        serializer = FoodSerializer(foods, many=True)  # You will need a `FoodSerializer`
        return Response(serializer.data)

    @action(methods=['post'], url_path='follow', detail=True)
    def follow(self, request, pk):
        if request.user == self.get_object().user:
            return Response(data='Không thể follow cửa hàng của mình',
                            status=status.HTTP_400_BAD_REQUEST
                            )

        follow, created = UserFollowedStore.objects.get_or_create(store=self.get_object(), user=request.user)

        if not created:  # created does not exist (tức là đã follow rồi)
            follow.delete()
            return Response(data='Đã hủy theo dõi!', status=status.HTTP_204_NO_CONTENT)

        return Response(UserFollowedStoreSerializer(follow).data, status=status.HTTP_201_CREATED)

    @action(methods=['post', 'get'], url_path='comment', detail=True)
    def comment(self, request, pk):
        store = self.get_object()  # Get the Store instance
        user = request.user  # Get the current user

        data = request.data
        if request.method == 'POST':
            if store.user == user:
                return Response(data="Bạn không thể bình luận trên chính cửa hàng bạn được",
                                status=status.HTTP_400_BAD_REQUEST)
            # Create a new comment
            c = store.comments.create(user=user, rate=data['rate'], content=data['content'])
            return Response(CommentSerializer(c).data, status=status.HTTP_201_CREATED)

        if request.method == 'GET':
            # Get all comments for the store
            return Response(data=CommentSerializer(store.comments, many=True).data, status=status.HTTP_200_OK)


# Viewset Người dùng
class UserViewSet(viewsets.ViewSet):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny(), ]
        else:
            return [permissions.IsAuthenticated()]

    def create(self, request):
        instance = request.data
        user = User.objects.create_user(username=instance['username'], password=instance['password'],
                                        first_name=instance['first_name'], last_name=instance['last_name'],
                                        phone=instance['phone'], email=instance['email'],
                                        avatar='image/upload/v1737977610/boy_zeye0i')

        return Response(data=UserSerializer(user).data, status=status.HTTP_201_CREATED)

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        data = request.data
        if request.method.__eq__('PATCH'):
            # gán các trường bằng giá trị trong request.data
            for field, value in data.items():
                # set attribute
                setattr(user, field, value)

                # goi phuong thuc update de password dc ma hoa và lưu lại
            UserSerializer().update(instance=user, validated_data=request.data)
        return Response(UserSerializer(user).data)

    @action(methods=['post', 'get', 'patch'], url_path='current-user/address', detail=False)
    def add_get_address(self, request):
        user = request.user
        data = request.data
        if request.method.__eq__('POST'):
            address = Address.objects.create(address_ship=data['address_ship'], latitude=data['latitude'],
                                             longitude=data['longitude'], user=user)
            return Response(AddressSerializer(address).data, status=status.HTTP_201_CREATED)

        # Handle PATCH (update an existing address)
        if request.method == 'PATCH':
            # Assuming that you're passing the address ID in the data (e.g., data['address_id'])
            address_id = data.get('address_id')
            address = Address.objects.filter(id=address_id, user=user).first()

            if not address:
                return Response({'detail': 'Address not found.'}, status=status.HTTP_404_NOT_FOUND)

            # Update fields that are provided in the PATCH request
            if 'address_ship' in data:
                address.address_ship = data['address_ship']
            if 'latitude' in data:
                address.latitude = data['latitude']
            if 'longitude' in data:
                address.longitude = data['longitude']

            address.save()  # Save the updated address

            return Response(AddressSerializer(address).data, status=status.HTTP_200_OK)

        if request.method.__eq__('GET'):
            return Response(AddressSerializer(user.addresses, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='current-user/followed-store', detail=False)
    def get_followed_store(self, request):
        user = request.user
        return Response(UserFollowedStoreSerializer(user.subscriptions, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='current-user/my-order', detail=False)
    def get_order(self, request):
        return Response(OrderSerializer(request.user.orders, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='current-user/reviews', detail=False)
    def get_reviews_and_comments(self, request):
        user = request.user

        # Assuming user has related reviews and comments, you can modify the queries as needed
        reviews = Review.objects.filter(user=user)  # Get all reviews by the logged-in user
        comments = Comment.objects.filter(user=user)  # Get all comments by the logged-in user

        # Serialize the reviews and comments
        review_data = ReviewSerializer(reviews, many=True).data
        comment_data = CommentSerializer(comments, many=True).data

        # Return the data in the response
        return Response({
            'reviews': review_data,
            'comments': comment_data
        }, status=status.HTTP_200_OK)


# Viewset danh mục
class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

    @action(methods=['get'], url_path='food', detail=True)
    def get_food(self, request, pk):
        cate = self.get_object()
        foods = cate.food.filter(active=True).prefetch_related('categories')

        paginator = paginators.FoodPaginator()
        page = paginator.paginate_queryset(foods, request)
        if page is not None:
            serializer = FoodInCategorySerializer(page, many=True)
            return paginator.get_paginated_response(data=serializer.data)
        # neu page = None thì trả hết food ra
        return Response(data=FoodInCategorySerializer(foods, many=True).data, status=status.HTTP_200_OK)


# Viewset comment cửa hàng
class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsCommentOwner]
    queryset = Comment.objects.all()
    parser_classes = [parsers.MultiPartParser]
    serializer_class = CommentSerializer


# Viewset Đồ ăn
class FoodViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.DestroyAPIView, generics.ListAPIView,
                  generics.RetrieveAPIView):
    queryset = Food.objects.filter(active=True)
    serializer_class = FoodSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'get_review']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = self.queryset
        user = self.request.user  # Get the authenticated user
        queryset = queryset.filter(store__user=user)

        # Apply other filters if provided
        q = self.request.query_params.get('q')  # Search query
        category_id = self.request.query_params.get('category_id')  # Category filter

        if q:
            queryset = queryset.filter(name__icontains=q)  # Filter by food name (search query)
        if category_id:
            queryset = queryset.filter(categories__id=category_id)  # Filter by category

        return queryset

    def create(self, request, *args, **kwargs):
        # Get the logged-in user
        user = request.user

        # Check if the user has the role 'STORE' and if the user is active and verified
        if user.user_role != User.STORE or not user.is_active or user.is_superuser or user.is_staff:
            return Response(
                {"message": "Bạn không có quyền thực hiện chức năng này!"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if the user is verified
        if not user.is_verified:
            return Response(
                {
                    "message": f"Tài khoản cửa hàng {user.username} chưa được chứng thực để thực hiện chức năng thêm đồ ăn!"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Retrieve required fields from the request data
        name = request.data.get('name')
        price = request.data.get('price')
        description = request.data.get('description')
        image = request.data.get('image')  # Assuming image is passed as a file
        categories = request.data.get('categories')  # A list of category IDs

        # Check if required fields are provided
        if not all([name, price, description, image]):
            return Response(
                {"message": "Vui lòng cung cấp đầy đủ thông tin đồ ăn: tên, giá, mô tả và hình ảnh!"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Create the food item and associate it with the logged-in user's store
            food = Food.objects.create(
                name=name, price=price,
                description=description,
                image=image,
                store=user.store,
            )

            # Add categories if provided
            if categories and isinstance(categories, list):  # Ensure categories is a list
                food.categories.set(
                    Category.objects.filter(id__in=categories))  # Use set() to associate multiple categories

            # Return success response with created food data
            return Response(
                {"message": f"Đã thêm món ăn thành công cho cửa hàng {user.store.name}!",
                 "data": FoodSerializer(food).data},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"message": f"Không thể thêm đồ ăn: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def partial_update(self, request, pk):
        food = self.get_object()
        user = request.user
        if food.store.user != user:
            return Response(data='Bạn không thể sửa đồ ăn cửa hàng khác!', status=status.HTTP_403_FORBIDDEN)

        # Allowed fields
        allowed_fields = {'name', 'image', 'description', 'price', 'categories'}
        data = {key: value for key, value in request.data.items() if key in allowed_fields}

        if data.get('categories'):
            # Ensure categories is a list
            category_ids = data.get('categories')
            if isinstance(category_ids, list):
                categories = Category.objects.filter(id__in=category_ids)
                data['categories'] = categories

        for key, value in data.items():
            if key == 'categories':
                food.categories.set(data['categories'])  # Use set() to update the categories
            else:
                setattr(food, key, value)

        food.save()

        return Response(data=FoodSerializer(food).data, status=status.HTTP_200_OK)

    @action(methods=['patch'], url_path='update-food-status', detail=True)
    def update_food_status(self, request, pk=None):
        """
        Update the status of a food item and optionally set start and end times.
        """
        food = self.get_object()  # Get the food object directly using its detail endpoint (pk)
        new_status = request.data.get('status')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')

        if new_status not in dict(Food.STATUS_CHOICES):
            return Response(
                {"error": f"Status must be one of: {list(dict(Food.STATUS_CHOICES).keys())}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if food.store.user != request.user:
            return Response(
                {"error": "Bạn không có quyền chỉnh sửa trạng thái đồ ăn này."},
                status=status.HTTP_403_FORBIDDEN
            )

        if start_time:
            try:
                food.start_time = parse_time(start_time)
            except ValueError:
                return Response(
                    {"error": "Format thời gian sai. Format là HH:MM:SS."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if end_time:
            try:
                food.end_time = parse_time(end_time)
            except ValueError:
                return Response(
                    {"error": "Format thời gian sai. Format là HH:MM:SS."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        food.status = new_status
        food.save()

        return Response(
            {"message": "Cập nhật trạng thái đồ ăn thành công.", "data": FoodSerializer(food).data},
            status=status.HTTP_200_OK
        )

    @action(methods=['get'], url_path='review', detail=True)
    def review(self, request, pk):
        food = self.get_object()  # Get the Store instance
        user = request.user  # Get the current user
        return Response(data=ReviewSerializer(food.review, many=True).data, status=status.HTTP_200_OK)

    # @action(methods=['patch'], url_path='add-to-menu', detail=True)
    # def add_to_menu(self, request, pk=None):
    #     """
    #     Add food to a menu.
    #     """
    #     food = self.get_object()
    #     user = request.user
    #
    #     # Ensure the user is the store owner for the food
    #     if food.store.user != user:
    #         return Response(
    #             {"error": "You are not authorized to update this food item."},
    #             status=status.HTTP_403_FORBIDDEN
    #         )
    #
    #     # Get data from request
    #     menu = request.data.get('menu')
    #     # Validate menu and check ownership
    #     try:
    #         menu = Menu.objects.get(id=menu, store__user=user)
    #     except Menu.DoesNotExist:
    #         return Response(
    #             {"error": "Menu không tìm thấy hoặc không thuộc quyền sở hữu của bạn"},
    #             status=status.HTTP_404_NOT_FOUND
    #         )
    #
    #     # Update food item
    #     food.menu = menu
    #     food.save()
    #
    #     return Response(
    #         {"message": "Food item updated successfully.", "data": FoodSerializer(food).data},
    #         status=status.HTTP_200_OK
    #     )
    #


# Viewset Menu
class MenuViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.DestroyAPIView, generics.RetrieveAPIView):
    serializer_class = MenuSerializer

    def get_queryset(self):
        user = self.request.user

        # Ensure the user is authenticated and has the 'STORE' role
        if user.is_verified and user.user_role == User.STORE:
            # Filter menus that belong to the user's store
            menu_queryset = Menu.objects.filter(store=user.store)

            # Apply keyword search if provided
            kw = self.request.query_params.get('kw')
            if kw:
                menu_queryset = menu_queryset.filter(name__icontains=kw)

            return menu_queryset

        # If the user is not authenticated or not a store owner, return an empty queryset
        return Menu.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'delete', 'destroy', 'set_status_menu', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def list(self, request):
        user = request.user

        # Ensure user is authenticated and is a store owner
        if user.is_verified and user.user_role == User.STORE:
            menus = Menu.objects.filter(store=user.store, active=True)
            serializer = MenuSerializer(menus, many=True)
            return Response({"message": "lấy menu cửa hàng thành công", "data": serializer.data},
                            status=status.HTTP_200_OK)

        return Response({"message": "Bạn không có quyền truy cập quản lý menu"}, status=status.HTTP_403_FORBIDDEN)

    # tạo menu cho từng cửa hàng đăng nhập vào
    def create(self, request, *args, **kwargs):
        # Get the logged-in user
        user = request.user

        # Check if the user has the role 'STORE' and if the user is active and verified
        if user.user_role != User.STORE or not user.is_active or user.is_superuser or user.is_staff:
            return Response(
                {"message": "Bạn không có quyền thực hiện chức năng này!"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if the user is verified
        if not user.is_verified:
            return Response(
                {
                    "message": f"Tài khoản cửa hàng {user.username} chưa được chứng thực để thực hiện chức năng thêm menu!"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Retrieve 'name' from the request data
        name = request.data.get('name')

        # Check if 'name' is provided
        if name:
            # Create the Menu and associate it with the logged-in user's store
            menu = Menu.objects.create(
                name=name, active=True, store=user.store  # Ensure that the store is linked correctly
            )

            # Return success response with created menu data
            return Response(
                {"message": f"Lưu thông tin menu thành công cho cửa hàng {user.store.name}!", "data": request.data},
                status=status.HTTP_201_CREATED
            )

        # If 'name' is missing in the request data, return an error response
        return Response(
            {"message": "Lưu thông tin menu không thành công!"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # chỉnh sửa menu cho từng cửa hàng đăng nhập vào
    def partial_update(self, request, pk=None):
        try:
            menu = Menu.objects.get(id=pk)
            user = request.user

            if user.user_role != User.STORE or not user.is_active or user.is_superuser or user.is_staff:
                return Response({"message": "Bạn không có quyền thực hiện chức năng này!"},
                                status=status.HTTP_403_FORBIDDEN)

            if not user.is_verified:
                return Response({
                    "message": f"Tài khoản cửa hàng {user.username} chưa được chứng thực để thực hiện chức năng chỉnh sửa menu!"},
                    status=status.HTTP_403_FORBIDDEN)

            # Use the serializer to update the menu
            serializer = MenuSerializer(menu, data=request.data, partial=True)
            if serializer.is_valid():
                # Ensure that the menu belongs to the logged-in user
                if menu.store == user.store:
                    serializer.save()
                    return Response({"message": "Chỉnh sửa thông tin menu thành công!", "data": serializer.data},
                                    status=status.HTTP_200_OK)
                return Response(
                    {"message": "Chỉnh sửa thông tin menu không thành công! Bạn không có quyền chỉnh sửa menu này"},
                    status=status.HTTP_400_BAD_REQUEST)

            return Response({"message": "Chỉnh sửa thông tin menu không thành công!"},
                            status=status.HTTP_400_BAD_REQUEST)

        except Menu.DoesNotExist:
            return Response({'error': 'Không tìm thấy menu!'}, status=status.HTTP_404_NOT_FOUND)

    # xóa menu cho từng cửa hàng đăng nhập vào
    def destroy(self, request, *args, **kwargs):
        try:
            user = request.user
            menu = self.get_object()  # Get the menu object
            # Check if the logged-in user is the owner of the store
            if user == menu.store.user:
                super().destroy(request, *args, **kwargs)
                return Response({"message": "Xóa thông tin menu thành công!"},
                                status=status.HTTP_200_OK)

            return Response({"message": "Menu này không thuộc quyền xóa của bạn!"},
                            status=status.HTTP_403_FORBIDDEN)
        except Menu.DoesNotExist:
            return Response({'error': 'Không tìm thấy menu!'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['patch'], url_path='add-foods')
    def manage_foods(self, request, pk=None):
        """
        Handle adding selected foods to the menu.
        """
        menu = self.get_object()
        user = request.user

        # Ensure the logged-in user owns the menu
        if menu.store.owner != user:
            return Response({"error": "You are not allowed to modify this menu."}, status=status.HTTP_403_FORBIDDEN)

        # Add selected foods to the menu
        food_ids = request.data.get('food_ids', [])
        if not isinstance(food_ids, list) or not food_ids:
            return Response({"error": "Invalid or missing 'food_ids'."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate each food and add it to the menu
        foods = Food.objects.filter(id__in=food_ids, store=menu.store)
        if foods.count() != len(food_ids):
            return Response({"error": "Some foods are invalid or do not belong to your store."},
                            status=status.HTTP_400_BAD_REQUEST)

        menu.foods.add(*foods)

        return Response({"message": "Foods successfully added to the menu."}, status=status.HTTP_200_OK)

    @action(methods=['patch'], url_path='remove-foods', detail=True)
    def remove_foods_from_menu(self, request, pk=None):
        try:
            menu = Menu.objects.get(id=pk)
            user = request.user

            # Ensure the logged-in user owns the menu
            if user != menu.store.user:
                return Response({"error": "Bạn không có quyền xóa món ăn khỏi menu này!"},
                                status=status.HTTP_403_FORBIDDEN)

            # Get the list of food IDs to remove from the menu
            food_ids = request.data.get('food_ids', [])
            if not isinstance(food_ids, list) or not food_ids:
                return Response({"error": "Missing or invalid 'food_ids'."}, status=status.HTTP_400_BAD_REQUEST)

            # Validate and remove foods from the menu
            foods = Food.objects.filter(id__in=food_ids, menu=menu, store=user.store)

            if foods.count() != len(food_ids):
                return Response({"error": "Some foods are invalid or do not belong to your store or menu."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Remove each food from the menu
            foods.update(menu=None)  # This sets the menu field of each food to None

            # Return a successful response with the removed food details
            removed_foods = FoodSerializer(foods, many=True).data
            return Response({"message": "Món ăn đã được xóa khỏi menu thành công!", "removed_foods": removed_foods},
                            status=status.HTTP_200_OK)

        except Menu.DoesNotExist:
            return Response({"error": "Không tìm thấy menu!"}, status=status.HTTP_404_NOT_FOUND)


class OrderViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action in ['retrieve', 'cancel_order']:
            return [permissions.IsAuthenticated(), IsOrderOwner(), ]
        return [permissions.IsAuthenticated(), ]

    def create(self, request, *args, **kwargs):
        """
        {
            "address": 1,
            "store": 1,
            "delivery_fee": 15000,
            "items":
                [
                    {
                        "food": 3,
                        "quantity": 2
                    },
                    {
                        "food": 4,
                        "quantity": 1
                    }
                ]
        }
        """
        data = request.data
        try:
            store = Store.objects.get(id=data['store'], active=True)
            address = Address.objects.get(id=data['address'])
            if request.user == store.user:
                raise Exception('Bạn không thể đặt đơn trên chính cửa hàng bạn được')
        except Store.DoesNotExist:
            raise Exception('Store not found')

            # Get the user's active cart
            cart = Cart.objects.filter(user=request.user, active=True).first()
            if not cart:
                raise ValidationError("No active cart found.")

            # Check if cart items belong to the same store
            cart_items = CartItem.objects.filter(cart=cart, active=True)
            for item in cart_items:
                if item.food.store != store:
                    raise ValidationError(f'Food {item.food.name} does not belong to the specified store.')

            # Create the order object
            order = Order.objects.create(
                user=request.user,
                store=store,
                total=cart.total_price + data['delivery_fee'],  # Use the total_price property from Cart
                delivery_fee=data['delivery_fee'],
                address_ship=address,
            )

            # Transfer cart items to the order
            for cart_item in cart_items:
                order_item = OrderDetail.objects.create(
                    order=order,
                    food=cart_item.food,
                    quantity=cart_item.quantity,
                    unit_price=cart_item.food.price
                )

            # Now, we need to delete the cart once the order is created
            cart.delete()

            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='pending-order-of-my-store', detail=False)
    def get_order(self, request):
        try:
            my_store = request.user.store
        except Store.DoesNotExist:
            return Response('Lỗi: Bạn không có cửa hàng!', status=status.HTTP_404_NOT_FOUND)
        return Response(OrderSerializer(my_store.orders_for_store.filter(status='PENDING'), many=True).data,
                        status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], url_path='confirm-order')
    def confirm_order(self, request, pk):
        order = self.get_object()
        try:
            my_store = request.user.store
        except Store.DoesNotExist:
            return Response('Error: You do not have a store', status=status.HTTP_404_NOT_FOUND)
        if order.store != my_store:
            return Response(f'Error: This order with id {order.id} does not belong to your store',
                            status=status.HTTP_404_NOT_FOUND)
        if order.order_status != Order.PENDING:
            return Response('Error: Only orders with "PENDING" status can be confirmed',
                            status=status.HTTP_400_BAD_REQUEST)
        order.order_status = Order.ACCEPTED  # Assuming ACCEPTED means it's now delivering
        order.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'], url_path='cancel-order')
    def cancel_order(self, request, pk):
        order = self.get_object()
        if order.order_status != Order.PENDING:
            return Response('Error: Only orders with "PENDING" status can be cancelled',
                            status=status.HTTP_400_BAD_REQUEST)
        if utils.is_user_order_owner(order=order, user=request.user) is True:
            order.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        if utils.is_store_order_owner(order=order, store=request.user.store) is True:
            order.order_status = Order.CANCELLED
            order.save()
            return Response({'status': 'Order cancelled'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'], url_path='confirm-receipt')
    def complete_order(self, request, pk):
        order = self.get_object()
        if utils.is_user_order_owner(order=order, user=request.user) is False:
            return Response(f'Error: This order with id {order.id} does not belong to you',
                            status=status.HTTP_403_FORBIDDEN)
        if order.order_status != Order.ACCEPTED:  # Adjust based on correct status
            return Response('Error: Store has not confirmed delivery',
                            status=status.HTTP_400_BAD_REQUEST)
        order.order_status = Order.SUCCESS
        order.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)


class PublicFoodViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    """
    A viewset to allow both normal users and store owners to see the food list and details from any store.
    """
    queryset = Food.objects.filter(active=True)
    serializer_class = FoodSerializer
    permission_classes = [permissions.AllowAny]  # Allow both normal users and store owners

    def get_queryset(self):
        queryset = self.queryset

        # Apply filters based on query parameters
        q = self.request.query_params.get('q')  # Search query
        category_id = self.request.query_params.get('category_id')  # Category filter
        store_id = self.request.query_params.get('store_id')  # Store filter

        if q:
            queryset = queryset.filter(name__icontains=q)  # Filter by food name
        if category_id:
            queryset = queryset.filter(categories__id=category_id)  # Filter by category
        if store_id:
            queryset = queryset.filter(store_id=store_id)  # Filter by store_id if provided

        return queryset

    @action(methods=['post', 'get'], url_path='review', detail=True)
    def review(self, request, pk=None):
        """
        Handle review creation (POST) and viewing reviews (GET) for a specific food item.
        """
        food = self.get_object()  # Get the Food instance
        user = request.user  # Get the current user

        if request.method == 'POST':
            if food.store.user == user:
                return Response(
                    data="You cannot review food from your own store.",
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create a new review
            review_data = request.data.get('review')
            rating = request.data.get('rating')

            if not review_data or rating is None:
                return Response(
                    data="Review content and rating are required.",
                    status=status.HTTP_400_BAD_REQUEST
                )

            review = food.review.create(user=user, review=review_data, rating=rating)
            return Response(
                data=ReviewSerializer(review).data,
                status=status.HTTP_201_CREATED
            )

        if request.method == 'GET':
            # Get all reviews for the food
            reviews = food.review.all()
            return Response(
                data=ReviewSerializer(reviews, many=True).data,
                status=status.HTTP_200_OK
            )


# Viewset review đồ ăn
class ReviewViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsReviewOwner]
    queryset = Review.objects.all()
    parser_classes = [parsers.MultiPartParser]
    serializer_class = ReviewSerializer


class CartViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for viewing and editing cart items.
    """

    def list(self, request):
        # List the cart for the current user
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_to_cart(self, request, *args, **kwargs):
        user = request.user
        food_id = request.data.get('food_id')
        quantity = request.data.get('quantity')

        # If quantity is None or not provided, default to 1
        if quantity is None:
            quantity = 1
        else:
            try:
                quantity = int(quantity)  # Ensure quantity is an integer
                if quantity < 1:
                    raise ValidationError("Quantity must be at least 1.")
            except ValueError:
                raise ValidationError("Invalid quantity value.")

        # Get the food item that is being added to the cart
        try:
            food = Food.objects.get(id=food_id)
        except Food.DoesNotExist:
            raise ValidationError("Food item does not exist.")

        now = datetime.now().time()

        if food.start_time and food.end_time:
            if not (food.start_time <= now <= food.end_time):
                raise ValidationError(f"Food item {food.name} is not available at this time.")

        if user.user_role == User.STORE and user.store:
            if food.store == user.store:
                raise ValidationError("You cannot add food from your own store to the cart.")

        # Get the user's cart or create one if it doesn't exist
        cart, created = Cart.objects.get_or_create(user=user, active=True)

        # If the cart is not empty, check the store restriction
        if cart.cart_items.exists():
            first_food_item = cart.cart_items.first()  # Get the first item in the cart
            first_food_store = first_food_item.food.store  # Get the store of the first item in the cart

            # Check if the new food item is from a different store
            if food.store != first_food_store:
                raise ValidationError(
                    f"Cannot add food from a different store. The first item in the cart is from {first_food_store.name}.")

        # # Add the food item to the cart
        # cart_item, created = CartItem.objects.get_or_create(
        #     cart=cart,
        #     food=food,
        #     defaults={'quantity': 0}  # If the item doesn't exist, initialize the quantity to 0
        # )
        #
        # # Update the quantity of the food item in the cart
        # cart_item.quantity += int(request.data.get('quantity', 0))
        # cart_item.save()
        #
        # # Return the updated cart
        # serializer = CartSerializer(cart)
        # return Response(serializer.data, status=status.HTTP_200_OK)

        # Kiểm tra xem món ăn đã có trong giỏ hàng chưa
        cart_item, created = CartItem.objects.get_or_create(cart=cart, food=food)

        if not created:  # Nếu món ăn đã có trong giỏ hàng, tăng số lượng lên
            cart_item.quantity += quantity
            cart_item.save()
        else:  # Nếu món ăn chưa có, khởi tạo số lượng
            cart_item.quantity = quantity
            cart_item.save()

        # Cập nhật tổng giá trị của giỏ hàng
        cart.total = cart.total_price  # Cập nhật tổng tiền giỏ hàng
        cart.save()

        # Trả về giỏ hàng sau khi cập nhật
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def increase_quantity(self, request, pk=None):
        # Increase the quantity of a cart item
        cart_item = CartItem.objects.get(id=pk)
        cart_item.quantity += 1
        cart_item.save()
        return Response({'message': 'Quantity increased.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def decrease_quantity(self, request, pk=None):
        # Decrease the quantity of a cart item
        cart_item = CartItem.objects.get(id=pk)
        if cart_item.quantity > 1:
            cart_item.quantity -= 1
            cart_item.save()
            return Response({'message': 'Quantity decreased.'}, status=status.HTTP_200_OK)
        return Response({'message': 'Cannot decrease quantity below 1.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def remove_item(self, request, pk=None):
        # Remove a cart item
        cart_item = CartItem.objects.get(id=pk)
        cart_item.delete()
        return Response({'message': 'Item removed from cart.'}, status=status.HTTP_204_NO_CONTENT)


class RevenueViewSet(viewsets.ViewSet):
    permission_classes = [IsOrderOwner]

    def list(self, request):
        user = request.user
        store = Store.objects.filter(user=user).first()

        if not store:
            return Response({'error': 'User does not have an associated store.'}, status=400)

        orders = Order.objects.filter(store=store, order_status=Order.SUCCESS)
        yearly_revenue = orders.annotate(year=ExtractYear('created_date')) \
            .values('year') \
            .annotate(revenue=Sum('total')) \
            .order_by('-year')

        serializer = YearlyRevenueSerializer(yearly_revenue, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def monthly_revenue(self, request):
        year = request.query_params.get('year')
        if not year:
            return Response({'error': 'Year parameter is required.'}, status=400)

        user = request.user
        store = Store.objects.filter(user=user).first()

        if not store:
            return Response({'error': 'User does not have an associated store.'}, status=400)

        orders = Order.objects.filter(store=store, order_status=Order.SUCCESS, created_date__year=year)
        monthly_revenue = orders.annotate(month=ExtractMonth('created_date')) \
            .values('month') \
            .annotate(revenue=Sum('total')) \
            .order_by('month')

        serializer = MonthlyRevenueSerializer(monthly_revenue, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def quarterly_revenue(self, request):
        year = request.query_params.get('year')
        if not year:
            return Response({'error': 'Year parameter is required.'}, status=400)

        user = request.user
        store = Store.objects.filter(user=user).first()

        if not store:
            return Response({'error': 'User does not have an associated store.'}, status=400)

        orders = Order.objects.filter(store=store, order_status=Order.SUCCESS, created_date__year=year)
        quarterly_revenue = orders.annotate(quarter=ExtractQuarter('created_date')) \
            .values('quarter') \
            .annotate(revenue=Sum('total')) \
            .order_by('quarter')

        serializer = QuarterlyRevenueSerializer(quarterly_revenue, many=True)
        return Response(serializer.data)
