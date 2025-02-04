import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { endpoints, BASE_URL } from "../../configs/APIs";
import styles from "./AddProductStyles";
import { Picker } from "@react-native-picker/picker";

const AddProduct = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStore, setSelectedStore] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await APIs.get(endpoints.categories);
      const data = response.data;
      if (Array.isArray(data.results) && data.results.length > 0) {
        setCategories(data.results);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([]);
    }
  };

  const fetchStores = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      const response = await APIs.get(endpoints.stores, {
        params: { seller: userId },
      });
      if (Array.isArray(response.data.results) && response.data.results.length > 0) {
        const filteredStores = response.data.results.filter(
          (store) => store.seller.toString() === userId
        );
        setStores(filteredStores);
      } else {
        setStores([]);
      }
    } catch (error) {
      console.error("Error loading stores:", error);
      setStores([]);
    }
  };

  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access the image library is required.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0]);
    }
  };

  const addProduct = async () => {
    if (
      !name ||
      !description ||
      !price ||
      !stockQuantity ||
      !selectedStore ||
      !selectedCategory
    ) {
      Alert.alert("Error", "Please fill in all product details!");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You are not logged in!");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock_quantity", stockQuantity);
      formData.append("active", "True");
      formData.append("rating", "3");
      formData.append("store", selectedStore);
      formData.append("category", selectedCategory);

      if (avatar) {
        const filename = avatar.uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";
        formData.append("image", {
          uri: avatar.uri,
          name: filename,
          type,
        });
      }

      const response = await fetch(`${BASE_URL}/products/`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Error parsing response:", e);
        responseData = {};
      }

      if (response.ok) {
        Alert.alert("Success", "Product has been added!");
        navigation.goBack();
      } else {
        Alert.alert("Error", responseData.message || "Failed to add product!");
      }
    } catch (error) {
      console.error("Connection error:", error);
      Alert.alert("Error", "Unable to connect to server!");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories]);

  useEffect(() => {
    if (stores.length > 0) {
      setSelectedStore(stores[0].id);
    }
  }, [stores]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm sản phẩm</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá"
        keyboardType="numeric"
        value={price}
        onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ""))}
      />
      <TextInput
        style={styles.input}
        placeholder="Số lượng tồn kho"
        keyboardType="numeric"
        value={stockQuantity}
        onChangeText={(text) => setStockQuantity(text.replace(/[^0-9]/g, ""))}
      />

      <Text style={styles.label}>Cửa hàng</Text>
      <Picker
        selectedValue={selectedStore}
        onValueChange={(itemValue) => setSelectedStore(itemValue)}
        style={styles.picker}
      >
        {stores.length > 0 ? (
          stores.map((store) => (
            <Picker.Item key={store.id} label={store.name} value={store.id} />
          ))
        ) : (
          <Picker.Item label="No stores available" value="" />
        )}
      </Picker>

      <Text style={styles.label}>Danh mục</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        {categories.length > 0 ? (
          categories.map((category) => (
            <Picker.Item key={category.id} label={category.name} value={category.id} />
          ))
        ) : (
          <Picker.Item label="No categories available" value="" />
        )}
      </Picker>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar.uri }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Chọn ảnh</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={addProduct}>
        <Text style={styles.buttonText}>Thêm sản phẩm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddProduct;
