from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField
from django import forms
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, signals, Sum, F
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings


# BaseModel: Lớp cơ sở chung cho các model khác.
class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# User: Lớp mô tả thông tin người dùng với các vai trò.
class User(AbstractUser):
    avatar = CloudinaryField('avatar', default='', null=True)
    phone = models.CharField(max_length=10, null=False, unique=True, default=False)
    is_verified = models.BooleanField(default=False)
    USER, STORE = range(2)
    ROLE_CHOICES = [
        (USER, "USER"),
        (STORE, "STORE")
    ]
    user_role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=USER)

    def __str__(self):
        return self.username

    class Meta:
        unique_together = ('username', 'email')


# Address: Thông tin địa chỉ của người dùng.
class Address(models.Model):
    address_ship = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses', null=False, blank=False)

    def __str__(self):
        return self.address_ship


# Store: Thông tin cửa hàng.
class Store(models.Model):
    name = models.CharField(max_length=255, null=False, unique=True)
    description = RichTextField(null=True, blank=True)
    image = CloudinaryField('image', default='', null=True, blank=True)
    address_line = models.CharField(max_length=255, default='Ho Chi Minh City', blank=False)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)
    active = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='store', null=True, blank=False)


    def __str__(self):
        return self.name

# UserFollowedStore: Theo dõi cửa hàng bởi người dùng.
class UserFollowedStore(BaseModel):
    followed_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='subscribers')

    class Meta:
        unique_together = ('user', 'store')


# Menu: Menu của cửa hàng.
class Menu(BaseModel):
    name = models.CharField(max_length=50, null=True, blank=True)
    description = RichTextField(blank=True, null=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, limit_choices_to={'user__user_role': User.STORE})

    def __str__(self):
        return self.name

@receiver(post_save, sender=Menu)
def notification_for_new_menu(sender, instance, created, **kwargs):
    # Only send the email if the menu is created, not updated
    if created:
        user_follow_store = UserFollowedStore.objects.filter(store=instance.store)
        for user_follow in user_follow_store:
            send_mail(
                f'Cửa hàng {user_follow.store.name} có menu mới!',
                f'''Xin chào {user_follow.user.first_name} {user_follow.user.last_name},

Cửa hàng {user_follow.store.name} mà bạn theo dõi đã có menu mới! Hãy nhanh tay khám phá và thưởng thức những món ăn ngon mới nhất từ {user_follow.store.name}.

------------------------------------------------------------

Thông tin menu:
Tên menu: {instance.name}

Chúng tôi mong muốn menu này có thể sẽ hợp ý với bạn!.

Thân mến,
QuangThuanFood''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user_follow.user.email],
                fail_silently=False
            )





class Food(BaseModel):
    name = models.CharField(max_length=255, null=False)
    price = models.DecimalField(max_digits=9, decimal_places=0)
    description = RichTextField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    STATUS_CHOICES = [
        ('available', 'Còn đồ ăn'),
        ('out_of_stock', 'Hết đồ ăn')
    ]
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='out_of_stock')
    average_rating = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)
    image = CloudinaryField('image', default='', null=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='food', blank=False)
    menu = models.ForeignKey(Menu, on_delete=models.PROTECT, related_name='food', null=True,blank=True)
    categories = models.ManyToManyField('Category', related_name='food',blank=True)



    def __str__(self):
        return self.name


@receiver(post_save, sender=Food)
def notification(sender, instance, created, **kwargs):
    # Only send the email if the food item is created, not updated
    if created:
        user_follow_store = UserFollowedStore.objects.filter(store=instance.store)
        for user_follow in user_follow_store:
            send_mail(
                f'Bạn ơi, cửa hàng {user_follow.store.name} có món mới!',
                f'''Xin chào {user_follow.user.first_name} {user_follow.user.last_name},

Cửa hàng {user_follow.store.name} mà bạn theo dõi đã có món mới! Hãy nhanh tay khám phá và thưởng thức những món ăn ngon mới nhất từ {user_follow.store.name}.

------------------------------------------------------------

Thông tin món:
Tên món: {instance.name}

Mô tả: {instance.description}

Giá món: {instance.price}

Ngoài ra, {user_follow.store.name} còn có nhiều món ngon khác đang chờ bạn khám phá.

Thân mến,
QuangThuanFood''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user_follow.user.email],
                fail_silently=False
            )




# Cart: Giỏ hàng.
class Cart(BaseModel):
    total = models.DecimalField(max_digits=9, decimal_places=2, null=True, default=0.0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    food = models.ManyToManyField(Food, related_name='cart', through='CartItem')

    @property
    def total_price(self):
        """
        Tính tổng giá trị của tất cả CartDetail liên quan đến Cart này.
        Tổng được tính bằng quantity * food.price.
        """
        cart_details = self.cart_items.filter(active=True)
        total = cart_details.aggregate(
            total_price=Sum(F('quantity') * F('food__price'))
        )['total_price']
        return total or 0  # Trả về 0 nếu không có món nào trong Cart


# Cart_item: Chi tiết giỏ hàng.
class CartItem(BaseModel):
    quantity = models.IntegerField(null=True, default=0)
    cart = models.ForeignKey(Cart, related_name='cart_items', on_delete=models.CASCADE, null=False)
    food = models.ForeignKey(Food, related_name='cart_items', on_delete=models.RESTRICT, null=False)


# Category: Danh mục món ăn.
class Category(BaseModel):
    name = models.CharField(max_length=100, null=False, unique=True)

    def __str__(self):
        return self.name

# Search: Thông tin tìm kiếm món ăn.
class Search(models.Model):
    food_name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=9, decimal_places=0)
    food_type = models.CharField(max_length=50)
    store_name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    def __str__(self):
        return f"Search by {self.user} for {self.food_name}"


# Order: Đơn hàng.
class Order(BaseModel):
    total = models.DecimalField(max_digits=9, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=0)
    payment_status = models.BooleanField(default=True)
    PENDING, CANCELLED, ACCEPTED, SUCCESS = range(4)
    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (CANCELLED, "Cancelled"),
        (ACCEPTED, "Accepted"),
        (SUCCESS, "Success"),
    ]
    order_status = models.PositiveSmallIntegerField(choices=STATUS_CHOICES, default=PENDING)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='orders')
    store = models.ForeignKey(Store, on_delete=models.SET_NULL, null=True, related_name='orders')
    address_ship = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    food = models.ManyToManyField(Food, related_name='orders', through='OrderDetail')

    def __str__(self):
        return str(self.user)


# OrderDetail: Chi tiết đơn hàng.
class OrderDetail(models.Model):
    unit_price = models.DecimalField(max_digits=10, decimal_places=0)
    quantity = models.PositiveIntegerField()
    order = models.ForeignKey(Order, related_name='order_details', on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.RESTRICT)


# ActionBase: Lớp hành động cơ bản (like, comment, rate).
class ActionBaseC(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    store = models.ForeignKey(Store, on_delete=models.PROTECT, blank=True, null=True, related_name='comments')

    class Meta:
        abstract = True
        unique_together = ('store', 'user')


# Comment: Bình luận món ăn.
class Comment(ActionBaseC):
    content = RichTextField(blank=True, null=True)
    rate = models.FloatField(default=0, blank=False)

    def __str__(self):
        return self.content

@receiver(signals.post_save, sender=Comment)
def update_average_rating(sender, instance, **kwargs):
    stores = instance.store

    # Lấy tất cả các comment của store hiện tại mà user comment
    comments = Comment.objects.filter(store=stores)

    # Tính tổng và số lượng rating
    total_rating = sum(comment.rate for comment in comments)
    count = comments.count()

    # Tính average rating
    stores.rating = total_rating / count if count > 0 else 0
    stores.save()

@receiver(post_delete, sender=Comment)
def update_average_rating_on_delete(sender, instance, **kwargs):
    stores = instance.store

    # Get remaining reviews for the food item
    Comments = Comment.objects.filter(store=stores)

    # Recalculate the average rating
    total_rating = sum(review.rating for review in Comments)
    count = Comments.count()

    stores.average_rating = total_rating / count if count > 0 else 0
    stores.save()


class ActionBaseR(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    food = models.ForeignKey(Food, on_delete=models.PROTECT, blank=True, null=True, related_name='review')

    class Meta:
        abstract = True
        unique_together = ('food', 'user')

# Comment: Bình luận món ăn.
class Review(ActionBaseR):
    review = RichTextField(blank=True, null=True)
    rating = models.FloatField(default=0, blank=False)

    def __str__(self):
        return self.review

@receiver(signals.post_save, sender=Review)
def update_average_rating(sender, instance, **kwargs):
    food = instance.food

    reviews = Review.objects.filter(food=food)

    total_rating = sum(review.rating for review in reviews)
    count = reviews.count()

    # Tính average rating
    food.average_rating = total_rating / count if count > 0 else 0
    food.save()

@receiver(post_delete, sender=Review)
def update_average_rating_on_delete(sender, instance, **kwargs):
    food = instance.food

    # Get remaining reviews for the food item
    reviews = Review.objects.filter(food=food)

    # Recalculate the average rating
    total_rating = sum(review.rating for review in reviews)
    count = reviews.count()

    food.average_rating = total_rating / count if count > 0 else 0
    food.save()


# ChatMessage: Tin nhắn chat giữa người dùng.
class ChatMessage(models.Model):
    message = models.TextField(null=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)