import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, StatusBar, ScrollView, Alert } from 'react-native';
import { View, Text, Image, Colors, Badge, TouchableOpacity } from 'react-native-ui-lib';
import { FoodCard } from '../components'
import { RESTAURANTS, FOODS, CATEGORIES } from '../data'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

const RestaurantScreen = ({ navigation, route }) => {
    // Lấy ra nhà hàng
    const { restaurantId } = route.params;
    // Lấy ra trạng thái nhà hàng
    const availableRestaurants = useSelector(state => state.filterRestaurants)
    const restaurant = availableRestaurants.find(item => item.id == restaurantId)
    // Lấy ra trạng thái các món ăn
    const availableFoods = useSelector(state => state.filterFoods)
    const foods = availableFoods.filter(item => item.restaurantId == restaurantId)

    const dispatch = useDispatch();

    // Lấy ra nhà hàng yêu thích và thêm vào yêu thích
    const isFav = useSelector(state => state.favRestaurants.find(item => item.id == restaurantId))
    const addToFav = () => {
        dispatch({ type: 'TOGGLE_FAVORITE_RESTAURANT', restaurantId: restaurantId })
    }

    // Thay đổi cartItems khi thêm bớt số lượng món ăn
    const [cartItems, setCartItems] = useState([]);
    const onQuantityChange = (foodId, food, quantity) => {
        setCartItems(prevCartItems => {
            const newCartItems = [...prevCartItems];
            const index = newCartItems.findIndex(item => item.foodId === foodId);
            if (index === -1) {
                newCartItems.push({ foodId, quantity, food });
            } else {
                newCartItems[index].quantity = quantity;
            }
            return newCartItems;
        });
    };
    // Thêm vào giỏ hàng
    const addToCart = () => {
        dispatch({ type: 'ADD_MANY_TO_CART', cartItems: cartItems })
    }
    const handleAddToCart = () => {
        console.log(cartItems)
        addToCart();
        navigation.navigate("Cart")
    }

    const [selectedIndex, setSelectedIndex] = useState(0);

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
                    <TouchableOpacity style={{ marginRight: 10 }}>
                        <Ionicons name='search' size={30} color={Colors.white} style={styles.icon} />
                    </TouchableOpacity >
                    <TouchableOpacity>
                        <Ionicons name='share-outline' size={30} color={Colors.white} style={styles.icon} />
                    </TouchableOpacity>
                </View>
            ),
        });
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                display: "none"
            }
        });
        return () => navigation.getParent()?.setOptions({
            tabBarStyle: undefined
        });
    }, [navigation, isFav]);

    return (
        <View flex-1 bg-white>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <ScrollView>
                <Image
                    source={restaurant.image}
                    style={styles.backgroundImage}
                />
                <View style={styles.infoContainer}>
                    <View row spread centerV>
                        <Text style={styles.name}>{restaurant.name}</Text>
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => addToFav()}>
                            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={35} color={Colors.red30} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <Text marginT-10 grey30 text70 >{restaurant.tags.join('  •  ')}</Text>
                    <View row centerV marginT-10>
                        <View row centerV marginR-10>
                            <Icon name="star" size={18} color={Colors.yellow20} />
                            <Text style={[styles.infoText, { fontWeight: 600 }]}>{restaurant.rating}</Text>
                        </View>
                        <Text grey10 text70>{Math.floor(restaurant.reviewCount / 100) * 100}+ đánh giá</Text>
                    </View>
                    <View row spread centerV marginT-6>
                        <View row centerV>
                            <Badge label="$" backgroundColor={Colors.green}></Badge>
                            <Text style={styles.infoText}> Free Delivery</Text>
                        </View>
                        <View row centerV>
                            <Icon name="clock-o" size={20} color={Colors.blue40} style={styles.infoIcon} />
                            <Text style={styles.infoText}>{restaurant.deliveryTime} phút</Text>
                        </View>
                        <TouchableOpacity style={styles.phoneBtn}>
                            <Icon name="phone" size={20} color={Colors.yellow20} />
                            <Text style={[styles.infoText, styles.phoneText]}>Liên Hệ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View flex-1 bg-white paddingH-10>
                    <View style={styles.filterContainer}>
                        <FlatList
                            data={CATEGORIES}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={styles.categoriesContainer}
                            renderItem={({ item }) => (
                                <TouchableOpacity padding-14 onPress={() => setSelectedIndex(`${item.id}`)}>
                                    <Text style={styles.filterTitle} opacity={selectedIndex == item.id ? 1 : 0.3}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <FlatList
                        data={foods}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) =>
                            <FoodCard
                                key={item.id}
                                item={item}
                                navigation={navigation}
                                showQuantity={true}
                                onQuantityChange={value => onQuantityChange(item.id, item, value)}
                            />
                        }
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    onPress={() => handleAddToCart()}
                    backgroundColor={Colors.primary}
                    style={styles.bottomButton}
                >
                    <Icon name='plus' size={20} color={Colors.white}></Icon>
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

export default RestaurantScreen;

const styles = StyleSheet.create({
    backgroundImage: {
        top: 0,
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    infoContainer: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 16,
        paddingTop: 20,
        marginTop: -24,
        flex: 1,
        elevation: 5
    },
    name: {
        fontSize: 24,
        fontWeight: '500',
        color: Colors.dark10
    },
    infoText: {
        marginLeft: 6,
        fontSize: 16,
        color: Colors.dark10,
    },
    tagText: {
        fontSize: 15,
        color: Colors.grey20
    },
    phoneBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: Colors.yellow80,
        borderColor: Colors.yellow40,
    },
    phoneText: {
        color: Colors.yellow20,
        fontWeight: '600',
        marginTop: -2
    },
    filterContainer: {
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        backgroundColor: Colors.yellow60,
        marginTop: 20,
        marginBottom: 12,
        marginRight: -20,
        marginLeft: 6
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark
    },
    bottomBar: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: Colors.white
    },
    bottomButton: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomButtonTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 8
    }
});    