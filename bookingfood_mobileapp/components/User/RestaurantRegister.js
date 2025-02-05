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
  const [token, setToken] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);  // State to check if already registered

  useEffect(() => {
    const getTokenAndCheckRegistration = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);

      // Check if the restaurant is already registered
      const registered = await AsyncStorage.getItem('restaurantRegistered');
      if (registered === "true") {
        setIsRegistered(true);
      }
    };

    getTokenAndCheckRegistration();
  }, []);

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

  const handleRegisterSuccess = async () => {
    // Mark the restaurant as registered in AsyncStorage
    await AsyncStorage.setItem('restaurantRegistered', "true");

    // Clear the user token from AsyncStorage
    await AsyncStorage.removeItem('userToken');

    // Navigate to the home screen
    nav.replace("Home");
  };

  const registerRestaurant = async () => {
    if (isRegistered) {
      Alert.alert("Thông báo", "Nhà hàng đã được đăng ký rồi!");
      return;
    }

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
        { text: "OK", onPress: handleRegisterSuccess }
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

        <TouchableOpacity onPress={registerRestaurant} style={styles.RegisterButton} disabled={loading || isRegistered}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.logoutText}>{isRegistered ? "Cửa hàng đã đăng ký" : "Đăng ký cửa hàng"}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RestaurantRegister;
