import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import styles from '../User/StatisticStyles';
import { authApis, endpoints } from '../../configs/APIs';

const SalesStatistics = () => {
  const [stats, setStats] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const authAPI = await authApis();
        const response = await authAPI.get(endpoints['statistics']);
        setStats(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setError("Bạn không có quyền truy cập.");
        } else {
          setError("Lỗi khi tải dữ liệu.");
        }
      }
      setLoading(false);
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

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thống Kê Doanh Thu</Text>

      <Text style={styles.subtitle}>Cửa hàng của bạn</Text>
      {stats && stats.stores_stats && stats.stores_stats.length > 0 ? (
        stats.stores_stats.map((store, index) => (
          <View key={index} style={styles.statContainer}>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.storeValue}>Doanh thu tháng: {store.total_sales_month} VND</Text>
            <Text style={styles.storeValue}>Doanh thu quý: {store.total_sales_quarter} VND</Text>
            <Text style={styles.storeValue}>Doanh thu năm: {store.total_sales_year} VND</Text>
          </View>
        ))
      ) : (
        <Text style={styles.storeContainer}>Không có dữ liệu cửa hàng.</Text>
      )}

      <Text style={styles.subtitle}>Danh mục sản phẩm</Text>
      {stats && stats.categories_stats && stats.categories_stats.length > 0 ? (
        stats.categories_stats.map((category, index) => (
          <View key={index} style={styles.statContainer}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.storeValue}>Doanh thu tháng: {category.total_cates_month} VND</Text>
            <Text style={styles.storeValue}>Doanh thu quý: {category.total_cates_quarter} VND</Text>
            <Text style={styles.storeValue}>Doanh thu năm: {category.total_cates_year} VND</Text>
          </View>
        ))
      ) : (
        <Text style={styles.storeContainer}>Không có dữ liệu danh mục.</Text>
      )}
    </ScrollView>
  );
};

export default SalesStatistics;
