import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from "react-native";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import styles from "../User/ProductSettingStyles";

const ProductSetting = ({ route, navigation }) => {
    const { productId } = route.params;
    const [product, setProduct] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [image, setImage] = useState("");
    const [store, setStore] = useState(null);
    const [category, setCategory] = useState(null);
    const [rating, setRating] = useState();
    const [loading, setLoading] = useState(true);  // To manage loading state

    useEffect(() => {
        loadProduct();
    }, [productId]);

    const loadProduct = async () => {
        setLoading(true);
        try {
            const res = await APIs.get(endpoints["product-details"](productId));
            setProduct(res.data);
            setName(res.data.name || "");
            setDescription(res.data.description || "");
            setPrice(res.data.price?.toString() || "");
            setStockQuantity(res.data.stock_quantity?.toString() || "");
            setImage(res.data.image || "");
            setRating(res.data.rating);

            const storeRes = await APIs.get(endpoints["stores"] + res.data.store);
            setStore(storeRes.data);

            const categoryRes = await APIs.get(endpoints["categories"] + res.data.category);
            setCategory(categoryRes.data);

        } catch (ex) {
            console.error("Lỗi khi tải sản phẩm: ", ex);
            Alert.alert("Lỗi", "Không thể tải dữ liệu sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    const saveProduct = async () => {
        try {
            const validRating = rating && rating >= 1 && rating <= 5 ? rating : 1; // Make sure the rating is between 1-5
    
            const updatedProduct = new FormData();
            updatedProduct.append("name", name);
            updatedProduct.append("description", description);
            updatedProduct.append("price", parseFloat(price).toFixed(2));
            updatedProduct.append("stock_quantity", parseInt(stockQuantity));
            updatedProduct.append("category", category ? category.id : null);
            updatedProduct.append("rating", validRating);
            updatedProduct.append("store", store ? store.id : null);
            
            if (image) {
                const imageFile = {
                    uri: image,
                    type: 'image/jpeg',
                    name: 'image.jpg',
                };
                updatedProduct.append("image", imageFile);
            }
    
            const api = await authApis();
            await api.patch(endpoints["product-details"](productId), updatedProduct, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            Alert.alert("Thành công", "Cập nhật sản phẩm thành công!");
            navigation.goBack();
        } catch (ex) {
            if (ex.response) {
                console.error("Chi tiết lỗi: ", ex.response.data);
            } else {
                console.error("Lỗi khi cập nhật sản phẩm: ", ex);
            }
            Alert.alert("Lỗi", "Không thể cập nhật sản phẩm!");
        }
    };
    

    const deleteProduct = async () => {
        try {
            const api = await authApis();
            await api.delete(endpoints["product-details"](productId));
            Alert.alert("Thành công", "Xóa sản phẩm thành công!");
            navigation.goBack();
        } catch (ex) {
            Alert.alert("Lỗi", "Xóa sản phẩm thất bại");
            console.error("Lỗi khi xóa sản phẩm ", ex);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Đang tải dữ liệu sản phẩm...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chỉnh sửa sản phẩm</Text>

            <Image source={{ uri: image }} style={styles.productImage} />

            <Text style={styles.label}>Tên sản phẩm:</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Mô tả:</Text>
            <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

            <Text style={styles.label}>Giá:</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

            <Text style={styles.label}>Số lượng:</Text>
            <TextInput style={styles.input} value={stockQuantity} onChangeText={setStockQuantity} keyboardType="numeric" />

            <Text style={styles.label}>Danh mục:</Text>
            <Text style={styles.input}>{category ? category.name : "Chưa có danh mục"}</Text>

            <Text style={styles.label}>Cửa hàng:</Text>
            <Text style={styles.input}>{store ? store.name : "Chưa có cửa hàng"}</Text>

            <TouchableOpacity style={styles.saveButton} onPress={saveProduct}>
                <Text style={styles.saveText}>Lưu sản phẩm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={deleteProduct}>
                <Text style={styles.deleteText}>Xóa sản phẩm</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProductSetting;
