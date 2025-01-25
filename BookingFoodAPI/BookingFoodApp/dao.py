from django.db.models import Count
from .models import *


def count_store():
    return Store.objects.filter(active=True).count()


def count_user():
    return User.objects.filter(is_active=True).count()


def load_store(params={}):
    q = Store.objects.filter(active=True)

    kw = params.get('kw')
    if kw:
        q = q.filter(name__icontains=kw)

    cate_id = params.get('cate_id')
    if cate_id:
        q = q.filter(category_id=cate_id)

    return q


def count_store_by_cate():
    return Category.objects.annotate(c=Count('store__id')).\
            values('id', 'name', 'c').\
            order_by('c')
