from django.urls import path, include
from . import views
from django.contrib import admin
from .views import FoodSearchView , StatisticsView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('User', views.UserViewSet, basename='Users')
router.register('Store', views.StoreViewSet, basename='store')
router.register('Menu', views.MenuViewSet, basename='Menu')
router.register('Category', views.CategoryViewSet, basename='Category')
router.register('Comment', views.CommentViewSet, basename='Comment')
router.register('Review', views.ReviewViewSet, basename='Review')
router.register('Order', views.OrderViewSet, basename='Order')
router.register('FoodM', views.FoodViewSet, basename='FoodM')
router.register('FoodP', views.PublicFoodViewSet, basename='FoodP')
router.register('Cart', views.CartViewSet, basename='Cart')
router.register('Revenue', views.RevenueViewSet, basename='Revenue')
router.register('StoreList', views.StoreListViewSet, basename='StoreList')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('Search/', FoodSearchView.as_view(), name='food-search'),
    path('statistics/', StatisticsView.as_view(), name='statistics')  # Adding the new StatisticsView path
]

