import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors, Text, View, Badge, Card, TouchableOpacity, Image } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';

const RestaurantItem = ({ item, navigation }) => {
    return (
        <TouchableOpacity onPress={() => { navigation.navigate('Restaurant', { restaurantId: item.id }) }} key={item.id} marginB-12 >
            <Card row padding-8>
                <View paddingB-4 style={{ aspectRatio: 1 }}>
                    <Image source={item.image} width='100%' height='100%' style={{ borderRadius: 10 }} />
                </View>
                <View paddingL-15>
                    <Text style={{ fontSize: 18, fontWeight: 600 }}>{item.name}</Text>
                    <View row marginT-5>
                        <View row centerV>
                            <Icon name="star" size={18} color={Colors.yellow20} />
                            <Text marginL-3>{item.rating}</Text>
                        </View>
                        <View row centerV marginL-12 >
                            <Icon name="map-marker" size={14} color={Colors.dark10} />
                            <Text marginL-3>{`${item.distance} km`}</Text>
                        </View>
                        <View row centerV marginL-12 >
                            <Icon name="clock-o" size={14} color={Colors.dark10} />
                            <Text marginL-3>{`${item.deliveryTime} phút`}</Text>
                        </View>
                    </View>
                    <View row marginT-5>
                        {item.tags.map((tag) => (
                            <Badge key={tag} label={tag} backgroundColor={Colors.green70} labelStyle={{ color: Colors.dark10 }} marginR-5 />
                        ))}
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({});

export default RestaurantItem
