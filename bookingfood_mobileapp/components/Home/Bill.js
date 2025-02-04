import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import { Picker } from '@react-native-picker/picker';
import styles from "../Home/BillStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "../../configs/UserContexts";

const Bill = ({ route }) => {
  const { orderId } = route.params;
  const { user } = useContext(MyUserContext);
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("money");
  const navigation = useNavigation();

  const loadOrderDetails = async () => {
    try {
      const authAPI = await authApis();
      const orderRes = await authAPI.get(endpoints["order"] + orderId);
      const orderData = orderRes.data;
      // console.log("Order Data:", orderData);
      setOrder(orderData);

      const orderItemsRes = await authAPI.get(endpoints["order-item"]);
      const orderItemsData = orderItemsRes.data.results;
      // console.log(orderItemsData)
      // console.log(orderId)
      const filteredOrderItems = orderItemsData.filter(item => item.order === orderId);
      setOrderItems(filteredOrderItems);
    } catch (error) {
      console.error("Error loading order details:", error);
    }
  };

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss");
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItemContainer}>
      <Text style={styles.productName}>Sản phẩm ID: {item.product}</Text>
      <Text style={styles.productPrice}>Giá: ${item.price}</Text>
      <Text style={styles.productQuantity}>Số lượng: {item.quantity}</Text>
      <Text style={styles.itemTotalPrice}>
        Tổng giá: ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải thông tin hóa đơn...</Text>
      </View>
    );
  }

  const handlePayment = async () => {
    try {
      // Gửi thông tin thanh toán
      const form = new FormData();
      form.append('order', orderId);
      form.append('amount', parseFloat(order.total_price).toFixed(2));
      form.append('method', selectedPaymentMethod);
      form.append('status', "Đã thanh toán");
  
      console.log("🔍 Dữ liệu gửi đi:", form);
  
      const response = await APIs.post(endpoints['transactions'], form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      await APIs.patch(`${endpoints['order']}${orderId}/`, { status: "completed" });

      console.log("✅ Order đã được cập nhật thành completed");

      // for (const item of orderItems) {
      //   const updateStockForm = new FormData();
      //   updateStockForm.append("product_id", item.product); // ID của sản phẩm
      //   updateStockForm.append("quantity", item.quantity); // Số lượng cần giảm
  
      //   await APIs.post(endpoints["update-stock"], updateStockForm, {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   });
  
      //   console.log(`✅ Số lượng tồn kho của sản phẩm ${item.product} đã được giảm.`);
      // }


      console.log("✅ Phản hồi từ API:", response.data);
  
      // Xóa giỏ hàng trong AsyncStorage sau khi thanh toán thành công
      await AsyncStorage.removeItem(`shoppingCart_${user.id}`);
      
      // Thông báo thanh toán thành công
      Alert.alert("Thông báo", "Thanh toán thành công!");
  
      // Quay lại màn hình trước
      navigation.goBack();
    } catch (ex) {
      console.error("❌ Failed:", ex.response ? ex.response.data : ex.message);
      Alert.alert("Thông báo", "Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông tin Hóa Đơn</Text>

      <View style={styles.orderInfo}>
        <Text style={styles.infoText}>Mã đơn hàng: {order.id}</Text>
        <Text style={styles.infoText}>Ngày tạo: {formatDate(order.created_at)}</Text>
        <Text style={styles.infoText}>Tổng giá trị: ${order.total_price}</Text>
        <Text style={styles.infoText}>Trạng thái: {order.status}</Text>
      </View>

      {/* Phương thức thanh toán */}
      <View style={styles.paymentMethodContainer}>
        <Text style={styles.paymentMethodLabel}>Chọn phương thức thanh toán</Text>
        <Picker
          selectedValue={selectedPaymentMethod}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedPaymentMethod(itemValue)}
        >
          <Picker.Item label="Tiền mặt" value="money" />
          <Picker.Item label="PayPal" value="papal" />
          <Picker.Item label="Momo" value="momo" />
          <Picker.Item label="Stripe" value="stripe" />
          <Picker.Item label="ZaloPay" value="zalopay" />
        </Picker>
      </View>

      {/* Render order items if they exist */}
      <FlatList
        data={orderItems}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng giá trị đơn hàng: ${order.total_price}</Text>
      </View>

      {/* Nút thanh toán */}
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={handlePayment}
      >
        <Text style={styles.buttonText}>Thanh toán</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Bill;
