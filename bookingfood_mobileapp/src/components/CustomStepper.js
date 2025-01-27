import React from 'react';
import { StyleSheet, } from 'react-native';
import { TouchableOpacity, Text, Colors, Badge, View } from 'react-native-ui-lib';

const CustomStepper = ({ value, minValue, maxValue, onValueChange, showBackground }) => {
    const decrement = () => {
        if (value > minValue) {
            onValueChange(value - 1);
        }
    }

    const increment = () => {
        if (value < maxValue) {
            onValueChange(value + 1);
        }
    }

    return (
        <TouchableOpacity backgroundColor={showBackground ? Colors.grey70 : Colors.transparent} style={showBackground ? styles.paddingContainer : { padding: 0 }}>
            <View style={styles.stepper}>
                <TouchableOpacity onPress={decrement}>
                    <Badge
                        label="-"
                        size={25}
                        labelStyle={[styles.labelStyle, { color: Colors.grey40 }]}
                        borderWidth={1}
                        backgroundColor={Colors.white}
                        borderColor={Colors.grey40}
                    />
                </TouchableOpacity>
                <View center flex-1>
                    <Text style={styles.value}>{value}</Text>
                </View>
                <TouchableOpacity onPress={increment}>
                    <Badge
                        label="+"
                        size={25}
                        labelStyle={styles.labelStyle}
                        backgroundColor={Colors.yellow20}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default CustomStepper;

const styles = StyleSheet.create({
    paddingContainer: {
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 12
    },
    stepper: {
        width: 90,
        flexDirection: 'row'
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.grey10,
        textAlign: 'center'
    },
    labelStyle: {
        marginTop: 5,
        fontSize: 20
    }
});
