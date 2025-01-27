import React from 'react';
import { StyleSheet, StatusBar, FlatList } from 'react-native';
import { Button, Colors, Text, View, Image, Card } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';

const OrderDetailScreen = ({ navigation, route }) => {
    const { orderId } = route.params;
    const orderItems = useSelector(state => state.orderItems);
    const item = orderItems.find((item) => item.id == orderId);
    const cartItems = item.cartItems;
    return (
        <View flex-1>
            <StatusBar barStyle="light-content"
                backgroundColor={Colors.primary}
                translucent
            />
            <View paddingH-24 paddingV-24>
                <Card style={styles.order}>
                    <View row spread>
                        <Text text60 grey10>Mã đơn hàng:</Text>
                        <Text text60 grey10>#{item.id}</Text>
                    </View>
                    <View marginT-12 marginB-12 style={{ borderTopWidth: 1, borderTopColor: Colors.grey50 }} />
                    <View row spread marginT-8 centerV>
                        <Text style={{ fontSize: 18 }} grey10>Ngày đặt hàng:</Text>
                        <Text style={{ fontSize: 18 }} text70 grey20> {item.date.toLocaleString()}</Text>
                    </View>
                    <View row spread marginT-8 centerV>
                        <Text style={{ fontSize: 18 }} grey10>Địa chỉ giao hàng:</Text>
                        <Text style={{ fontSize: 18 }} text70 grey20> Biên Hòa, Đồng Nai</Text>
                    </View>
                    <View row spread marginT-8 centerV>
                        <Text style={{ fontSize: 18 }} grey10>Trạng thái:</Text>
                        <Text style={{ fontSize: 18 }} green10>{item.state}</Text>
                    </View>
                    <View marginT-20 marginB-16 style={{ borderTopWidth: 1, borderTopColor: Colors.grey50 }} />
                    <FlatList
                        data={cartItems}
                        keyExtractor={item => item.foodId}
                        renderItem={({ item }) =>
                            <View row spread centerV paddingV-4>
                                <Text flex-1 style={{ fontSize: 18 }} numberOfLines={2} ellipsizeMode="tail">{item.food.name}</Text>
                                <Text marginL-16 style={{ fontSize: 18 }} color={Colors.grey10}>{item.food.price.toLocaleString()}đ</Text>
                                <Text marginL-8 style={{ fontSize: 18 }} >x {item.quantity}</Text>
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                    />
                    <View marginT-16 marginB-12 style={{ borderTopWidth: 1, borderTopColor: Colors.grey50 }} />
                    <View row spread marginT-8 centerV>
                        <Text style={{ fontSize: 18 }} grey10>Giá gốc:</Text>
                        <Text text60M grey30 style={{ textDecorationLine: 'line-through' }}>{item.subTotalPrice.toLocaleString()}đ</Text>
                    </View>
                    <View row spread marginT-8 centerV>
                        <Text style={{ fontSize: 18 }} grey10>Tổng tiền:</Text>
                        <Text text60 yellow10>{item.totalPrice.toLocaleString()}đ</Text>
                    </View>
                </Card>
            </View>
        </View>
    )
}

export default OrderDetailScreen

const styles = StyleSheet.create({
    order: {
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 10,
    },
    image: {
        top: 0,
        width: 65,
        height: 65,
        resizeMode: 'cover',
        borderRadius: 5
    }
})