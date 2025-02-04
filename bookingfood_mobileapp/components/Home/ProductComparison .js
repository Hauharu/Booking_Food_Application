import React, { useEffect, useState } from "react";
import { FlatList, Text, View, Image, ActivityIndicator } from "react-native";
import APIs, { endpoints } from "../../configs/APIs";
import styles from "../Home/ProductComparisonStyles";

const ProductComparison = ({ route }) => {
  const { products, product } = route.params;
  const [stores, setStores] = useState({});
  const [loading, setLoading] = useState(true);

  const loadStoreDetails = async () => {
    try {
      const storePromises = products.map((product) =>
        APIs.get(endpoints["stores"] + product.store) 
      );

      const storeResponses = await Promise.all(storePromises);
      const storeData = {};
      storeResponses.forEach((res, index) => {
        storeData[products[index].store] = res.data;
      });

      setStores(storeData);
    } catch (error) {
      console.error("Error loading store details:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    loadStoreDetails();
  }, [products]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const getPriceComparison = (itemPrice) => {
    if (itemPrice < product.price) return "Rẻ hơn";
    if (itemPrice > product.price) return "Đắt hơn";
    return "Giá tương đương";
  };

  const getRatingComparison = (itemRating) => {
    if (itemRating < product.rating) return "Đánh giá thấp hơn";
    if (itemRating > product.rating) return "Đánh giá cao hơn";
    return "Đánh giá tương đương";
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>Giá: {formatPrice(item.price)}</Text>
      <Text style={styles.productRating}>
        Đánh giá: {item.rating || "Chưa có"}★
      </Text>
      <Text style={styles.storeName}>
        Cửa hàng: {stores[item.store]?.name || "Đang tải..."}
      </Text>
      <Text 
        style={[
          styles.comparisonText, 
          { backgroundColor: item.price < product.price ? "#C8E6C9" : item.price > product.price ? "#FFCDD2" : "#FFF9C4" }
        ]}
      >
        {getPriceComparison(item.price)}
      </Text>

      <Text 
        style={[
          styles.comparisonText, 
          { backgroundColor: item.rating > product.rating ? "#C8E6C9" : item.rating < product.rating ? "#FFCDD2" : "#FFF9C4" }
        ]}
      >
        {getRatingComparison(item.rating)}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>So sánh sản phẩm</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
      />
    </View>
  );
};

export default ProductComparison;
