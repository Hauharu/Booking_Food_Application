import React, { useState, useCallback } from 'react';
import {StyleSheet, StatusBar, FlatList, ActivityIndicator, Alert, Image, Dimensions} from 'react-native';
import { Colors, Text, View, Card, Button } from 'react-native-ui-lib';
import APIs, { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import RenderHTML from "react-native-render-html";
import FoodDetailStyles from "../Home/FoodDetailStyles";

const ManageFood = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { width } = Dimensions.get('window');

    const fetchData = useCallback(async () => {
        try {
            const api = await authApis();
            const response = await api.get(endpoints['foodm']);
            console.log(response.data);
            setFoodItems(response.data.results);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching food data: ", error);
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );


    const changeStatus = async (foodId, currentStatus) => {
        try {
            const api = await authApis();

            // Toggle status between "available" and "out_of_stock"
            const newStatus = currentStatus === "available" ? "out_of_stock" : "available";

            // Create a FormData object and append the new status
            const formData = new FormData();
            formData.append('status', newStatus);

            await api.patch(
                endpoints['foodm-updatestatus'](foodId),
                formData, // Send the FormData object
                { headers: { "Content-Type": "multipart/form-data" } } // Set content type to multipart/form-data
            );

            Alert.alert(`Status changed to ${newStatus} for food with ID: ${foodId}`);
            fetchData();
        } catch (error) {
            console.error('Error changing food status:', error.response?.data || error.message);
            Alert.alert('Failed to change food status');
        }
    };

    const renderFoodItem = ({ item }) => {
        const statusText = item.status === 'available' ? 'Còn đồ ăn' : 'Hết đồ ăn';
        return (
            <Card style={styles.foodItem}>
                <View>
                    <Text text60 grey10>{item.name}</Text>
                    <Image source={{ uri: item.image }} style={styles.foodImage} />
                    <RenderHTML
                        contentWidth={width}
                        source={{ html: item.description || "Mô tả sản phẩm chưa được cập nhật." }}
                        defaultTextProps={{
                            style: {
                                fontSize: 20, // Adjust font size here
                            },
                        }}
                    />
                    <Text style={FoodDetailStyles.foodPrice}>
                        {parseInt(item.price).toLocaleString('en-US')} VND
                    </Text>
                    <Text grey10>Status: {statusText}</Text>
                    <View style={styles.buttonGroup}>
                        <Button
                            label=" Đổi Trạng thái"
                            size={Button.sizes.large}
                            onPress={() => changeStatus(item.id, item.status)}
                        />
                    </View>
                </View>
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
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary} translucent />
            <View style={styles.container}>
                <Text style={styles.title}>Quản Lý Đồ Ăn</Text>
                {foodItems.length !== 0 ? (
                    <View paddingH-24 paddingV-24>
                        <FlatList
                            data={foodItems}
                            keyExtractor={item => item.id.toString()}
                            renderItem={renderFoodItem}
                        />
                    </View>
                ) : (
                    <View flex-1 center>
                        <Text text60M center marginH-40 marginB-16>Không có đồ ăn nào!</Text>
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
    foodItem: {
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
    },
    foodImage: {
        width: 100,
        height: 100,
        marginVertical: 10
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    }
});

export default ManageFood;
