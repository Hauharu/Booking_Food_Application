import React, { useEffect } from 'react';
import { StyleSheet, StatusBar, ScrollView, FlatList } from 'react-native';
import { Colors, Text, View, TouchableOpacity } from 'react-native-ui-lib';
import { RestaurantItem, FoodCard } from '../components';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ShowAllScreen = ({ navigation }) => {
    const restaurants = useSelector(state => state.restaurants)
    const foods = useSelector(state => state.foods)

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View row spread>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} >
                        <MaterialCommunityIcons name="menu" color={Colors.white} size={32} />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate("Home")} center>
                    <MaterialCommunityIcons name="close" color={Colors.white} size={32} />
                </TouchableOpacity>
            )
        })
    }, [navigation])

    return (
        <View>
            <StatusBar barStyle="light-content"
                backgroundColor={Colors.primary}
                translucent
            />
            <ScrollView>
                <View paddingH-12>
                    <View paddingT-12>
                        <View row flex spread marginV-10>
                            <Text text60 grey10>Tất cả quán ăn ({restaurants.length})</Text>
                        </View>
                        {restaurants.length !== 0 &&
                            <FlatList
                                data={restaurants}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <RestaurantItem key={item.id} item={item} navigation={navigation} />
                                )}
                                scrollEnabled={false}
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
                            <Text text60 grey10>Tất cả món ăn ({foods.length})</Text>
                        </View>
                        {foods.length !== 0 &&
                            <FlatList
                                data={foods}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) =>
                                    <FoodCard key={item.id} item={item} navigation={navigation} />
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

export default ShowAllScreen;