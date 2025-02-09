import React, {useState, useContext, useCallback, useEffect} from "react";
import { Alert, FlatList, Image, Text, TouchableOpacity, View, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "../Home/ShoppingCartStyles";
import { MyUserContext } from "../../configs/UserContexts";
import APIs, {authApis, endpoints} from "../../configs/APIs";
import FoodDetailStyles from "./FoodDetailStyles";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(MyUserContext);
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [storeId, setStoreId] = useState(null); // New state for storeId
  const [token, setToken] = useState(null);
  const [addresses, setAddresses] = useState([]);  // State for storing user addresses
  const [selectedAddress, setSelectedAddress] = useState(null); // Selected address from dropdown
  const [refreshing, setRefreshing] = useState(false);  // State for pull-to-refresh
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

  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        setToken(null);
      }
    } catch (error) {
      console.error("Error loading token:", error);
      Alert.alert("Lỗi", "Không thể xác định người dùng. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      const storedToken = await AsyncStorage.getItem("token");
      if (storedUserId && storedToken) {
        setUserId(storedUserId);
        setToken(storedToken);
        loadAddresses(storedToken);  // Fetch user addresses
      }
    };

    loadUserData();
  }, []);

  const loadAddresses = async (token) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const api = await authApis(token)
      const response = await api.get(endpoints["current-user-address"], {
      });
      setAddresses(response.data);  // Store addresses in state
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const loadCart = async () => {
    if (!userId) {
      return;
    }
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const api = await authApis(storedToken);
      const response = await api.get(endpoints["cart"]);
      setCart(response.data.response);

      // Extract and store the storeId
      if (response.data.cart_details.length > 0) {
        const storeId = response.data.cart_details[0].food.store;
        setStoreId(storeId);
      }
    } catch (error) {
      console.error("Error loading cart items:", error);
      Alert.alert("Lỗi", "Không thể tải giỏ hàng. Vui lòng thử lại!");
    }
  };

  const loadCartItems = async () => {
    if (!userId) {
      return;
    }
    try {
      const storedToken = await AsyncStorage.getItem("token");

      const api = await authApis(storedToken);
      const response = await api.get(endpoints["cart"]);
      setCartItems(response.data.cart_details);
    } catch (error) {
      console.error("Error loading cart items:", error);
      // Alert.alert("Lỗi", "Không thể tải giỏ hàng. Vui lòng thử lại!");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const api = await authApis(token);
      const response = await api.delete(endpoints["cart-foodremove"](itemId));

      if (response.status === 204) {
        loadCartItems();
      }
    } catch (error) {
      loadCartItems();
    }
  };

  const handleIncreaseQuantity = async (itemId) => {
    try {
      const api = await authApis(token);
      await api.post(endpoints["cart-increase"](itemId));
      loadCartItems();
    } catch (error) {
      console.error("Error increasing quantity:", error);
      Alert.alert("Lỗi", "Không thể tăng số lượng. Vui lòng thử lại!");
    }
  };

  const handleDecreaseQuantity = async (itemId) => {
    try {
      const api = await authApis(token);
      await api.post(endpoints["cart-decrease"](itemId));
      loadCartItems();
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      Alert.alert("Lỗi", "Không thể giảm số lượng. Vui lòng thử lại!");
    }
  };

  const handleCreateBill = async () => {
    if (cartItems.length > 0) {
      if (!selectedAddress) {
        Alert.alert("Thông báo", "Vui lòng chọn địa chỉ giao hàng!");
        return;
      }

      const totalPrice = cartItems.reduce((total, item) => total + item.food.price * item.quantity, 0);

      const orderData = {
        // user: userId,
        address: selectedAddress,
        store: storeId,
        delivery_fee: 15000,
        // items: cartItems.map(item => ({
        //   food: item.food.id,
        //   quantity: item.quantity,
        // })),
      };

      try {
        const response = await APIs.post(endpoints["order-create"], orderData, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
        loadCartItems();

        if (response && response.data.id) {
          const orderId = response.data.id;
          // navigation.navigate("Bill", { orderId: orderId });
        } else {
          Alert.alert("Lỗi", "Không thể tạo đơn hàng!");
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tạo đơn hàng!");
      }
    } else {
      Alert.alert("Thông báo", "Giỏ hàng trống!");
    }
  };

  useFocusEffect(
      React.useCallback(() => {
        const fetchUserAndCart = async () => {
          await loadUserId();
          if (userId) {
            await loadAddresses();
            await loadCart();
            await loadCartItems();
          }
        };

        fetchUserAndCart();
      }, [userId])
  );

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.food.price * item.quantity, 0);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCart();
    await loadAddresses();
    await loadCartItems();
    await loadUserId();
    setRefreshing(false);
  };



  return (
      <View style={styles.container}>
        <Text style={styles.title}> Giỏ Hàng Của Bạn</Text>
        <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  <Image source={{ uri: item.food.image }} style={styles.itemImage} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.food.name}</Text>
                    <Text>Số lượng: {item.quantity}</Text>
                    <Text>Giá: {parseInt(item.food.price).toLocaleString('en-US')} VND</Text>
                    <Text>Tổng: {parseInt(item.food.price * item.quantity).toLocaleString('en-US')} VND</Text>
                  </View>

                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        onPress={() => handleRemoveItem(item.id)}
                        style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>Xóa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleDecreaseQuantity(item.id)}
                        style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.itemQuantity}>{item.quantity}</Text>
                    <TouchableOpacity
                        onPress={() => handleIncreaseQuantity(item.id)}
                        style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            )}
        />
        {/* Address Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Chọn địa chỉ giao hàng:</Text>
          <Picker
              selectedValue={selectedAddress}
              onValueChange={(itemValue) => setSelectedAddress(itemValue)}
          >
            <Picker.Item label="Chọn địa chỉ" value={null} />
            {addresses.map((address) => (
                <Picker.Item
                    key={address.id}  // Ensure this is unique for each item
                    label={address.address_ship}
                    value={address.id}
                />
            ))}
          </Picker>
        </View>

        <View style={styles.footer}>
          <Text style={FoodDetailStyles.foodPrice}>Tổng cộng: {parseInt(getTotalPrice()).toLocaleString('en-US')} VND


          </Text>
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
