import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, TextInput, View, Text, Image, TouchableOpacity, RefreshControl} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchStyles from "./SearchStyles";
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import APIs, { endpoints } from '../../configs/APIs';
import FoodDetailStyles from "./FoodDetailStyles";

const Search = () => {
  const navigation = useNavigation();
  const [food, setFood] = useState([]);
  const [stores, setStores] = useState({});
  const [filters, setFilters] = useState({ name: '', minPrice: '', maxPrice: '', store: '' });
  const [filteredFood, setFilteredFood] = useState([]);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState('name');
  const [isRefreshing, setIsRefreshing] = useState(false);


  // Function to remove diacritics
  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const loadFood = async () => {
    if (page > 0) {
      try {
        const url = `${endpoints["food"]}?page=${page}`;
        const res = await APIs.get(url);
        console.log(res.data);

        if (res.data.results.length > 0) {
          setFood((prev) => (page > 1 ? [...prev, ...res.data.results] : res.data.results));
          setFilteredFood((prev) => (page > 1 ? [...prev, ...res.data.results] : res.data.results));

          if (res.data.next === null) {
            setPage(0);
          }
        } else {
          setPage(0);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        setPage(0);
      }
    }
  };

  const loadStores = async () => {
    try {
      const res = await APIs.get(endpoints["store-list"]);
      const storeData = {};
      res.data.forEach((store) => {
        storeData[store.id] = store.name;
      });
      setStores(storeData);
    } catch (error) {
      console.error("Lỗi khi tải thông tin cửa hàng:", error);
    }
  };

  const handleSearch = () => {
    let results = food.filter((foods) => {
      const isNameMatch = removeDiacritics(foods.name.toLowerCase()).includes(removeDiacritics(filters.name.toLowerCase()));
      const isPriceMatch =
          (!filters.minPrice || foods.price >= parseFloat(filters.minPrice)) &&
          (!filters.maxPrice || foods.price <= parseFloat(filters.maxPrice));
      const isStoreMatch = removeDiacritics(stores[foods.store]?.toLowerCase() || '').includes(removeDiacritics(filters.store.toLowerCase()));
      return isNameMatch && isPriceMatch && isStoreMatch;
    });

    results = results.sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'price') {
        return parseFloat(a.price) - parseFloat(b.price);
      }
    });

    setFilteredFood(results);
  };


  useFocusEffect(
      useCallback(() => {
        loadFood();
        loadStores();
      }, [page])
  );


  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadFood();
    await loadStores();
    setIsRefreshing(false);

  };

  const loadMore = () => {
    if (page > 0) {
      setPage((prev) => prev + 1);
    }
  };

  return (
      <View style={SearchStyles.container}>
        <Text style={SearchStyles.title}>Tìm kiếm sản phẩm</Text>
        <View style={SearchStyles.filterContainer}>
          <TextInput style={SearchStyles.input} placeholder="Tên sản phẩm" value={filters.name} onChangeText={(text) => setFilters({ ...filters, name: text })} />
          <TextInput style={SearchStyles.input} placeholder="Giá tối thiểu" keyboardType="numeric" value={filters.minPrice} onChangeText={(text) => setFilters({ ...filters, minPrice: text })} />
          <TextInput style={SearchStyles.input} placeholder="Giá tối đa" keyboardType="numeric" value={filters.maxPrice} onChangeText={(text) => setFilters({ ...filters, maxPrice: text })} />
          <TextInput style={SearchStyles.input} placeholder="Cửa hàng" value={filters.store} onChangeText={(text) => setFilters({ ...filters, store: text })} />
        </View>
        <View style={SearchStyles.sortContainer}>
          <TouchableOpacity onPress={handleSearch} style={SearchStyles.searchButton}><Text style={SearchStyles.searchText}>Tìm kiếm</Text></TouchableOpacity>
        </View>
        <FlatList
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            data={filteredFood}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
                <TouchableOpacity style={SearchStyles.foodItem} onPress={() => navigation.navigate("FoodDetail", { foodId: item.id })}>
                  <Image source={{ uri: item.image }} style={SearchStyles.foodImage} />
                  <View style={SearchStyles.foodInfo}>
                    <Text style={SearchStyles.foodName}>{item.name}</Text>
                    <Text style={FoodDetailStyles.foodPrice}>
                      {parseInt(item.price).toLocaleString('en-US')} VND
                    </Text>
                    <Text style={SearchStyles.foodStore}>{stores[item.store] || 'Cửa hàng không xác định'}</Text>
                  </View>
                </TouchableOpacity>
            )}
        />
      </View>
  );
};

export default Search;
