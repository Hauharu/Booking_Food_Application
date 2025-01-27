import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, ScrollView, FlatList } from 'react-native';
import { View, Text, TouchableOpacity, Image, Colors, Badge } from 'react-native-ui-lib';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { CustomStepper } from '../components'
import { RESTAURANTS } from '../data';

const FoodScreen = ({ navigation, route }) => {
    // Lấy ra món ăn
    const { foodId } = route.params;
    // Lấy ra trạng thái món ăn
    const availableFoods = useSelector(state => state.foods)
    const food = availableFoods.find((item) => item.id == foodId);

    // Lấy ra nhà hàng có món ăn
    const restaurant = RESTAURANTS.find(restaurant => restaurant.id === food.restaurantId);

    const dispatch = useDispatch();

    // Lấy ra món ăn yêu thích và thêm vào yêu thích
    const isFav = useSelector(state => state.favFoods.find(item => item.id == foodId))
    const addToFav = () => {
        dispatch({ type: 'TOGGLE_FAVORITE_FOOD', foodId: foodId })
    }

    // Thay đổi số lượng sản phẩm và thêm vào giỏ hàng
    const [quantity, setQuantity] = useState(1);
    const addToCart = () => {
        const cartItem = {
            foodId: foodId,
            food: food,
            quantity: quantity
        }
        dispatch({ type: 'ADD_TO_CART', cartItem: cartItem })
    }
    const handleAddToCart = () => {
        addToCart();
        navigation.navigate("Cart")
        setQuantity(1)
    }

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTransparent: true,
            headerStyle: {
                backgroundColor: 'transparent',
                borderBottomWidth: 0,
                elevation: 0,
            },
            headerTintColor: Colors.white,
            headerTitle: '',
            headerRight: () => (
                <View row centerV>
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => addToFav()}>
                        <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={30} color={Colors.red30} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: 10 }}>
                        <Ionicons name='search' size={30} color={Colors.white} style={styles.icon} />
                    </TouchableOpacity >
                    <TouchableOpacity>
                        <Ionicons name='share-outline' size={30} color={Colors.white} style={styles.icon} />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, isFav]);
    return (
        <View flex-1 bg-white>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Image source={food.image} style={styles.backgroundImage} />
                <View style={styles.infoContainer}>
                    <View row spread>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{food.name}</Text>
                        <Text marginT-4 style={styles.price}>{food.price.toLocaleString()} VNĐ</Text>
                    </View>
                    <View row centerV spread marginV-12>
                        <View row centerV>
                            <FontAwesome name="star" size={20} color={Colors.yellow20} />
                            <Text dark10 marginL-6 style={{ fontSize: 18, fontWeight: 600 }}>{food.rating}</Text>
                            <Text style={styles.infoText}>({food.reviewCount})</Text>
                        </View>
                        <View row centerV>
                            <FontAwesome name="clock-o" size={20} color={Colors.blue40} style={styles.infoIcon} />
                            <Text style={styles.infoText}>{restaurant.deliveryTime} phút</Text>
                        </View>
                        <View row centerV>
                            <Badge label="$" backgroundColor={Colors.green}></Badge>
                            <Text style={[styles.infoText, { marginLeft: 3 }]}> Free Delivery</Text>
                        </View>
                    </View>
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionTitleContainer}>
                            <Text style={styles.sectionTitle}>Mô tả</Text>
                        </View>
                        <Text style={styles.sectionContent}>{food.description}</Text>
                    </View>
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionTitleContainer}>
                            <Text style={styles.sectionTitle}>Thành phần</Text>
                        </View>
                        <FlatList
                            data={food.ingredients}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.ingredientItem}>
                                    <FontAwesome name="check-circle" size={20} color={Colors.primary} />
                                    <Text style={styles.ingredientText}>{item}</Text>
                                </View>
                            )}
                            scrollEnabled={false}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={styles.bottomBar}>
                <CustomStepper
                    showBackground={true}
                    onValueChange={(value) => setQuantity(value)}
                    minValue={1}
                    maxValue={10}
                    value={quantity}
                />
                <TouchableOpacity
                    onPress={() => handleAddToCart()}
                    backgroundColor={Colors.primary}
                    style={styles.bottomButton}
                >
                    <Ionicons name='cart' size={24} color={Colors.white}></Ionicons>
                    <Text
                        color={Colors.white}
                        style={styles.bottomButtonTitle}
                    >
                        Thêm Vào Giỏ Hàng
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {
        shadowColor: Colors.dark10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    backgroundImage: {
        top: 0,
        width: '100%',
        height: 320,
        resizeMode: 'cover',
    },
    infoContainer: {
        backgroundColor: Colors.white,
        padding: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: '500',
        color: Colors.dark10,
        width: '62%'
    },
    price: {
        fontSize: 24,
        fontWeight: '500',
        color: Colors.yellow10
    },
    infoText: {
        marginLeft: 6,
        fontSize: 16,
        color: Colors.grey20,
    },
    sectionContainer: {
        marginBottom: 12,
    },
    sectionTitleContainer: {
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderColor: Colors.grey50,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.dark20,

    },
    sectionContent: {
        fontSize: 16,
        color: Colors.dark30,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    ingredientText: {
        fontSize: 16,
        color: Colors.dark30,
        marginLeft: 10,
    },
    bottomBar: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bottomButton: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomButtonTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 8
    },

});

export default FoodScreen;    