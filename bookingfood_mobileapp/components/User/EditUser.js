import { View, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect, useContext } from "react";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import styles from "../User/EditUserStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatchContext } from "../../configs/UserContexts"; // Import the dispatch context

const EditUser = () => {
    const [user, setUser] = useState({
        "username": "",
        "email": "",
        "first_name": "",
        "last_name": "",
        "phone": "",
        "password": "",
        "confirm": ""
    });
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const dispatch = useContext(MyDispatchContext); // Use the dispatch context

    useEffect(() => {
        const fetchUserData = async () => {
            const token = await AsyncStorage.getItem("token");
            try {
                const api = await authApis(token);
                const response = await api.get(endpoints['current-user']);
                setUser(response.data);
                if (response.data.avatar) {
                    setAvatar({ uri: response.data.avatar });
                }
            } catch (error) {
                console.log("Lỗi khi tải dữ liệu người dùng:", error.response?.data || error.message);
            }
        };
        fetchUserData();
    }, []);

    const updateUser = (value, field) => setUser({ ...user, [field]: value });

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return alert("Bạn cần cấp quyền để chọn ảnh.");

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.Images,
            allowsEditing: true, aspect: [1, 1], quality: 0.8
        });

        if (!result.canceled) setAvatar(result.assets[0]);
    };

    const updateUserDetails = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        try {
            const form = new FormData();
            Object.keys(user).forEach(key => {
                if (key !== 'confirm') form.append(key, user[key]);
            });
            if (avatar) form.append('avatar', { uri: avatar.uri, name: 'avatar.jpg', type: 'image/jpeg' });

            const api = await authApis(token);
            const response = await api.patch(endpoints['current-user'], form, {
                headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' },
            });

            Alert.alert("Thành công", "Cập nhật thông tin thành công.");
            dispatch({ type: "update_user", payload: response.data }); // Update user context
            nav.goBack();
        } catch (error) {
            console.log("Lỗi cập nhật:", error.response?.data || error.message);
            Alert.alert("Lỗi", error.response?.data?.message || "Thông tin không hợp lệ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}>
            <Text style={styles.title}>Chỉnh sửa thông tin người dùng</Text>
            <TextInput mode="outlined" label="Tên" value={user.first_name} onChangeText={(t) => updateUser(t, 'first_name')} style={styles.input} />
            <TextInput mode="outlined" label="Họ và tên lót" value={user.last_name} onChangeText={(t) => updateUser(t, 'last_name')} style={styles.input} />
            <TextInput mode="outlined" label="Tên đăng nhập" value={user.username} onChangeText={(t) => updateUser(t, 'username')} style={styles.input} />
            <TextInput mode="outlined" label="Email" keyboardType="email-address" value={user.email} onChangeText={(t) => updateUser(t, 'email')} style={styles.input} />
            <TextInput mode="outlined" label="Số điện thoại" keyboardType="phone-pad" value={user.phone} onChangeText={(t) => updateUser(t, 'phone')} style={styles.input} />
            <TextInput mode="outlined" label="Mật khẩu mới" secureTextEntry value={user.password} onChangeText={(t) => updateUser(t, 'password')} style={styles.input} />
            <TextInput mode="outlined" label="Xác nhận mật khẩu" secureTextEntry value={user.confirm} onChangeText={(t) => updateUser(t, 'confirm')} style={styles.input} />

            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                <Text style={styles.imagePickerText}>Chọn ảnh đại diện</Text>
            </TouchableOpacity>
            {avatar && <Image source={{ uri: avatar.uri }} style={styles.avatar} />}

            <Button mode="contained" onPress={updateUserDetails} loading={loading} style={styles.button}>
                Cập nhật
            </Button>
        </ScrollView>
    );
};

export default EditUser;
