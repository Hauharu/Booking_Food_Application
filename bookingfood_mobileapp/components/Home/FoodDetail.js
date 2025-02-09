import React, { useContext, useEffect, useState } from "react";
import {
    LogBox,
    Text,
    View,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Alert,
    TextInput,
    FlatList,
    RefreshControl,
    Dimensions
} from "react-native";
import FoodDetailStyles from "./FoodDetailStyles";
import APIs, {endpoints, authApis} from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AirbnbRating } from "react-native-ratings";
import { MyUserContext } from "../../configs/UserContexts";
import RenderHTML from 'react-native-render-html';

LogBox.ignoreLogs([
    "Warning: Star: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
    "Warning: TapRating: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
    "Warning: Text strings must be rendered within a <Text> component.",
]);

const FoodDetail = ({ route }) => {
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [comment, setcomment] = useState("");
    const [userId, setUserId] = useState(null);
    const [rating, setRating] = useState(5);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [store, setStore] = useState(null);
    const navigation = useNavigation();
    const { user } = useContext(MyUserContext);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { width } = Dimensions.get('window');
    const { foodId }  = route.params;
    // const foodId = 2

    const loadFoodDetails = async () => {
        try {
            setLoading(true);
            const res = await APIs.get(endpoints["food-detail"](foodId));
            setFood(res.data);
            console.log("Thông tin chi tiết:" ,res.data);
            const storeRes = await APIs.get(endpoints["store"] + res.data.store);
            console.log("Thông tin cửa hàng:", storeRes.data);
            setStore(storeRes.data);
        } catch (error) {
            console.error("Error loading food details:", error);
            Alert.alert("Lỗi", "Không thể tải thông tin sản phẩm. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };
    const loadReviews = async () => {
        try {
            const res = await APIs.get(endpoints["food-review"](foodId));
            console.log(res.data);
            const reviewsData = res.data;
            setReviews(reviewsData);
        } catch (error) {
            console.error("Error loading reviews:", error);
            Alert.alert("Lỗi", "Không thể tải bình luận. Vui lòng thử lại!");
        }
    };

    const loadUserId = async () => {
        try {
            const storedUserId =  await AsyncStorage.getItem("user_id");
            // const storedUserId = 2;
            if (storedUserId) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error("Error loading user ID:", error);
            Alert.alert("Lỗi", "Không thể xác định người dùng. Vui lòng thử lại!");
        }
    };



    useEffect(() => {
        loadUserId();
        loadFoodDetails();
        loadReviews();
    }, [foodId]);

    const handleAddToCart = async () => {
        // const token = "VPcUjh5YP8alzJoVBSkG9TYVAHeUzx";
        const token = await AsyncStorage.getItem("token");
        if (!isLoggedIn) {
            Alert.alert("Thông báo", "Bạn cần đăng nhập để thực hiện hành động này");
            return;
        }

        try {
            // Prepare the data to be sent to the server
            const requestData = {
                food_id : foodId,
                quantity : quantity
            };

            // Call the add-to-cart API endpoint
            const api = await authApis(token);
            const response = await api.post(endpoints["cart-add"], requestData);
            console.log(response);

            // Check if the server responded with a status code of 400
            if (response.status === 400) {
                const errorData = await response.json();
                Alert.alert("Lỗi", errorData.error_message || "Không thể thêm sản phẩm vào giỏ hàng");
                return;
            }

            // Update the local cart items state with the response from the server
            Alert.alert("Giỏ hàng", `Đã thêm  vào giỏ hàng!`);
        } catch (error) {
            console.error("Error adding to cart:", error);
            Alert.alert(
                "Lỗi",
                "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!"
            );
        }
    };



    const postReview = async () => {
        const token = await AsyncStorage.getItem('token');
        // const token = "VPcUjh5YP8alzJoVBSkG9TYVAHeUzx";
        if (!isLoggedIn) {
            Alert.alert("Thông báo", "Vui lòng đăng nhập để đăng đánh giá!");
            return;
        }
        if (!comment.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập nội dung đánh giá!");
            return;
        }

        try {
            const review = {
                review: comment,
                rating: rating,
            };

            const api = await authApis(token);
            const res = await api.post(endpoints["food-review"](foodId), review); // Call the function with foodId
            console.log("Review gửi đi:", res.data);

            Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!");
            setcomment("");
            setRating(5);
            loadFoodDetails(); // Cập nhật lại đánh giá
            loadReviews();
        } catch (error) {
            console.error("Error posting review:", error);

            // Check if the error response is 500 and show the appropriate alert
            if (error.response && error.response.status === 500) {
                Alert.alert("Lỗi", "Bạn đã đăng review cho đồ ăn này rồi!");
            } else {
                Alert.alert("Lỗi", "Không thể gửi đánh giá. Vui lòng thử lại!");
            }
        }
    };

    const onRefresh = async () => {
        setIsRefreshing(true);
        await loadFoodDetails();
        await loadReviews();

        setIsRefreshing(false);
    };


    if (loading) {
        return (
            <View style={FoodDetailStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={FoodDetailStyles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    if (!food) {
        return (
            <View style={FoodDetailStyles.errorContainer}>
                <Text style={FoodDetailStyles.errorText}>
                    Thông tin đồ ăn bị lỗi. Vui lòng thử lại sau.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            data={[food]} // Wrap product details in an array to use with FlatList
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={FoodDetailStyles.container}>
                    <Image
                        source={{ uri: item.image }}
                        style={FoodDetailStyles.foodImage}
                        resizeMode="cover"
                    />
                    <View style={FoodDetailStyles.infoContainer}>
                        <Text style={FoodDetailStyles.foodName}>{item.name}</Text>
                        <Text style={FoodDetailStyles.foodRating}>
                            {item.average_rating}★
                        </Text>
                        {store && (
                            <Text style={FoodDetailStyles.storeName}>
                                Cửa hàng: {store.name}
                            </Text>
                        )}

                        <Text style={FoodDetailStyles.foodPrice}>
                            {parseInt(item.price).toLocaleString('en-US')} VND
                        </Text>
                        <Text style={[
                            FoodDetailStyles.foodStatus,
                            { color: item.status === "available" ? "green" : "red" }
                        ]}>
                            Trạng thái: {item.status === "available" ? "Còn đồ ăn" : "Hết đồ ăn"}
                        </Text>
                        <Text style={FoodDetailStyles.descriptionTitle}>
                            Thông tin đồ ăn:
                        </Text>
                        <RenderHTML
                            contentWidth={width}
                            source={{ html: item.description || "Mô tả sản phẩm chưa được cập nhật." }}
                            defaultTextProps={{
                                style: {
                                    fontSize: 30, // Adjust font size here
                                },
                            }}
                        />
                    </View>

                    <View style={FoodDetailStyles.quantityAddToCartContainer}>
                        <View style={FoodDetailStyles.quantityContainer}>
                            <TouchableOpacity
                                style={FoodDetailStyles.quantityButton}
                                onPress={() => setQuantity((prev) => Math.max(prev - 1, 1))} // Không cho giảm dưới 1
                            >
                                <Text style={FoodDetailStyles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={FoodDetailStyles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                style={FoodDetailStyles.quantityButton}
                                onPress={() => setQuantity((prev) => prev + 1)}
                            >
                                <Text style={FoodDetailStyles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={FoodDetailStyles.addToCartButton}
                            onPress={handleAddToCart}
                        >
                            <Text style={FoodDetailStyles.addToCartButtonText}>
                                Thêm vào giỏ hàng
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Reviews Section */}
                    <View style={FoodDetailStyles.reviewsContainer}>
                        <Text style={FoodDetailStyles.reviewsHeader}>Review đồ ăn</Text>
                        {reviews.length > 0 ? (
                            <FlatList
                                data={reviews}
                                renderItem={({ item }) => (
                                    <View style={FoodDetailStyles.reviewItem}>
                                        <Text style={FoodDetailStyles.reviewUser}>{item.name}</Text>
                                        <RenderHTML
                                            contentWidth={width}
                                            source={{ html: item.review }}
                                            defaultTextProps={{
                                                style: {
                                                    fontSize: 20, // Adjust font size here
                                                },
                                            }}
                                        />
                                        {/*<Text style={FoodDetailStyles.reviewComment}>{item.review}</Text>*/}
                                        <Text style={FoodDetailStyles.storeRating}>
                                            Đánh giá: {item.rating || "Chưa có đánh giá"}★
                                        </Text>
                                    </View>
                                )}
                                keyExtractor={(item) => item.id.toString()}
                            />
                        ) : (
                            <Text style={FoodDetailStyles.noReviewsText}>Chưa có đánh giá nào.</Text>
                        )}
                    </View>

                    {/* Add review form */}
                    {isLoggedIn && (
                        <View style={FoodDetailStyles.addReviewContainer}>
                            <Text style={FoodDetailStyles.addReviewHeader}>Viết đánh giá</Text>

                            <AirbnbRating
                                count={5}
                                rating={rating}
                                size={30}
                                onFinishRating={(rate) => setRating(rate)}
                                fullStarColor="gold"
                            />
                            <TextInput
                                style={FoodDetailStyles.commentInput}
                                placeholder="Nhập bình luận của bạn..."
                                value={comment}
                                onChangeText={(text) => setcomment(text)}
                                multiline
                            />
                            <TouchableOpacity style={FoodDetailStyles.submitButton} onPress={postReview}>
                                <Text style={FoodDetailStyles.submitButtonText}>Gửi</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {!isLoggedIn && (
                        <View style={FoodDetailStyles.notLoggedInContainer}>
                            <Text style={FoodDetailStyles.notLoggedInText}>
                                Bạn cần đăng nhập để có thể bình luận cho đồ ăn này. Vui lòng đăng nhập.
                            </Text>
                        </View>
                    )}
                </View>
            )}
        />
    );
};

export default FoodDetail;
