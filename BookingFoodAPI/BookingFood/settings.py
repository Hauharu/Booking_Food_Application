"""
Django settings for BookingFood project.

Generated by 'django-admin startproject' using Django 5.1.4.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import cloudinary.api

# Khai báo đường dẫn cơ bản cho dự án
BASE_DIR = Path(__file__).resolve().parent.parent

# *** Cài đặt bảo mật ***
SECRET_KEY = 'django-insecure--6c-x-h^@!a1%0_pgn%7)^l!&ccv0&j(1wtemgco&51_m2m(!g'  # Khóa bí mật, cần bảo mật trong môi trường thực tế
DEBUG = True  # Chỉ nên bật `True` trong môi trường phát triển
ALLOWED_HOSTS = []  # Danh sách các tên miền hoặc địa chỉ IP được phép truy cập

# *** Khai báo các ứng dụng Django ***
INSTALLED_APPS = [
    'django.contrib.admin',  # Quản lý Admin
    'django.contrib.auth',  # Xác thực người dùng
    'django.contrib.contenttypes',  # Xử lý nội dung loại hình
    'django.contrib.sessions',  # Quản lý phiên làm việc
    'django.contrib.messages',  # Hệ thống thông báo
    'django.contrib.staticfiles',  # Quản lý tệp tĩnh (CSS, JS, ảnh)
    'BookingFoodApp.apps.BookingFoodAppConfig',  # Ứng dụng chính của dự án
    'ckeditor',  # Tích hợp CKEditor
    'ckeditor_uploader',  # Hỗ trợ upload qua CKEditor
    'rest_framework',  # Django REST Framework
    'rest_framework.authtoken',  # Cung cấp xác thực dựa trên token cho API.
    'oauth2_provider',  # Hỗ trợ OAuth2
    'drf_yasg',  # Swagger API Documentation
    "corsheaders",  # Hỗ trợ Cross-Origin Resource Sharing (CORS)
    'django_extensions',  # Cung cấp các lệnh quản lý bổ sung
    'cloudinary',  # Tích hợp Cloudinary để xử lý tệp
]

# *** Cấu hình Middleware ***
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',  # Bảo mật chung
    'django.contrib.sessions.middleware.SessionMiddleware',  # Quản lý phiên làm việc
    'django.middleware.common.CommonMiddleware',  # Xử lý các yêu cầu chung
    'django.middleware.csrf.CsrfViewMiddleware',  # Chống tấn công CSRF
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # Xác thực người dùng
    'django.contrib.messages.middleware.MessageMiddleware',  # Quản lý tin nhắn
    'django.middleware.clickjacking.XFrameOptionsMiddleware',  # Ngăn chặn clickjacking
    'corsheaders.middleware.CorsMiddleware',  # Hỗ trợ CORS
]

# Cho phép CORS từ tất cả các nguồn
CORS_ALLOW_ALL_ORIGINS = True

# *** Định nghĩa URL gốc và cấu hình template ***
ROOT_URLCONF = 'BookingFood.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',  # Sử dụng backend template Django
        'DIRS': [],  # Thư mục chứa template tùy chỉnh
        'APP_DIRS': True,  # Kích hoạt tự động tìm template trong các ứng dụng
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Cấu hình ứng dụng WSGI
WSGI_APPLICATION = 'BookingFood.wsgi.application'

# *** Cấu hình Database ***
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # Sử dụng MySQL làm cơ sở dữ liệu
        'NAME': 'bookingfood_db',  # Tên cơ sở dữ liệu
        'USER': 'root',  # Tên đăng nhập
        'PASSWORD': 'Quang0913906329',  # Mật khẩu
        'HOST': '',  # Mặc định là localhost
    }
}

# *** Cấu hình xác thực mật khẩu ***
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# *** Cài đặt ngôn ngữ và múi giờ ***
LANGUAGE_CODE = 'en-us'  # Ngôn ngữ mặc định
TIME_ZONE = 'Asia/Ho_Chi_Minh'  # Múi giờ Việt Nam
USE_I18N = True  # Hỗ trợ quốc tế hóa
USE_TZ = True  # Sử dụng múi giờ

# *** Cấu hình tệp tĩnh và tệp media ***
STATIC_URL = 'static/'  # Đường dẫn tệp tĩnh
MEDIA_ROOT = '%s/BookingFoodApp/static/' % BASE_DIR  # Thư mục lưu trữ tệp media
CKEDITOR_UPLOAD_PATH = "ckeditors/BookingFoodApp/"  # Thư mục tải lên CKEditor
ACCOUNT_UNIQUE_EMAIL = True

# *** Cài đặt mặc định ***
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# # Cấu hình OAuth2
OAUTH2_PROVIDER = {'OAUTH2_BACKEND_CLASS': 'oauth2_provider.oauth2_backends.JSONOAuthLibCore'}

# *** Tích hợp Cloudinary ***
cloudinary.config(
    cloud_name="dwwfgtxv4",
    api_key="847843234855491",
    api_secret="OEbZdz4wwMCsG_CEfXW6ScQFliI",  # Khóa API bí mật
    secure=True
)

# *** Cấu hình REST Framework ***
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 4,
    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.openapi.AutoSchema'
}

# *** Cấu hình Email ***
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'trunghauu71@gmail.com'  # Tài khoản email
EMAIL_HOST_PASSWORD = 'gnqm ddzq yzhw menp'  # Mật khẩu ứng dụng email
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# *** Cấu hình VNPay ***
VNPAY_RETURN_URL = 'http://10.0.2.2:8000/payment_return'
VNPAY_PAYMENT_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
VNPAY_API_URL = 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'
VNPAY_TMN_CODE = 'R1A37216'
VNPAY_HASH_SECRET_KEY = 'HOSKCEPHFSVTQVUGNRLGWCFBFUXPYIZK'

# *** Cấu hình Firebase ***
FIREBASE_CONFIG = {
    'apiKey': "AIzaSyBfYdtWpo46kpv5_P259iG1bsfsVvWSHeE",
    'authDomain': "culinary-location-new.firebaseapp.com",
    'projectId': "culinary-location-new",
    'storageBucket': "culinary-location-new.appspot.com",
    'messagingSenderId': "234892339175",
    'appId': "1:234892339175:web:e26ec6e088442e65e4bf42",
    'measurementId': "G-GTRY55R75P"
}

# Chỉ định model User tùy chỉnh
AUTH_USER_MODEL = 'BookingFoodApp.User'

# Cho phép thêm dấu `/` vào cuối URL
APPEND_SLASH = True

CLIENT_ID = 'v9W0IjV5w5nWnr9D5n3l1pbRYhTVtyWioTIOFgdz'
CLIENT_SECRET = 'WshDAP2cwNm9Fk9SUIJAlXGgXaaqYgz1nODksj7rq4gDnUWH23XWix1Um5SBLbQNvkqaGDNmfWGGfRzWkz3OWk26tJDzh4UO92x2B82A0zJY6mAWOZCAfWFSf3pfTyVc'

GOOGLE_MAPS_API_KEY = 'AIzaSyD6RMZqMyTbefVRlasoDHbjLXEF3GUqM3I'