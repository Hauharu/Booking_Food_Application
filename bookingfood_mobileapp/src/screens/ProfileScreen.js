import React from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';
import { View, Button, Text, Card, Colors, Avatar } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';

const ProfileScreen = ({ navigation }) => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const user = {
        id: 1,
        phoneNumber: '+8412345678',
        email: 'test@gmail.com',
        fullName: 'Nguyễn Trung Hậu',
        address: 'Mỏ Cày Nam, Bến Tre',
        avatar: require('../assets/images/profile.png'),
    };

    const handleEditProfile = () => {

    };

    const handleLogout = () => {
        navigation.navigate('Login')
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {isLoggedIn ? (
                <Card margin-10 padding-20 borderRadius={10}>
                    <View center>
                        <Avatar source={user.avatar} size={80} />
                        <Text text60 marginT-10>
                            {user.fullName}
                        </Text>
                        <Text text70 marginT-5>
                            {user.email}
                        </Text>
                        <Text text70 marginT-5>
                            {user.phoneNumber}
                        </Text>
                        <Text text70 marginT-5>
                            {user.address}
                        </Text>
                    </View>

                    <View marginT-20>
                        <Button
                            label="Chỉnh sửa thông tin"
                            backgroundColor={Colors.primary}
                            onPress={handleEditProfile}
                        />
                        <Button
                            label="Đăng xuất"
                            backgroundColor={Colors.red30}
                            marginT-10
                            onPress={handleLogout}
                        />
                    </View>
                </Card>
            ) : (
                <View center flex-1>
                    <Text text40 marginB-20>
                        Xin chào!
                    </Text>
                    <View marginB-20>
                        <Button
                            label="Đăng nhập"
                            backgroundColor={Colors.primary}
                            onPress={() => navigation.navigate('Login')}
                        />
                    </View>
                    <Button
                        label="Đăng ký"
                        backgroundColor={Colors.primary}
                        onPress={() => navigation.navigate('Register')}
                    />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
});

export default ProfileScreen;
