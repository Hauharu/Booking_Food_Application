import React, { useState } from 'react';
import { StyleSheet, StatusBar, ScrollView, FlatList } from 'react-native';
import { Constants, Colors, Text, View, SegmentedControl, TouchableOpacity, Button } from 'react-native-ui-lib';
import { HomeHeader, RestaurantItem, FoodCard } from '../components';
import { RESTAURANTS, FOODS, CATEGORIES } from '../data'
import { useSelector } from 'react-redux';

const FavoritesScreen = ({ navigation }) => {
    const favRestaurants = useSelector(state => state.favRestaurants)
    const favFoods = useSelector(state => state.favFoods)
    return (
        <View flex-1>
            <StatusBar barStyle="light-content"
                backgroundColor={Colors.primary}
                translucent
            />
            {(favRestaurants.length !== 0 || favFoods.length !== 0) &&
                <ScrollView>
                    <View paddingH-12>
                        {favRestaurants.length !== 0 &&
                            <View>
                                <View row flex spread marginV-10>
                                    <Text text60 grey10>Các quán yêu thích</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate("Xem tất cả")}>
                                        <Text text80 green10>Xem tất cả</Text>
                                    </TouchableOpacity>
                                </View>

                                <FlatList
                                    data={favRestaurants}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <RestaurantItem key={item.id} item={item} navigation={navigation} />
                                    )}
                                    scrollEnabled={false}
                                />
                            </View>
                        }
                        {favFoods.length !== 0 &&
                            <View marginT-3>
                                <View row flex spread marginV-10>
                                    <Text text60 grey10>Các món ăn yêu thích</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate("Xem tất cả")}>
                                        <Text text80 green10>Xem tất cả</Text>
                                    </TouchableOpacity>
                                </View>

                                <FlatList
                                    data={favFoods}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) =>
                                        <FoodCard key={item.id} item={item} navigation={navigation} />
                                    }
                                    scrollEnabled={false}
                                />
                            </View>
                        }
                    </View>
                </ScrollView>
            }
            {favRestaurants.length === 0 && favFoods.length === 0 &&
                <View flex-1 center>
                    <Text text60M center marginH-20 marginB-16>Chưa có địa điểm và món ăn nào được thêm vào yêu thích!</Text>
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
    segmentedControlContainer: {
        marginBottom: 8
    },
    segmentedControlText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    segmentedControlActiveText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default FavoritesScreen;