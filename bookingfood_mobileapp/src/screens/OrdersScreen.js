import React from 'react';
import { StyleSheet, StatusBar, FlatList } from 'react-native';
import { Button, Colors, Text, View, TouchableOpacity, Card } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';

const OrdersScreen = ({ navigation }) => {
    const orderItems = useSelector(state => state.orderItems)
    return (
        <View flex-1>
            <StatusBar barStyle="light-content"
                backgroundColor={Colors.primary}
                translucent
            />
            {orderItems.length !== 0 &&
                <View paddingH-24 paddingV-24>
                    <FlatList
                        data={orderItems}
                        key={item => item.id}
                        renderItem={({ item }) =>
                            <Card style={styles.order}>
                                <TouchableOpacity onPress={() => { navigation.navigate('OrderDetail', { orderId: item.id }) }} key={item.id}>
                                    <View row spread>
                                        <Text text60 grey10>#{item.id}</Text>
                                        <Text text70M grey10>{item.date.toLocaleString()}</Text>
                                    </View>
                                    <View row spread marginT-12 centerV>
                                        <Text text70 green10 flex-1>{item.state}</Text>
                                        <Text text70 grey20 marginR-10 style={{ textDecorationLine: 'line-through' }}>
                                            {item.subTotalPrice.toLocaleString()}đ
                                        </Text>
                                        <Text text60 yellow10>{item.totalPrice.toLocaleString()}đ</Text>
                                    </View>
                                </TouchableOpacity>
                            </Card>
                        }
                    />
                </View>
            }
            {orderItems.length === 0 &&
                <View flex-1 center>
                    <Text text60M center marginH-40 marginB-16>Chưa có đơn hàng nào!</Text>
                    <Button
                        label="Xem địa điểm và món ăn"
                        onPress={() => navigation.navigate("Xem tất cả")}
                    />
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    order: {
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.primary
    }
});

export default OrdersScreen;