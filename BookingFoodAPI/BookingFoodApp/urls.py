from django.urls import path, include
from . import views
from django.contrib import admin
from .views import FoodSearchView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('User', views.UserViewSet, basename='Users')
router.register('Store', views.StoreViewSet, basename='store')
# router.register('Menu', views.MenuViewSet, basename='Menu')
router.register('Category', views.CategoryViewSet, basename='Category')
router.register('Comment', views.CommentViewSet, basename='Comment')
router.register('Order', views.OrderViewSet, basename='Order')
router.register('Food', views.FoodViewSet, basename='Food')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('food/search/', FoodSearchView.as_view(), name='food-search'),
]