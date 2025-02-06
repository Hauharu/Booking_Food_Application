from django.db.models import Count
from .models import *

# Hàm đếm số lượng cửa hàng đang hoạt động (active)
def count_store():
    return Store.objects.filter(active=True).count()

# Hàm đếm số lượng người dùng đang hoạt động (is_active=True)
def count_user():
    return User.objects.filter(is_active=True).count()

# Hàm tải danh sách cửa hàng với các tham số lọc tùy chọn
def load_store(params={}):
    q = Store.objects.filter(active=True)

    kw = params.get('kw')
    if kw:
        q = q.filter(name__icontains=kw)

    cate_id = params.get('cate_id')
    if cate_id:
        q = q.filter(category_id=cate_id)

    return q

# Hàm đếm số lượng cửa hàng theo danh mục
def count_store_by_cate():
    return Category.objects.annotate(c=Count('store__id')).\
            values('id', 'name', 'c').\
            order_by('c')
