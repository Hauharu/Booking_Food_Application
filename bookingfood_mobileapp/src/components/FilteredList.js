import React, { useState } from 'react';
import { StyleSheet, StatusBar, ScrollView, FlatList } from 'react-native';
import { Constants, Colors, Text, View, SegmentedControl, TouchableOpacity } from 'react-native-ui-lib';
import { HomeHeader, RestaurantCard, FoodCard } from '../components';
import { RESTAURANTS, FOODS, CATEGORIES } from '../data'
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FilteredList = (props) => {
    const restaurants = useSelector(state => state.filterRestaurants)
    const foods = useSelector(state => state.filterFoods)
    return (
        <View bg-white>
            <StatusBar barStyle="light-content"
                backgroundColor={Colors.primary}
                translucent
            />
            <ScrollView>
                <View paddingH-12>
                    <View paddingT-12>
                        <View row flex spread marginV-10>
                            <Text text60 grey10>Danh sách quán ăn ({restaurants.length})</Text>
                        </View>
                        {restaurants.length !== 0 &&
                            <FlatList
                                data={restaurants}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <RestaurantCard key={item.id} item={item} navigation={props.navigation} />
                                )}
                            />
                        }
                        {restaurants.length === 0 &&
                            <View>
                                <Text text70>Không tìm thấy!</Text>
                            </View>
                        }
                    </View>
                    <View marginT-3>
                        <View row flex spread marginV-10>
                            <Text text60 grey10>Danh sách món ăn ({foods.length})</Text>
                        </View>
                        {foods.length !== 0 &&
                            <FlatList
                                data={foods}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) =>
                                    <FoodCard key={item.id} item={item} navigation={props.navigation} />
                                }
                                scrollEnabled={false}
                            />
                        }
                        {foods.length === 0 &&
                            <View>
                                <Text text70>Không tìm thấy!</Text>
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
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

export default FilteredList;