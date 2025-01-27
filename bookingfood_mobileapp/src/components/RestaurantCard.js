import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors, Text, View, Card, TouchableOpacity, Image } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';

const RestaurantCard = ({ item, navigation }) => {
    return (
        <TouchableOpacity onPress={() => { navigation.navigate('Restaurant', { restaurantId: item.id }) }}>
            <Card key={item.id} style={styles.popularRestaurantCard}>
                <Image source={item.image} resizeMode="cover" style={styles.popularRestaurantImage} />
                <View padding-10>
                    <Text marginB-3 style={{ fontSize: 18, fontWeight: 600 }}>{item.name}</Text>
                    <View row centerV>
                        <Icon name="star" size={24} color={Colors.yellow20} />
                        <Text text70 marginL-3>{item.rating}</Text>
                        <Text grey40 text70 marginL-3>({item.reviewCount} đánh giá)</Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    )
}

export default RestaurantCard

const styles = StyleSheet.create({
    popularRestaurantCard: {
        width: 200,
        marginRight: 12,
        overflow: 'hidden',
    },
    popularRestaurantImage: {
        height: 120,
        width: '100%',
        borderRadius: 10,
    }
})