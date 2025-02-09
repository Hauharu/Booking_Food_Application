import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, StatusBar} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import APIs, {endpoints} from "../../configs/APIs";

const StoreMenu = ({ route }) => {
    const {storeId} = route.params;
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();


    const fetchMenuData = async () => {
        try {
            const response = await await APIs.get(endpoints["current-store-menu"](storeId));
            setMenuData(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching menu data:', err);
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuData();
    }, []);

    if (loading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#4CAF50"/>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Error fetching menu data. Please try again later.</Text>
            </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent"/>
            <View style={{backgroundColor: '#4CAF50', padding: 15}}>
                <Text style={{fontSize: 22, color: 'white', fontWeight: 'bold', textAlign: 'center'}}>
                    Menu cửa hàng
                </Text>
            </View>
            <FlatList
                data={menuData}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <View style={{margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item.name}</Text>
                        {item.food.map(food => (
                            <TouchableOpacity
                                key={food.id}
                                onPress={() => navigation.navigate('FoodDetail', {foodId: food.id})}
                                style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}
                            >
                                <Image
                                    source={{uri: food.image}}
                                    style={{width: 50, height: 50, marginRight: 10}}
                                />
                                <View>
                                    <Text style={{fontSize: 16}}>{food.name}</Text>
                                    <Text style={{fontSize: 14, color: '#666'}}>{food.price} VND</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            />
        </View>
    );
}

export default StoreMenu;
