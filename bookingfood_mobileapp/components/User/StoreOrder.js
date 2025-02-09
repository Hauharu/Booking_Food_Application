import React, { useState, useCallback } from 'react';
import { StyleSheet, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import { Colors, Text, View, Card, Button } from 'react-native-ui-lib';
import APIs, { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

const Orders = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [storeItems, setStoreItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const orderStatusMap = {
        0: Colors.yellow30, // Pending
        1: Colors.red30,    // Cancelled
        2: Colors.blue30,   // In Progress
        3: Colors.green30   // Completed
    };

    const orderStatusText = {
        0: 'Đợi xác nhận',
        1: 'Đã hủy',
        2: 'Đã xác nhận',
        3: 'Đã hoàn thành'
    };

    const fetchData = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const api = await authApis(token);

            const [orderResponse, foodResponse, storeResponse] = await Promise.all([
                api.get(endpoints["order-store"]),
                APIs.get(endpoints["food"]),
                APIs.get(endpoints["allstore"]) // Fetch stores
            ]);

            console.log(orderResponse.data);
            setOrderItems(orderResponse.data);
            setFoodItems(foodResponse.data.results);
            setStoreItems(storeResponse.data); // Store the entire store data array
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data: ", error);
            setLoading(false);
        }
    }, []);


    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    const getFoodNameById = (id) => {
        const food = foodItems.find(food => food.id === id);
        return food ? food.name : `Food ID: ${id}`;
    };

    const getStoreNameById = (id) => {
        const store = storeItems.find(store => store.id === id);
        return store ? store.name : `Store ID: ${id}`;
    };

    const cancelOrder = async (orderId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            const api = await authApis(token);
            await api.delete(endpoints['order-cancel'](orderId));
            // Refresh data after cancelling
            fetchData();
        } catch (error) {
            console.error(`Error cancelling order ${orderId}: `, error);
        }
    };

    const confirmOrder = async (orderId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            const api = await authApis(token);
            await api.patch(endpoints['order-confirm'](orderId));
            // Refresh data after confirming
            fetchData();
        } catch (error) {
            console.error(`Error confirming order ${orderId}: `, error);
        }
    };

    const renderOrderItem = ({ item }) => {
        return (
            <Card style={styles.order}>
                <View>
                    <View row spread>
                        <Text text60 grey10>#{item.id}</Text>
                        <Text text70M grey10>{new Date(item.created_date).toLocaleString()}</Text>
                    </View>

                    {/* Order Status with Dynamic Color */}
                    <View marginT-12>
                        <Text
                            text70
                            style={{
                                color: Colors.white,
                                backgroundColor: orderStatusMap[item.order_status] || Colors.grey40,
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 6
                            }}
                        >
                            {orderStatusText[item.order_status] || 'Unknown'}
                        </Text>
                        <Text text70 marginT-4> Địa chỉ: {item.address || 'Unknown Address'}</Text>
                    </View>

                    {/* Store Name with Background Color */}
                    <View marginT-12 style={{ backgroundColor: Colors.blue60, padding: 8, borderRadius: 6 }}>
                        <Text text70 white center>{getStoreNameById(item.store)}</Text>
                    </View>
                </View>

                <FlatList
                    data={item.details}
                    keyExtractor={cartItem => cartItem.food.toString()}
                    renderItem={({ item: cartItem }) =>
                        <View row spread centerV paddingV-4>
                            <Text flex-1 style={{ fontSize: 18 }} numberOfLines={2} ellipsizeMode="tail">{getFoodNameById(cartItem.food)}</Text>
                            <Text marginL-16 style={{ fontSize: 18 }} color={Colors.grey10}>{parseFloat(cartItem.unit_price).toLocaleString()}đ</Text>
                            <Text marginL-8 style={{ fontSize: 18 }} >x {cartItem.quantity}</Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                />

                <View row spread marginT-8 centerV>
                    <Text style={{ fontSize: 18 }} grey10>Tổng tiền đồ ăn:</Text>
                    <Text text60M grey30 >{parseFloat(item.food_price).toLocaleString()}đ</Text>
                </View>
                <View row spread marginT-8 centerV>
                    <Text style={{ fontSize: 18 }} grey10>Tiền vận chuyển:</Text>
                    <Text text60M grey30 >{parseFloat(item.delivery_fee).toLocaleString()}đ</Text>
                </View>
                <View row spread marginT-8 centerV>
                    <Text style={{ fontSize: 18 }} grey10>Tổng tiền hóa đơn:</Text>
                    <Text text60 yellow10>{parseFloat(item.total).toLocaleString()}đ</Text>
                </View>

                {item.order_status === 0 && (
                    <View row spread>
                        <Button
                            label="Chấp nhận đơn"
                            onPress={() => acceptOrder(item.id)}
                            backgroundColor={Colors.green30}
                            marginRight-10
                        />
                        <Button
                            label="Từ chối đơn"
                            onPress={() => rejectOrder(item.id)}
                            backgroundColor={Colors.red30}
                        />
                    </View>
                )}

            </Card>
        );
    };


    if (loading) {
        return (
            <View flex-1 center>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View flex-1>
            <StatusBar barStyle="light-content"
                       backgroundColor={Colors.primary}
                       translucent
            />
            <View style={styles.container}>
                <Text style={styles.title}>Danh Sách Đơn Hàng</Text>
                {orderItems.length !== 0 ? (
                    <View paddingH-24 paddingV-24>
                        <FlatList
                            data={orderItems}
                            keyExtractor={item => item.id.toString()}
                            renderItem={renderOrderItem}
                        />
                    </View>
                ) : (
                    <View flex-1 center>
                        <Text text60M center marginH-40 marginB-16>Chưa có đơn hàng nào!</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingTop: 16,
    },
    order: {
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.primary
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
        color: Colors.primary
    }
});

export default Orders;
