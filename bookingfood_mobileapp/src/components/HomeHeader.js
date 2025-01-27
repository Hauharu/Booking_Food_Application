import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Colors, Constants, Text, View, TextField, Badge, TouchableOpacity } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { CATEGORIES } from '../data';

const HomeHeader = ({ navigation }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    return (
        <View style={styles.header}>
            <View row centerV spread paddingH-20>
                <TouchableOpacity onPress={() => navigation.openDrawer()} >
                    <Icon name="menu" color={Colors.white} size={32} />
                </TouchableOpacity>
                <TouchableOpacity row centerV>
                    <Icon name="map-marker" size={18} color={Colors.white} />
                    <Text white text70M marginL-3>
                        Biên Hòa, Đồng Nai
                    </Text>
                    <Icon name="chevron-right" size={18} color={Colors.white} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Icon name="bell" size={24} color={Colors.white} />
                    <Badge label="2" backgroundColor={Colors.yellow20} containerStyle={{ marginRight: 16, position: 'absolute', top: -6, right: -24 }} />
                </TouchableOpacity>
            </View>
            <View row centerV style={styles.searchContainer}>
                <View style={styles.searchIcon}>
                    <Icon name="magnify" size={24} color={Colors.grey10} />
                </View>
                <TextField placeholder="Tìm kiếm món ăn, quán ăn, địa điểm" placeholderTextColor={Colors.grey30} text70M style={styles.searchInput} />
            </View>
            <FlatList
                data={CATEGORIES}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.categoriesContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity centerH marginR-2 onPress={() => setSelectedIndex(`${item.id}`)}>
                        <Icon name={item.icon} size={20} color={Colors.white} opacity={selectedIndex == `${item.id}` ? 1 : 0.7} />
                        <Text text80M marginH-6 marginT-3 color={Colors.white} opacity={selectedIndex == `${item.id}` ? 1 : 0.7}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
export default HomeHeader

const styles = StyleSheet.create({
    header: {
        paddingTop: Constants.statusBarHeight + 10,
        paddingBottom: 10,
        justifyContent: 'space-evenly',
        backgroundColor: '#0a8791'
    },
    searchContainer: {
        backgroundColor: Colors.white,
        borderRadius: 5,
        marginHorizontal: 20,
        marginVertical: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        overflow: 'hidden'
    },
    searchIcon: {
        borderRadius: 5,
        marginRight: 10,
    },
    searchInput: {
        color: Colors.grey10,
    },
    categoriesContainer: {
        paddingHorizontal: 12
    }
});