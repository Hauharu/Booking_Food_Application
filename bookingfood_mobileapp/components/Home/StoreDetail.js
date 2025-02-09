import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    FlatList,
    StatusBar,
    ScrollView,
    Alert,
    Linking,
    ActivityIndicator,
    RefreshControl, TextInput, Dimensions, Button
} from 'react-native';
import { View, Text, Image, Colors, Badge, TouchableOpacity } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import APIs, {authApis, endpoints} from "../../configs/APIs";
import FoodCard from "./FoodCard";
import FoodDetailStyles from "./FoodDetailStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderHTML from "react-native-render-html";
import {AirbnbRating} from "react-native-ratings";


const StoreDetail = ({ navigation, route }) => {
    const { storeId } = route.params;
    console.log(storeId);
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState([]);
    const [userId, setUserId] = useState(null);
    const [review, setReview] = useState("");
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { width } = Dimensions.get('window');



    const fetchRestaurantData = async () => {
            try {
                const restaurantResponse = await APIs.get(endpoints['current-store'](storeId));
                setRestaurant(restaurantResponse.data);
                console.log('Restaurant Response:', restaurantResponse.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
                setLoading(false);
            }
        };

    const fetchFoodData = async () => {
        try {
            const foodsResponse = await APIs.get(endpoints['current-store-food'](storeId));
            setFoods(foodsResponse.data);
            console.log('Foods Response:', foodsResponse.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err);
            setLoading(false);
        }
    };

    const loadComment = async () => {
        try {
            const res = await APIs.get(endpoints["current-store-comment"](storeId));
            console.log(res.data);
            const commentData = res.data;
            setComment(commentData);
        } catch (error) {
            console.error("Error loading comments:", error);
            Alert.alert("Lỗi", "Không thể tải bình luận. Vui lòng thử lại!");
        }
    };
    const checkFollowStatus = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            const api = await authApis(token);
            const res = await api.get(endpoints["current-user-followedstore"]); // Adjust endpoint if needed
            const followedStores = res.data;

            setIsFollowing(followedStores.some(store => store.id === storeId));
        } catch (error) {
            console.error("Lỗi khi kiểm tra trạng thái theo dõi:", error);
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

    const fetchAllData = async () => {
        setLoading(true); // Start loading

        try {
            const [restaurantRes, foodsRes, commentsRes] = await Promise.all([
                APIs.get(endpoints['current-store'](storeId)),
                APIs.get(endpoints['current-store-food'](storeId)),
                APIs.get(endpoints['current-store-comment'](storeId))

            ]);

            setRestaurant(restaurantRes.data || null);
            setFoods(foodsRes.data || []);
            setComment(commentsRes.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        loadUserId();
        checkFollowStatus();
        fetchAllData();
    }, [storeId]);

    // useEffect(() => {
    //     loadUserId();
    //     fetchFoodData();
    //     fetchRestaurantData();
    //     loadComment();
    // }, [storeId]);

    const postComment = async () => {
        const token = await AsyncStorage.getItem('token');

        if (!isLoggedIn) {
            Alert.alert("Thông báo", "Vui lòng đăng nhập để đăng đánh giá!");
            return;
        }
        if (!review.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập nội dung đánh giá!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("content", review);
            formData.append("rate", rating);

            console.log("Review Data:", formData);

            const api = await authApis(token);
            const res = await api.post(endpoints["current-store-comment"](storeId), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Review gửi đi:", res.data);
            Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!");

            setReview("");
            setRating(5);
            fetchRestaurantData();
            loadComment();
        } catch (error) {
            console.error("Error posting review:", error);

            if (error.response) {
                console.log("Error Response:", error.response.data);
            }

            if (error.response && error.response.status === 500) {
                Alert.alert("Lỗi", "Bạn đã đăng review cho cửa hàng này rồi!");
            } else if (error.response && error.response.status === 415) {
                Alert.alert("Lỗi", "Dữ liệu không hợp lệ. Vui lòng thử lại!");
            } else {
                Alert.alert("Lỗi", "Không thể gửi đánh giá. Vui lòng thử lại!");
            }
        }
    };

    const toggleFollow = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Thông báo", "Vui lòng đăng nhập để theo dõi!");
                return;
            }

            const api = await authApis(token);
            const res = await api.post(endpoints["current-store-follow"](storeId));

            if (res.status === 201) {
                setIsFollowing(true);
                Alert.alert("Thành công", "Bạn đã theo dõi cửa hàng này!");
            } else if (res.status === 204) {
                setIsFollowing(false);
                Alert.alert("Thành công", "Bạn đã hủy theo dõi cửa hàng này!");
            }
        } catch (error) {
            console.error("Lỗi khi theo dõi cửa hàng:", error);
            Alert.alert("Lỗi", "Không thể thực hiện hành động!");
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchRestaurantData();
        await fetchFoodData();
        await loadComment();
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

    if (!foods) {
        return (
            <View style={FoodDetailStyles.errorContainer}>
                <Text style={FoodDetailStyles.errorText}>
                    Thông tin đồ ăn bị lỗi. Vui lòng thử lại sau.
                </Text>
            </View>
        );
    }


    return (
        <View flex-1 bg-white>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                }
            >
                <Image
                    source={{ uri: restaurant.image }}
                    style={styles.backgroundImage}
                />
                <Button
                    title="Menu cửa hàng"
                    onPress={() => navigation.navigate('StoreMenu', { storeId })} // Pass storeId here
                    buttonStyle={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5 }}
                    titleStyle={{ color: 'white', fontWeight: 'bold' }}
                />
                <View style={styles.infoContainer}>
                    <View row spread centerV>
                        <Text style={styles.name}>{restaurant.name}</Text>
                    </View>
                    <View row spread centerV>
                        <RenderHTML
                            contentWidth={width}
                            source={{ html: restaurant.description }}
                            defaultTextProps={{
                                style: {
                                    fontSize: 20, // Adjust font size here
                                },
                            }}
                        />
                    </View>
                    <View row spread centerV>
                        <RenderHTML
                            contentWidth={width}
                            source={{ html: restaurant.address_line }}
                            defaultTextProps={{
                                style: {
                                    fontSize: 20, // Adjust font size here
                                },
                            }}
                        />
                    </View>
                    <View row centerV marginT-10>
                        <View row centerV marginR-10>
                            <Icon name="star" size={18} color={Colors.yellow20} />
                            <Text style={[styles.infoText, { fontWeight: '600' }]}>{restaurant.rating}</Text>
                        </View>
                    </View>
                    <View row spread centerV marginT-6>
                        <TouchableOpacity
                            onPress={toggleFollow}
                            disabled={loading}
                            style={{
                                backgroundColor: isFollowing ? "#ccc" : "#007bff",
                                padding: 10,
                                borderRadius: 5,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>
                                {isFollowing ? "Đã theo dõi" : "Theo dõi"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    data={foods}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) =>
                        <FoodCard
                            key={item.id}
                            item={item}
                            navigation={navigation}
                        />
                    }
                    scrollEnabled={false}
                    contentContainerStyle={styles.foodListContainer}
                />
            </ScrollView>


            {/* Comment Section */}
            <View style={styles.commentSection}>
                <Text style={styles.commentHeader}>Bình luận</Text>
                {comment.length > 0 ? (
                    <FlatList data={comment} renderItem={({ item }) => (
                        <View style={styles.reviewItem}>
                            <Text style={styles.reviewUser}>{item.name}</Text>
                            <RenderHTML
                                contentWidth={width}
                                source={{ html: item.content }}
                                defaultTextProps={{
                                    style: {
                                        fontSize: 17, // Adjust font size here
                                    },
                                }}
                            />
                            <Text>Đánh giá: {item.rate}★</Text>
                        </View>
                    )} keyExtractor={(item) => item.id.toString()} />
                ) : (
                    <Text>Chưa có đánh giá nào.</Text>
                )}

                {isLoggedIn && (
                    <View style={styles.addReviewContainer}>
                        <Text>Viết đánh giá</Text>
                        <AirbnbRating count={5} rating={rating} size={30} onFinishRating={setRating} fullStarColor="gold" />
                        <TextInput style={styles.commentInput} placeholder="Nhập bình luận của bạn..." value={review} onChangeText={setReview} multiline />
                        <TouchableOpacity style={styles.submitButton} onPress={postComment}>
                            <Text style={styles.submitButtonText}>Gửi</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {!isLoggedIn && (
                    <View style={FoodDetailStyles.notLoggedInContainer}>
                        <Text style={FoodDetailStyles.notLoggedInText}>
                            Bạn cần đăng nhập để có thể bình luận cho cửa hàng này. Vui lòng đăng nhập.
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default StoreDetail;

const styles = StyleSheet.create({
    backgroundImage: { width: '100%', height: 300, resizeMode: 'cover' },
    infoContainer: { padding: 16, backgroundColor: Colors.white },
    name: { fontSize: 24, fontWeight: '500', color: Colors.dark10 },
    phoneBtn: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: Colors.yellow80, borderRadius: 10 },
    phoneText: { marginLeft: 6, color: Colors.yellow20, fontWeight: '600' },
    foodListContainer: { paddingVertical: 10 },
    commentSection: { padding: 16, backgroundColor: Colors.white },
    commentHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    reviewItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    reviewUser: { fontWeight: 'bold' },
    addReviewContainer: { marginTop: 20 },
    commentInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginTop: 10, minHeight: 50 },
    submitButton: { backgroundColor: Colors.blue30, padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' },
    submitButtonText: { color: 'white', fontWeight: 'bold' }
});
