import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, ScrollView, FlatList } from 'react-native';
import { Colors, Text, View, SegmentedControl, TouchableOpacity } from 'react-native-ui-lib';
import { HomeHeader, RestaurantCard, RestaurantItem } from '../components';
import { RESTAURANTS } from '../data';
const HomeScreen = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(1);
    const handleIndexChange = (index) => {
        setSelectedIndex(index);
    };

    useEffect(() => {
        return () => props.navigation.getParent()?.setOptions({
            tabBarStyle: {
                height: 58,
                paddingBottom: 8
            },
        });
    }, [props.navigation]);

    return (
        <View marginB-84>
            <StatusBar barStyle="light-content"
                backgroundColor={Colors.primary}
                translucent
            />
            <HomeHeader navigation={props.navigation} />
            <ScrollView>
                <View paddingH-12>
                    <View marginT-3>
                        <View row flex spread marginV-10>
                            <Text text60 grey10>Các quán nổi bật</Text>
                            <TouchableOpacity onPress={() => props.navigation.navigate("Xem tất cả")}>
                                <Text text80 green10>Xem tất cả</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={RESTAURANTS}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <RestaurantCard key={item.id} item={item} navigation={props.navigation} />
                            )}
                        />
                    </View>

                    <View marginT-16 marginB-125>
                        <SegmentedControl
                            segments={[
                                { label: 'Gần tôi', value: 1 },
                                { label: 'Mới nhất', value: 2 },
                                { label: 'Bán chạy', value: 3 },
                                { label: 'Giảm giá', value: 4 },
                                { label: 'Đánh giá', value: 5 },
                            ]}
                            selectedIndex={selectedIndex}
                            onValueChange={handleIndexChange}
                            activeColor={Colors.primary}
                            borderRadius={10}
                            containerStyle={styles.segmentedControlContainer}
                            textStyle={styles.segmentedControlText}
                            activeTextStyle={styles.segmentedControlActiveText}
                        />
                        <FlatList
                            data={RESTAURANTS}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <RestaurantItem key={item.id} item={item} navigation={props.navigation} />
                            )}
                            scrollEnabled={false}
                        />
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

export default HomeScreen;