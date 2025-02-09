import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors, Text, View, Image, TouchableOpacity, Card } from 'react-native-ui-lib';
import HTML from 'react-native-render-html';
import Styles from "./Styles";
import foodDetailStyles from "./FoodDetailStyles";
import FoodDetailStyles from "./FoodDetailStyles";

const FoodCard = ({ item, navigation }) => {
    return (
        <TouchableOpacity onPress={() => { navigation.navigate('FoodDetail', { foodId: item.id }) }} key={item.id} marginB-12>
            <Card row padding-8 centerV>
                <View style={Styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={Styles.image} />
                </View>
                <View style={FoodDetailStyles.infoContainer1}>
                    <Text style={Styles.name} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                    {/*<HTML*/}
                    {/*    source={{ html: item.description || '' }}*/}
                    {/*    contentWidth={200}*/}
                    {/*    tagsStyles={{*/}
                    {/*        p: { fontSize: 14, color: Colors.grey40, marginVertical: 6 },*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <View row centerV>
                        {/* Format the price with commas */}
                        <Text
                            style={foodDetailStyles.foodPrice}> {parseInt(item.price).toLocaleString('en-US')} VND
                        </Text>
                    </View>
                    <View row centerV>
                        <Text style={[
                            FoodDetailStyles.foodStatus1,
                            { color: item.status === "available" ? "green" : "red" }
                        ]}>
                            {item.status === "available" ? "Còn đồ ăn" : "Hết đồ ăn"}
                        </Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
};

export default FoodCard;

const styles = StyleSheet.create({
    imageContainer: {
        aspectRatio: 1,
        paddingBottom: 4,
    },
    image: {
        borderRadius: 10,
        width: 100,
        height: 100,
    },
    infoContainer: {
        paddingLeft: 15,
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        width: 200,
    },
    description: {
        fontSize: 14,
        color: Colors.grey40,
        marginVertical: 6,
        width: 200,
    },
    price: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.yellow10,
        marginRight: 54,
    },
});
