import React, {useEffect, useState} from 'react';
import { StyleSheet } from 'react-native';
import { Colors, Text, View, Badge, Card, TouchableOpacity, Image } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';


const baseURL = 'https://trunghau.pythonanywhere.com';

const fetchStores = async () => {
    try {
        const response = await fetch(`${baseURL}/Store/`);
        const data = await response.json();
        console.log('Fetched stores data:', data); // Log the data to the console
        return data;
    } catch (error) {
        console.error('Error fetching stores:', error);
        return []; // Return an empty array if there's an error
    }
};

const RestaurantItem = ({ item, navigation }) => {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const loadStores = async () => {
            const response = await fetchStores();
            setStores(response?.results || []); // Ensure response and response.results are defined
        };
        loadStores();
    }, []);

    return (
        <>
            {stores.length > 0 ? (
                stores.map((store) => (
                    <TouchableOpacity onPress={() => { navigation.navigate('Restaurant', { restaurantId: store.id }) }} key={store.id} marginB-12>
                        <Card row padding-8>
                            <View paddingB-4 style={{ aspectRatio: 1 }}>
                                <Image source={{ uri: store.image }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
                            </View>
                            <View paddingL-15>
                                <Text style={{ fontSize: 18, fontWeight: '600' }}>{store.name}</Text>
                                <View row marginT-5>
                                    <View row centerV>
                                        <Icon name="star" size={18} color={Colors.yellow20} />
                                        <Text marginL-3>{store.rating}</Text>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))
            ) : (
                <Text>Không có cửa hàng nào</Text>
            )}
        </>
    );
};

const styles = StyleSheet.create({});

export default RestaurantItem