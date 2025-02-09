import React, { useState, useEffect } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { HelperText, TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./RegisterStyles";
import { useNavigation } from "@react-navigation/native";
import APIs, { authApis, endpoints } from "../../configs/APIs";

const RestaurantRegister = () => {
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
    const [restaurant, setRestaurant] = useState({
        name: "",
        description: "",
        address_line: "",
    });
    const [image, setImage] = useState(null);

    const fields = [
        { title: "Nhập tên nhà hàng", field: "name", secure: false },
        { title: "Nhập mô tả", field: "description", secure: false },
        { title: "Nhập địa chỉ", field: "address_line", secure: false },
    ];

    const updateRestaurant = (value, field) => {
        setRestaurant({ ...restaurant, [field]: value });
    };

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Vui lòng cấp quyền truy cập vào thư viện ảnh!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const registerRestaurant = async () => {
        const token =  await AsyncStorage.getItem("token");
        try {
            setLoading(true);

            if (!restaurant.name || !restaurant.description || !restaurant.address_line || !image) {
                Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin và chọn hình ảnh!");
                setLoading(false);
                return;
            }

            const form = new FormData();
            form.append("name", restaurant.name);
            form.append("description", restaurant.description);
            form.append("address_line", restaurant.address_line);
            form.append("image", {
                uri: image.uri,
                name: `restaurant_${Date.now()}.jpg`,
                type: "image/jpeg",
            });

            const api = await authApis(token);
            console.log("🔹 FormData chuẩn bị gửi:", form);

            const res = await api.post(endpoints['store'], form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // On successful registration, call the handleRegisterSuccess function
            Alert.alert("Thành công", "Đăng ký thành công!", [
                {
                    text: "OK",
                    onPress: () => nav.goBack()
                }
            ]);

        } catch (error) {
            console.error("❌ Lỗi:", error.response?.data || error.response?.status || error.message);
        } finally {
            setLoading(false);
        }
    };

    const hasError = (field) => {
        const value = restaurant[field] || "";
        if (!value) return "Trường này không được để trống!";
        return null;
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {fields.map(f => (
                    <View key={f.field} style={{ width: '100%' }}>
                        <TextInput
                            label={f.title}
                            secureTextEntry={f.secure}
                            mode="outlined"
                            style={styles.RegisterInput}
                            placeholder={f.title}
                            value={restaurant[f.field]}
                            onChangeText={t => updateRestaurant(t, f.field)}
                        />
                        <HelperText type="error" visible={!!hasError(f.field)}>
                            {hasError(f.field)}
                        </HelperText>
                    </View>
                ))}

                <View style={{ marginBottom: 15 }}>
                    {image && (
                        <Image
                            source={{ uri: image.uri }}
                            style={{ width: 150, height: 150, borderRadius: 15, borderWidth: 2, borderColor: '#ddd', marginBottom: 10 }}
                        />
                    )}
                    <Button mode="contained" onPress={pickImage}>Chọn hình ảnh nhà hàng</Button>
                </View>

                <TouchableOpacity onPress={registerRestaurant} style={styles.RegisterButton} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.logoutText}>Đăng ký cửa hàng</Text>}
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RestaurantRegister;