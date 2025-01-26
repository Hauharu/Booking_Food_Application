from cloudinary.cache.responsive_breakpoints_cache import instance
from django.shortcuts import render
from django.shortcuts import render
from django.http import HttpResponse
from django.utils.dateparse import parse_time
from django.views.decorators.csrf import csrf_exempt
from datetime import time
from pytz import timezone
from . import paginators
from rest_framework import viewsets, permissions, generics, parsers, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action, permission_classes
from rest_framework.views import Response, APIView
from .models import *
from .perms import IsStoreOwner, IsCommentOwner
from .serializers import (UserSerializer, StoreSerializer, MenuSerializer, CategorySerializer,
                          CommentSerializer, FoodInCategorySerializer, OrderSerializer, FoodSerializer,
                          AddressSerializer, ReviewSerializer, UserFollowedStoreSerializer)

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q, Count
from .models import Food
from .serializers import FoodSerializer

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

        # Base query
        foods = Food.objects.all()

        # Filter by query if provided
        if query:
            foods = foods.filter(name__icontains=query)

        # Filter by category if provided
        if category:
            foods = foods.filter(categories__id=category)

        # Filter by store if provided
        if store:
            foods = foods.filter(store_id=store)

        # Serialize the data
        serializer = FoodSerializer(foods, many=True)
        return Response(serializer.data)



# class OrderViewSet(viewsets.ModelViewSet):
#     queryset = Order.objects.all()
#     serializer_class = OrderSerializer



# class MenuViewSet(viewsets.ModelViewSet):
#     queryset = Menu.objects.filter(active=True)
#     serializer_class = MenuSerializer




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
            return [permissions.AllowAny(),]
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
                    address_line=data['address_line'], user=request.user, latitude=data['latitude'], longitude=data['longitude'],
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

        if not created: # created does not exist (tức là đã follow rồi)
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
                                        avatar=instance['avatar'])

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
            address = Address.objects.create(address_ship=data['address_ship'], latitude=data['latitude'], longitude=data['longitude'], user=user)
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





class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsCommentOwner]
    queryset = Comment.objects.all()
    parser_classes = [parsers.MultiPartParser]
    serializer_class = CommentSerializer





# class FoodViewSet(viewsets.ModelViewSet):
#     queryset = Food.objects.all()
#     serializer_class = FoodSerializer




class FoodViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.ListAPIView, generics.RetrieveAPIView):
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

        # Filter food by the store of the authenticated user
        if user.user_role == 'STORE':  # Replace with actual role logic
            # Store owners should see only foods from their own store
            queryset = queryset.filter(store__user=user)
        else:
            # Normal users can see foods from all stores (or based on other logic)
            queryset = queryset.filter(active=True)  # Only fetch foods from the store owned by the user

        # Apply other filters if provided
        q = self.request.query_params.get('q')  # Search query
        category_id = self.request.query_params.get('category_id')  # Category filter
        store_id = self.request.query_params.get('store_id')

        if q:
            queryset = queryset.filter(name__icontains=q)  # Filter by food name (search query)
        if category_id:
            queryset = queryset.filter(categories__id=category_id)  # Filter by category
        if store_id:
            queryset = queryset.filter(store_id=store_id)  # Assuming you have a `store_id` field in your Food model

        return queryset

    def destroy(self, request, *args, **kwargs):
        user = request.user
        if self.get_object().store.user != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        food = self.get_object()
        food.active = False
        food.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def partial_update(self, request, pk):
        food = self.get_object()
        user = request.user
        if food.store.user != user:
            return Response(data='Bạn không thể sửa đồ ăn cửa hàng khác!"',status=status.HTTP_403_FORBIDDEN)

        # Allowed fields
        allowed_fields = {'name', 'image', 'description', 'price', 'categories'}
        data = {key: value for key, value in request.data.items() if key in allowed_fields}

        if data.get('categories'):
            # Assuming categories are passed as a list of category IDs
            category_ids = data.get('categories')
            categories = Category.objects.filter(id__in=category_ids)
            data['categories'] = categories

        for key, value in data.items():
            if key == 'categories':
                food.categories.set(data['categories'])
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


    @action(methods=['post', 'get'], url_path='review', detail=True)
    def review(self, request, pk):
        food = self.get_object()  # Get the Store instance
        user = request.user  # Get the current user


        data = request.data
        if request.method == 'POST':
            if food.store.user == user:
                return Response(data="Bạn không thể bình luận trên chính đồ ăn của cửa hàng bạn được",
                                status=status.HTTP_400_BAD_REQUEST)
            # Create a new review
            c = food.review.create(user=user, review=data['review'], rating=data['rating'])
            return Response(ReviewSerializer(c).data, status=status.HTTP_201_CREATED)

        if request.method == 'GET':
            # Get all review for the food
            return Response(data=ReviewSerializer(food.review, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['patch'], url_path='add-to-menu', detail=True)
    def add_to_menu(self, request, pk=None):
        """
        Add food to a menu.
        """
        food = self.get_object()
        user = request.user

        # Ensure the user is the store owner for the food
        if food.store.user != user:
            return Response(
                {"error": "You are not authorized to update this food item."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get data from request
        menu = request.data.get('menu')

        # Validate menu and check ownership
        try:
            menu = Menu.objects.get(id=menu, store__user=user)
        except Menu.DoesNotExist:
            return Response(
                {"error": "Menu không tìm thấy hoặc không thuộc quyền sở hữu của bạn"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update food item
        food.menu = menu
        food.save()

        return Response(
            {"message": "Food item updated successfully.", "data": FoodSerializer(food).data},
            status=status.HTTP_200_OK
        )

    @action(methods=['post'], url_path='add-to-store', detail=True)
    def add_to_store(self, request, pk=None):
        """
        Add food to a store.
        """
        food = self.get_object()
        user = request.user

        # Ensure the user is the store owner for the food
        if food.store.user != user:
            return Response(
                {"error": "You are not authorized to add food to this store."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Validate store ownership
        store = food.store

        # Adding food to store (if needed)
        if store.user != user:
            return Response(
                {"error": "You are not authorized to modify food in this store."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get the data from the request
        data = request.data
        try:
            # Create the food item
            food = store.food.create(
                name=data['name'], image=data['image'], description=data['description'],
                price=data['price'], store=store
            )
            # Add categories to the food if provided
            if 'categories' in data:
                category_ids = data['categories']
                food.categories.set(category_ids)

            return Response(data=FoodSerializer(food).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # @action(methods=['get'], url_path='reviews-of-food', detail=True)
    # def get_review(self, request, pk):
    #     food = self.get_object()
    #     return Response(CommentSerializer(food.reviews, many=True).data, status=status.HTTP_200_OK)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer



# MENU_ITEM
class MenuViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
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
        if self.action in ['create', 'update', 'delete', 'destroy', 'set_status_menu']:
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

        return Response({"message": "You do not have permission to access menus!"}, status=status.HTTP_403_FORBIDDEN)

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
                name=name,active=True,store=user.store  # Ensure that the store is linked correctly
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

# class MenuViewSet(viewsets.ModelViewSet):
#     queryset = Menu.objects.all()
#     serializer_class = MenuSerializer
#     parser_classes = [parsers.MultiPartParser]
#
#     def get_queryset(self):
#         # Get the user making the request
#         user = self.request.user
#
#         # If the user is authenticated and is a store owner
#         if user.is_authenticated and hasattr(user, 'store'):
#             # Return all menus for the store owned by the user
#             return self.queryset.filter(store=user.store)
#
#         # If the user is authenticated and is a regular user
#         elif user.is_authenticated and user.user_role == User.USER:
#             # Return only active menus for the specific store (filtered by store ID from query params)
#             store_id = self.request.query_params.get('store')
#             if store_id:
#                 return self.queryset.filter(store_id=store_id, active=True)
#             return self.queryset.none()  # If no store is specified, return an empty queryset
#
#         # If the user is not authenticated or has no specific role, return no data
#         return self.queryset.none()
#
#     def get_permissions(self):
#         if self.action in ['list']:
#             return [permissions.IsAuthenticated()]
#         if self.action in ['update_menu', 'add_menu']:
#             return [IsStoreOwner(), permissions.IsAuthenticated()]
#         return [permissions.IsAuthenticated()]
#
#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()
#         instance.active = False
#         instance.save()
#         return Response(data='Menu has been deactivated', status=status.HTTP_204_NO_CONTENT)
#
#     @action(methods=['post'], url_path='add', detail=False)
#     def add_menu(self, request):
#         data = request.data
#         store_id = data.get('store')
#         try:
#             store = Store.objects.get(id=store_id)
#         except Store.DoesNotExist:
#             return Response(data={'detail': 'Store not found'}, status=status.HTTP_404_NOT_FOUND)
#
#         if store.user != request.user:
#             return Response(data={'detail': 'You must be the owner of the store to add a menu.'}, status=status.HTTP_403_FORBIDDEN)
#
#         menu = Menu.objects.create(
#             name=data['name'],
#             description=data.get('description'),
#             store=store
#         )
#         return Response(MenuSerializer(menu).data, status=status.HTTP_201_CREATED)
#
#     @action(methods=['patch'], url_path='update/(?P<menu_id>\d+)', detail=False)
#     def update_menu(self, request, menu_id=None):
#         try:
#             menu = Menu.objects.get(id=menu_id)
#         except Menu.DoesNotExist:
#             return Response(data={'detail': 'Menu not found'}, status=status.HTTP_404_NOT_FOUND)
#
#         if menu.store.user != request.user:
#             return Response(data={'detail': 'You must be the owner of the store to update this menu.'}, status=status.HTTP_403_FORBIDDEN)
#
#         data = request.data
#         for field, value in data.items():
#             setattr(menu, field, value)
#
#         menu.save()
#         return Response(MenuSerializer(menu).data, status=status.HTTP_200_OK)