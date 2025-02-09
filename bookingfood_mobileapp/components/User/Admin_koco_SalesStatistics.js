import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import styles from "../User/SalesStatisticStyles";
import { authApis, endpoints } from '../../configs/APIs';

const SalesStatistics = () => {
  const [stats, setStats] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const authAPI = await authApis();
            const response = await authAPI.get(endpoints['sales-statistics']);
            setStats(response.data); 
            setLoading(false);
        } catch (error) {
          if (error.response) {
            console.error("Lỗi từ server:", error.response.data);
            console.error("Mã trạng thái:", error.response.status);
          } else if (error.request) {
            console.error("Không nhận được phản hồi từ server", error.request);
          } else {
            console.error("Lỗi khi thiết lập yêu cầu:", error.message);
          }
          setLoading(false);
        }
      };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thống Kê Bán Hàng</Text>
  
      <View style={styles.statContainer}>
        <Text style={styles.statTitle}>Tổng Doanh Thu Tháng Này:</Text>
        <Text style={styles.statValue}>{stats.sales_month}</Text>
      </View>
  
      <View style={styles.statContainer}>
        <Text style={styles.statTitle}>Tổng Doanh Thu Quý Này:</Text>
        <Text style={styles.statValue}>{stats.sales_quarter}</Text>
      </View>
  
      <View style={styles.statContainer}>
        <Text style={styles.statTitle}>Tổng Doanh Thu Năm Này:</Text>
        <Text style={styles.statValue}>{stats.sales_year}</Text>
      </View>
  
      <Text style={styles.subtitle}>Số Lượng Sản Phẩm Bán Được Theo Cửa Hàng:</Text>
      
      {stats.stores_stats && stats.stores_stats.length > 0 ? (
        stats.stores_stats.map((store, index) => (
          <View key={index} style={styles.storeContainer}>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.storeValue}>Doanh thu tháng: {store.total_sales_month} VND</Text>
            <Text style={styles.storeValue}>Doanh thu quý: {store.total_sales_quarter} VND</Text>
            <Text style={styles.storeValue}>Doanh thu năm: {store.total_sales_year} VND</Text>
            <Text style={styles.storeValue}>Sản phẩm bán tháng này: {store.total_products_sold_month} sản phẩm</Text>
            <Text style={styles.storeValue}>Sản phẩm bán quý này: {store.total_products_sold_quarter} sản phẩm</Text>
            <Text style={styles.storeValue}>Sản phẩm bán năm này: {store.total_products_sold_year} sản phẩm</Text>
          </View>
        ))
      ) : (
        <Text style={styles.storeContainer}>Không có dữ liệu cửa hàng.</Text>
      )}
    </ScrollView>
  );
};

export default SalesStatistics;
