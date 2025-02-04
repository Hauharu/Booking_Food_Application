import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import APIs, { BASE_URL, endpoints } from "../../configs/APIs";
import styles from "./CreateStoreStyles";

const CreateStore = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("3");
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Lấy user_id từ AsyncStorage
  const getUserId = async () => {
    const userId = await AsyncStorage.getItem("user_id");
    return parseInt(userId); // Đảm bảo trả về một số
  };

  // Gửi dữ liệu lên API
  const createStore = async () => {
    if (!name || !description) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Lỗi", "Bạn chưa đăng nhập!");
        return;
      }

      const formData = new FormData();
      const userId = await getUserId();  // Lấy id người dùng bất đồng bộ
      formData.append("seller", userId);  // Gửi ID người bán
      formData.append("name", name);
      formData.append("description", description);
      formData.append("rating", rating);
      formData.append("active", "True");

      if (image) {
        const filename = image.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("image", {
          uri: image,
          name: filename,
          type,
        });
      }

      const response = await APIs.post(endpoints['stores'], formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        Alert.alert("Thành công", "Cửa hàng đã được tạo!");
        navigation.goBack();
      } else {
        // const errorData = await response.json();
        console.log("Lỗi kết nối:", errorData.message);
        Alert.alert("Lỗi", errorData.message || "Không thể tạo cửa hàng!");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến server!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo Cửa Hàng</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên cửa hàng"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả cửa hàng"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text>Chọn hình ảnh</Text>
        )}
      </TouchableOpacity>

      <Button
        mode="contained"
        onPress={createStore}
        style={styles.createButton}
      >
        Tạo Cửa Hàng
      </Button>
    </View>
  );
};

export default CreateStore;
