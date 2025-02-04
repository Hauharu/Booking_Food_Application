import React, { useEffect, useState } from 'react';
import { FlatList, TextInput, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchStyles from "../Home/SearchStyles";
import { useNavigation } from '@react-navigation/native';
import APIs, { endpoints } from '../../configs/APIs';

const Search = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState({});
  const [filters, setFilters] = useState({ name: '', minPrice: '', maxPrice: '', store: '' });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState('name');
  
  const loadProducts = async () => {
    if (page > 0) {
      try {
        const url = `${endpoints["products"]}?page=${page}`;
        const res = await APIs.get(url);
  
        if (res.data.results.length > 0) {
          setProducts((prev) => (page > 1 ? [...prev, ...res.data.results] : res.data.results));
          setFilteredProducts((prev) => (page > 1 ? [...prev, ...res.data.results] : res.data.results));
  
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
      const res = await APIs.get(endpoints["stores"]);
      const storeData = {};
      res.data.results.forEach((store) => {
        storeData[store.id] = store.name;
      });
      setStores(storeData);
    } catch (error) {
      console.error("Lỗi khi tải thông tin cửa hàng:", error);
    }
  };

  const handleSearch = () => {
    let results = products.filter((product) => {
      const isNameMatch = product.name.toLowerCase().includes(filters.name.toLowerCase());
      const isPriceMatch =
        (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) &&
        (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice));
      const isStoreMatch = stores[product.store]?.toLowerCase()?.includes(filters.store.toLowerCase());
      return isNameMatch && isPriceMatch && isStoreMatch;
    });

    results = results.sort((a, b) => (sortOption === 'name' ? a.name.localeCompare(b.name) : a.price - b.price));
    setFilteredProducts(results);
  };

  useEffect(() => {
    loadProducts();
    loadStores();
  }, [page]);

  const loadMore = () => {
    if (page > 0) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <View style={SearchStyles.container}>
      <Text style={SearchStyles.title}>🔍Tìm kiếm sản phẩm</Text>
      <View style={SearchStyles.filterContainer}>
        <TextInput style={SearchStyles.input} placeholder="Tên sản phẩm" value={filters.name} onChangeText={(text) => setFilters({ ...filters, name: text })} />
        <TextInput style={SearchStyles.input} placeholder="Giá tối thiểu" keyboardType="numeric" value={filters.minPrice} onChangeText={(text) => setFilters({ ...filters, minPrice: text })} />
        <TextInput style={SearchStyles.input} placeholder="Giá tối đa" keyboardType="numeric" value={filters.maxPrice} onChangeText={(text) => setFilters({ ...filters, maxPrice: text })} />
        <TextInput style={SearchStyles.input} placeholder="Cửa hàng" value={filters.store} onChangeText={(text) => setFilters({ ...filters, store: text })} />
      </View>
      <View style={SearchStyles.sortContainer}>
        <TouchableOpacity onPress={() => setSortOption('name')} style={SearchStyles.sortButton}><Ionicons name="text" size={20} color="#007bff" /><Text style={SearchStyles.sortText}>Tên</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setSortOption('price')} style={SearchStyles.sortButton}><Ionicons name="pricetag" size={20} color="#007bff" /><Text style={SearchStyles.sortText}>Giá</Text></TouchableOpacity>
        <TouchableOpacity onPress={handleSearch} style={SearchStyles.searchButton}><Text style={SearchStyles.searchText}>Tìm kiếm</Text></TouchableOpacity>
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <TouchableOpacity style={SearchStyles.productItem} onPress={() => navigation.navigate("ProductDetails", { productId: item.id })}>
            <Image source={{ uri: item.image }} style={SearchStyles.productImage} />
            <View style={SearchStyles.productInfo}>
              <Text style={SearchStyles.productName}>{item.name}</Text>
              <Text style={SearchStyles.productPrice}>{item.price} VND</Text>
              <Text style={SearchStyles.productStore}>{stores[item.store] || 'Cửa hàng không xác định'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Search;