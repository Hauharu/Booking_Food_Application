"""
URL configuration for BookingFood project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include, re_path
from BookingFoodApp.admin import admin_site
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Cấu hình giao diện tài liệu API (Swagger, Redoc)
schema_view = get_schema_view(
    openapi.Info(
        title="API quản lý đặt đồ ăn",
        default_version='v1',
        description="APIs để đặt đồ ăn",
        contact=openapi.Contact(email="2251012120quang@ou.edu.vn"),
        license=openapi.License(name="Nguyễn Văn Quang và Nguyễn Trung Hậu@2025"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# Danh sách URL
urlpatterns = [
    # Đường dẫn tới trang quản trị
    path('admin/', admin_site.urls),
    # Bao gồm các URL của ứng dụng BookingFoodApp
    path('', include('BookingFoodApp.urls')),
    # Đường dẫn cho OAuth2 (xác thực và phân quyền)
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    # Đường dẫn cho CKEditor (trình soạn thảo văn bản)
    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
    # Đường dẫn trả về tài liệu API ở định dạng JSON hoặc YAML
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    # Đường dẫn giao diện Swagger UI
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    # Đường dẫn giao diện Redoc UI
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc')
]
