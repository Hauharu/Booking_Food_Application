# Generated by Django 5.1.5 on 2025-01-25 05:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BookingFoodApp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='food',
            name='categories',
            field=models.ManyToManyField(blank=True, related_name='food', to='BookingFoodApp.category'),
        ),
        migrations.AlterField(
            model_name='paymentvnpay',
            name='food',
            field=models.ManyToManyField(related_name='hoadon_vnpay', through='BookingFoodApp.PaymentVNPayDetail', to='BookingFoodApp.food'),
        ),
        migrations.AlterField(
            model_name='paymentvnpay',
            name='menu',
            field=models.ManyToManyField(related_name='hoadon_vnpay_menu', through='BookingFoodApp.PaymentVNPayDetail', to='BookingFoodApp.menu'),
        ),
    ]
