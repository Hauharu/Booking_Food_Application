import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { TextInput, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RestaurantStyles from "./AddFoodStyles";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import APIs, { endpoints } from "../../configs/APIs";

const AddFood = ({ route, navigation }) => {
  const { onGoBack } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [storeLoading, setStoreLoading] = useState(true);
  const [storeId, setStoreId] = useState(null);
  const [food, setFood] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [menuItem, setMenuItem] = useState([]);

  const [openTime, setTimeOpen] = useState(false);
  const [valueTime, setTimeValue] = useState(null);
  const [timeItems, setTimeItems] = useState([
    { label: "Sáng", value: "Sáng" },
    { label: "Trưa", value: "Trưa" },
    { label: "Chiều", value: "Chiều" },
    { label: "Tối", value: "Tối" },
    { label: "Cả ngày", value: "Cả ngày" },
  ]);

  const [openCategory, setCategoryOpen] = useState(false);
  const [valueCategory, setCategoryValue] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);

  const [image, setImage] = useState(null);

  const updateFood = (value, field) => {
    setFood({ ...food, [field]: value });
  };

  const foods = {
    name: {
      title: "Tên món ăn",
      field: "name",
      keyboardType: "default",
    },
    price: {
      title: "Giá tiền",
      field: "price",
      keyboardType: "numeric",
    },
    description: {
      title: "Mô tả món ăn",
      field: "description",
      keyboardType: "default",
    },
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Quyền truy cập thư viện ảnh bị từ chối!");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await APIs.get(endpoints["current-user"], {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.store) {
        setStoreId(response.data.store);
      } else {
        Alert.alert("Lỗi", "Người dùng không có cửa hàng.");
      }
    } catch (error) {
      console.error(
          "Error fetching current user:",
          error.response ? error.response.data : error.message
      );
      Alert.alert("Lỗi", "Không thể tải thông tin người dùng.");
    } finally {
      setStoreLoading(false);
    }
  };

  const loadMenus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await APIs.get(
          `${endpoints["current-store-menu"](storeId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      const menuData = response.data.map((menu) => ({
        label: menu.name,
        value: menu.id,
      }));

      setMenuItem(menuData);
    } catch (error) {
      console.error(
          "Error loading menus:",
          error.response ? error.response.data : error.message
      );
      Alert.alert("Lỗi", "Không thể tải danh sách menu.");
    }
  };

  const loadCategories = async () => {
    try {
      const response = await APIs.get(endpoints["categories"], {
      });

      console.log(response.data);
      const categoryData = response.data.results.map((category) => ({
        label: category.name,
        value: category.id,
      }));

      setCategoryItems(categoryData);
    } catch (error) {
      console.error(
          "Error loading categories:",
          error.response ? error.response.data : error.message
      );
      Alert.alert("Lỗi", "Không thể tải danh sách danh mục.");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    loadCategories();
  }, []);

  useEffect(() => {
    if (storeId) {
      loadMenus();
    }
  }, [storeId]);

  const addFood = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const form = new FormData();

      for (let f in food) {
        form.append(f, food[f]);
      }

      if (value) {
        form.append("menu_id", value);
      }

      if (valueCategory) {
        form.append("categories", valueCategory); // Append selected category ID
      }

      form.append("serve_period", valueTime || "Cả ngày");
      form.append("is_available", true);

      if (image) {
        form.append("image", {
          uri: image.uri,
          name: image.uri.split("/").pop(),
          type: "image/png",
        });
      }

      const response = await APIs.post(`${endpoints["foodm"]}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        Alert.alert("Thành công", "Món ăn mới đã được thêm!");
        setFood({ name: "", price: "", description: "" });
        setImage(null);
        setValue(null);
        setValueTime(null);
        setCategoryValue(null);
        if (onGoBack) onGoBack();
        navigation.goBack();
      }
    } catch (ex) {
      if (ex.response) {
        console.error("Server trả về lỗi:", ex.response.data);
        Alert.alert("Lỗi", ex.response.data.detail || "Không thể thêm món ăn.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (storeLoading) {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Đang tải thông tin cửa hàng...</Text>
        </View>
    );
  }

  return (
      <View style={{ flex: 1, padding: 10 }}>
        <ScrollView nestedScrollEnabled={true}>
          {Object.values(foods).map((f) => (
              <View key={f.field}>
                <Text
                    style={{
                      marginTop: 5,
                      fontSize: 17,
                      fontWeight: "bold",
                      marginBottom: 5,
                    }}
                >
                  {f.title}:
                </Text>
                <TextInput
                    style={RestaurantStyles.inputMargin}
                    mode="outlined"
                    value={food[f.field]}
                    keyboardType={f.keyboardType}
                    onChangeText={(text) => updateFood(text, f.field)}
                />
              </View>
          ))}

          <View style={RestaurantStyles.dropDownStyle}>
            <Text
                style={{
                  marginTop: 5,
                  fontSize: 17,
                  fontWeight: "bold",
                  marginBottom: 5,
                }}
            >
              Hình ảnh:
            </Text>
            <Button mode="outlined" onPress={pickImage}>
              Chọn hình ảnh
            </Button>
            {image ? (
                <Image
                    source={{ uri: image.uri }}
                    style={{
                      width: 100,
                      height: 100,
                      margin: 10,
                      borderRadius: 15,
                      alignSelf: "center",
                    }}
                />
            ) : null}
          </View>

          <Text
              style={{
                marginTop: 5,
                fontSize: 17,
                fontWeight: "bold",
                marginBottom: 5,
              }}
          >
            Menu:
          </Text>
          <View style={RestaurantStyles.dropDownStyle}>
            <DropDownPicker
                style={{ marginTop: 10 }}
                open={open}
                value={value}
                items={menuItem}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setMenuItem}
                listMode="SCROLLVIEW"
                placeholder="Chọn menu"
                zIndex={3000}
                zIndexInverse={1000}
            />
          </View>

          <Text
              style={{
                marginTop: 5,
                fontSize: 17,
                fontWeight: "bold",
                marginBottom: 5,
              }}
          >
            Thời điểm bán:
          </Text>
          <View style={RestaurantStyles.dropDownStyle}>
            <DropDownPicker
                style={{ marginTop: 10 }}
                open={openTime}
                value={valueTime}
                items={timeItems}
                setOpen={setTimeOpen}
                setValue={setTimeValue}
                setItems={setTimeItems}
                listMode="SCROLLVIEW"
                placeholder="Chọn thời điểm bán"
                zIndex={2000}
                zIndexInverse={2000}
            />
          </View>

          <Text
              style={{
                marginTop: 5,
                fontSize: 17,
                fontWeight: "bold",
                marginBottom: 5,
              }}
          >
            Danh mục:
          </Text>
          <View style={RestaurantStyles.dropDownStyle}>
            <DropDownPicker
                style={{ marginTop: 10 }}
                open={openCategory}
                value={valueCategory}
                items={categoryItems}
                setOpen={setCategoryOpen}
                setValue={setCategoryValue}
                setItems={setCategoryItems}
                listMode="SCROLLVIEW"
                placeholder="Chọn danh mục"
                zIndex={1000}
                zIndexInverse={3000}
            />
          </View>

          <Button
              icon="plus"
              mode="contained"
              style={[RestaurantStyles.addBtn, { marginTop: 20 }]}
              onPress={addFood}
              loading={loading}
              disabled={loading}
          >
            Thêm
          </Button>
        </ScrollView>
      </View>
  );
};

export default AddFood;