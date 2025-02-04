import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState, useContext } from "react";
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import styles from "../Home/ShoppingCartStyles";
import { MyUserContext } from "../../configs/UserContexts";
import APIs, { endpoints } from "../../configs/APIs";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const { user } = useContext(MyUserContext);
  const navigation = useNavigation();

  const loadUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("user_id");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        setUserId(null);
      }
    } catch (error) {
      console.error("Error loading user ID:", error);
      Alert.alert("Lỗi", "Không thể xác định người dùng. Vui lòng thử lại!");
    }
  };

  const loadCartItems = async () => {
    if (!userId) {
      return;
    }

    try {
      const storedCart = await AsyncStorage.getItem(`shoppingCart_${userId}`);
      setCartItems(storedCart ? JSON.parse(storedCart) : []);
    } catch (error) {
      console.error("Error loading cart items:", error);
      Alert.alert("Lỗi", "Không thể tải giỏ hàng. Vui lòng thử lại!");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCart); 
      await AsyncStorage.setItem(`shoppingCart_${userId}`, JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error removing item:", error);
      Alert.alert("Lỗi", "Không thể xóa sản phẩm. Vui lòng thử lại!");
    }
  };

  const handleCreateBill = async () => {
    const storedCart = await AsyncStorage.getItem(`shoppingCart_${userId}`);
    const cartItems = storedCart ? JSON.parse(storedCart) : []; 
    
    if (cartItems.length > 0) {
      const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      const form = new FormData();
      form.append("user", user.id.toString());
      form.append("total_price", totalPrice);
      form.append("payment_method", "money");
      form.append("status", "pending");
  
      try {
        const orderResponse = await APIs.post(endpoints["order"], form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        if (orderResponse && orderResponse.data.id) {
          const orderId = orderResponse.data.id;
  
          for (const item of cartItems) {
            const orderItemForm = new FormData();
            orderItemForm.append("order", orderId);
            orderItemForm.append("product", item.id);
            orderItemForm.append("quantity", item.quantity);
            orderItemForm.append("price", parseFloat(item.price).toFixed(2));
  
            await APIs.post(endpoints["order-item"], orderItemForm, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          }
  
          


          // Chuyển đến trang hóa đơn
          navigation.navigate("Bill", { orderId: orderId });
        } else {
          Alert.alert("Lỗi", "Không thể tạo đơn hàng!");
        }
      } catch (error) {
        console.error("Error creating order:", error);
        Alert.alert("Lỗi", "Không thể tạo đơn hàng!");
      }
    } else {
      Alert.alert("Thông báo", "Giỏ hàng trống!");
    }
  };
  
  
  useFocusEffect(
    React.useCallback(() => {
      loadUserId();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        loadCartItems();
      }
    }, [userId, cartItems])
  );

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Giỏ Hàng</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text>Số lượng: {item.quantity}</Text>
              <Text>Giá: {item.price} VND</Text>
              <Text>Tổng: {item.price * item.quantity} VND</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveItem(item.id)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.totalPrice}>Tổng cộng: {getTotalPrice()} VND</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => handleCreateBill()}
        >
          <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShoppingCart;
