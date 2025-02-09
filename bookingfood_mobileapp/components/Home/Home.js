import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView, ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native";
import HomeStyles from "./HomeStyles";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const Home = () => {
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [numColumns, setNumColumns] = useState(2); // Default numColumns
  const navigation = useNavigation();

  const loadStore = async () => {
    if (page > 0) {
      try {
        setLoading(true);
        let url = `${endpoints["store"]}?page=${page}`;
        let res = await APIs.get(url);
        if (res.data.results.length > 0) {
          setStore((prev) => (page === 1 ? res.data.results : [...prev, ...res.data.results]));
          if (res.data.next === null) {
            setPage(0); // No more stores
          }
        } else {
          setPage(0); // No more stores
        }
      } catch (error) {
        console.error("Error loading stores:", error.message);
      } finally {
        setLoading(false);
      }
    }
  };



  useFocusEffect(
      useCallback(() => {
        setStore([]); // Clear the previous list before loading new data
        setPage(1); // Reset to the first page
        loadStore();
      }, [])
  );

  useEffect(() => {
    loadStore();
  }, [page]);

  const loadMore = () => {
    if (page > 0 && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
      <View style={HomeStyles.container}>
        <Text style={HomeStyles.title}>Danh Sách Nhà Hàng</Text>
        {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" style={HomeStyles.loading} />
        ) : (
            <FlatList
                key={numColumns} // Add key prop to force re-render on numColumns change
                onEndReached={loadMore}
                data={store}
                horizontal={false} // Set to false for vertical scrolling
                numColumns={numColumns} // Display two items per row
                keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique keys
                contentContainerStyle={HomeStyles.storeList}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={HomeStyles.storeCard}
                        onPress={() => navigation.navigate("StoreDetail", { storeId: item.id })}
                    >
                      <Image source={{ uri: item.image }} style={HomeStyles.storeImage} resizeMode="cover" />
                      <View style={HomeStyles.storeInfo}>
                        <Text style={HomeStyles.storeName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <View style={HomeStyles.ratingContainer}>
                          {[...Array(5)].map((_, index) => (
                              <FontAwesome
                                  key={index}
                                  name={index < Math.floor(item.rating) ? "star" : "star-o"}
                                  size={16}
                                  color="#FFD700"
                              />
                          ))}
                        </View>
                      </View>
                    </TouchableOpacity>
                )}
            />
        )}
      </View>
  );
};

export default Home;
