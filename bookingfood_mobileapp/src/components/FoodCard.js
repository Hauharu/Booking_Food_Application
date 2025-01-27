import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Colors, Text, View, Image, TouchableOpacity, Card } from 'react-native-ui-lib';
import CustomStepper from './CustomStepper';
import { MaterialIcons } from '@expo/vector-icons';
const FoodCard = ({
    item,
    navigation,
    showQuantity,
    initialQuantity = 0,
    onQuantityChange,
    showDeleteButton = false
}) => {

    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);

    const handleQuantity = (value) => {
        setQuantity(value)
        onQuantityChange(value)
    }

    const handelDelete = () => {
        setQuantity(0)
        onQuantityChange(0)
    }

    return (
        <View>
            <TouchableOpacity onPress={() => { navigation.navigate('Food', { foodId: item.id }) }} key={item.id} marginB-12>
                <Card row padding-8 centerV>
                    <View paddingB-4 style={{ aspectRatio: 1 }}>
                        <Image source={item.image} style={styles.image} />
                    </View>
                    <View paddingL-15 >
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
                        <View row centerV>
                            <Text style={styles.price}>{item.price.toLocaleString()} VNĐ</Text>
                            {showQuantity === true &&
                                <CustomStepper
                                    onValueChange={(value) => handleQuantity(value)}
                                    minValue={0}
                                    maxValue={10}
                                    value={quantity}
                                />
                            }
                        </View>
                        {showDeleteButton === true &&
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handelDelete()}>
                                <MaterialIcons name="delete" size={28} color={Colors.grey30} />
                            </TouchableOpacity>
                        }
                    </View>
                </Card>
            </TouchableOpacity>
        </View>
    )
}

export default FoodCard;

const styles = StyleSheet.create({
    name: {
        fontSize: 20,
        fontWeight: 600,
        width: 200
    },
    image: {
        borderRadius: 10,
        width: 100,
        height: 100
    },
    description: {
        fontSize: 14,
        color: Colors.grey40,
        marginVertical: 6,
        width: 200
    },
    price: {
        fontSize: 18,
        fontWeight: 600,
        color: Colors.yellow10,
        marginRight: 54 //
    },
    deleteButton: {
        position: 'absolute',
        right: 0,
        top: 0
    }
})