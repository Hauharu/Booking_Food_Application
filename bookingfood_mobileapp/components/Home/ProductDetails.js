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
} from "react-native";
import ProductDetailStyles from "./ProductDetailStyles";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AirbnbRating } from "react-native-ratings";
import { MyUserContext } from "../../configs/UserContexts";

LogBox.ignoreLogs([
  "Warning: Star: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
  "Warning: TapRating: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
  "Warning: Text strings must be rendered within a <Text> component.",
]);

const ProductDetails = ({ route }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [rating, setRating] = useState(5);
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [store, setStore] = useState(null);
  const navigation = useNavigation();
  const { user } = useContext(MyUserContext);
  const { productId } = route.params;

  const loadProductDetails = async () => {
    try {
      const res = await APIs.get(endpoints["product-details"](productId));
      setProduct(res.data);
      setReviews(res.data.reviews || []);
      const storeRes = await APIs.get(endpoints["stores"] + res.data.store);
      setStore(storeRes.data);
    } catch (error) {
      console.error("Error loading product details:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin sản phẩm. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const loadUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("user_id");
      if (storedUserId) {
        setUserId(storedUserId);
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
    loadProductDetails();
  }, [productId]);

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      Alert.alert("Thông báo", "Bạn cần đăng nhập để sử dụng tính năng này");
      return;
    }
    const totalPrice = product.price * quantity;
    const form = new FormData();
    form.append("user", user.id.toString());
    form.append("total_price", totalPrice);
    form.append("payment_method", "money");
    form.append("status", "pending");

    try {
      const orderResponse = await APIs.post(endpoints["order"], form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (orderResponse && orderResponse.data.id) {
        const orderId = orderResponse.data.id;
        const orderItemsForm = new FormData();

        console.log(`Gửi đơn hàng với store: ${store.id}`);

        orderItemsForm.append("order", orderId);
        orderItemsForm.append("product", productId);
        orderItemsForm.append("quantity", quantity);
        orderItemsForm.append("price", parseFloat(product.price).toFixed(2));

        await APIs.post(endpoints["order-item"], orderItemsForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        navigation.navigate("Bill", { orderId: orderId });
      } else {
        Alert.alert("Lỗi", "Không thể tạo đơn hàng!");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Lỗi", "Không thể tạo đơn hàng!");
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      Alert.alert("Thông báo", "Bạn cần đăng nhập để thực hiện hành động này");
      return;
    }

    try {
      const res = await APIs.get(endpoints["product-details"](productId));
      const newItem = {
        id: res.data.id,
        name: res.data.name,
        store: res.data.store,
        price: res.data.price,
        quantity: quantity,
        image: res.data.image,
      };

      const storedUserId = await AsyncStorage.getItem("user_id");
      const storedCart = await AsyncStorage.getItem(
        `shoppingCart_${storedUserId}`
      );
      const cart = storedCart ? JSON.parse(storedCart) : [];

      const existingItemIndex = cart.findIndex(
        (item) => item.id === newItem.id
      );
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
      } else {
        cart.push(newItem);
      }

      await AsyncStorage.setItem(
        `shoppingCart_${storedUserId}`,
        JSON.stringify(cart)
      );

      setCartItems(cart);
      Alert.alert("Giỏ hàng", `Đã thêm ${newItem.name} vào giỏ hàng!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert(
        "Lỗi",
        "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!"
      );
    }
  };

  const handleCompareProduct = async () => {
    try {
      let currentPage = 1;
      let allProducts = [];
      let hasMore = true;

      while (hasMore) {
        const response = await APIs.get(endpoints["products"], {
          params: {
            page: currentPage, // Gửi tham số trang
          },
        });

        if (response.data && Array.isArray(response.data.results)) {
          allProducts = [...allProducts, ...response.data.results];

          hasMore = response.data.next !== null;
          currentPage += 1;
        } else {
          hasMore = false;
        }
      }

      const filteredProducts = allProducts.filter(
        (item) => item.name === product.name && item.id !== product.id
      );

      if (filteredProducts.length === 0) {
        Alert.alert(
          "Thông báo",
          "Không tìm thấy sản phẩm cùng tên từ các cửa hàng khác!"
        );
      } else {
        navigation.navigate("ProductComparison", {
          products: filteredProducts,
          product: product,
        });
      }
    } catch (error) {
      console.error("Error comparing products:", error);
      Alert.alert("Lỗi", "Không thể tải sản phẩm so sánh. Vui lòng thử lại!");
    }
  };

  const postReview = async () => {
    if (!isLoggedIn) {
      Alert.alert("", "Vui lòng đăng nhập!");
      return;
    }
    if (!comment.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung bình luận!");
      return;
    }

    try {
      const payload = {
        user: userId,
        product: productId,
        comment: comment,
        rating: rating,
      };

      await APIs.post(endpoints["reviews"], payload);
      Alert.alert("Thành công", "Bình luận của bạn đã được gửi!");
      setComment("");
      setRating(5);
      loadProductDetails();
    } catch (error) {
      console.error("Error posting review:", error);
      Alert.alert("Lỗi", "Không thể gửi bình luận. Vui lòng thử lại!");
    }
  };
  const loadReviews = async () => {
    try {
      const res = await APIs.get(endpoints["reviews"](productId));
      const reviewsData = res.data;
      const groupedReviews = groupReviewsByParent(reviewsData);
      setReviews(groupedReviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
      Alert.alert("Lỗi", "Không thể tải bình luận. Vui lòng thử lại!");
    }
  };

  const groupReviewsByParent = (reviews) => {
    const commentMap = {}; // Using an object to map reviews by ID

    // First, create the map of all reviews
    reviews.forEach((review) => {
      commentMap[review.id] = { ...review, responses: [] };
    });

    // Then, associate replies with their parent comment
    reviews.forEach((review) => {
      if (review.parent_review) {
        const parent = commentMap[review.parent_review];
        if (parent) {
          parent.responses.push(review); // Attach reply to the parent comment
        }
      }
    });

    // Now filter out parent comments and sort them by date
    const grouped = Object.values(commentMap)
      .filter((review) => review.parent_review === null) // Only root comments
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Sort the replies within each parent comment
    grouped.forEach((review) => {
      review.responses.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    });

    return grouped;
  };

  const renderReviewItem = ({ item }) => {
    // Kiểm tra nếu bình luận có parent_review (không phải bình luận gốc) thì không hiển thị
    if (item.parent_review !== null) {
      return null;
    }

    return (
      <View style={ProductDetailStyles.reviewItem}>
        {/* Bình luận gốc */}
        <Text style={ProductDetailStyles.reviewUser}>{item.user}</Text>
        <Text style={ProductDetailStyles.reviewComment}>{item.comment}</Text>

        {/* Các phản hồi */}
        {item.responses && item.responses.length > 0 && (
          <View style={{ marginLeft: 20 }}>
            {item.responses.map((reply) => (
              <View key={reply.id} style={ProductDetailStyles.replyItem}>
                <Text style={ProductDetailStyles.replyUser}>{reply.user}</Text>
                <Text style={ProductDetailStyles.replyComment}>
                  {reply.comment}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Nút trả lời */}
        {isLoggedIn && (
          <TouchableOpacity
            style={ProductDetailStyles.replyButton}
            onPress={() => setReplyToCommentId(item.id)}
          >
            <Text style={ProductDetailStyles.replyButtonText}>Trả lời</Text>
          </TouchableOpacity>
        )}

        {/* Ô nhập phản hồi */}
        {replyToCommentId === item.id && isLoggedIn && (
          <View style={ProductDetailStyles.addReplyContainer}>
            <TextInput
              style={ProductDetailStyles.commentInput}
              placeholder="Nhập bình luận của bạn..."
              value={comment}
              onChangeText={(text) => setComment(text)}
              multiline
            />
            <TouchableOpacity
              style={ProductDetailStyles.submitButton}
              onPress={postReply} // Gửi phản hồi
            >
              <Text style={ProductDetailStyles.submitButtonText}>Gửi</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const postReply = async () => {
    if (!isLoggedIn) {
      Alert.alert("Thông báo", "Vui lòng đăng nhập để trả lời bình luận!");
      return;
    }
    if (!comment.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung bình luận!");
      return;
    }

    try {
      const payload = {
        user: userId,
        product: productId,
        comment: comment,
        rating: rating,
        parent_review: replyToCommentId, // Thêm ID bình luận gốc
      };

      await APIs.post(endpoints["reviews"], payload);
      Alert.alert("Thành công", "Bình luận của bạn đã được gửi!");
      setComment("");
      setRating(5);
      setReplyToCommentId(null);
      loadProductDetails(); // Cập nhật lại bình luận
    } catch (error) {
      console.error("Error posting reply:", error);
      Alert.alert("Lỗi", "Không thể gửi bình luận. Vui lòng thử lại!");
    }
  };

  if (loading) {
    return (
      <View style={ProductDetailStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={ProductDetailStyles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={ProductDetailStyles.errorContainer}>
        <Text style={ProductDetailStyles.errorText}>
          Không tìm thấy sản phẩm. Vui lòng thử lại sau.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={[product]} // Wrap product details in an array to use with FlatList
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={ProductDetailStyles.container}>
          <Image
            source={{ uri: item.image }}
            style={ProductDetailStyles.productImage}
            resizeMode="cover"
          />
          <View style={ProductDetailStyles.infoContainer}>
            <Text style={ProductDetailStyles.productName}>{item.name}</Text>
            <Text style={ProductDetailStyles.productPrice}>${item.price}</Text>
            <Text style={ProductDetailStyles.productStock}>
              Số lượng còn: {item.stock_quantity}
            </Text>
            <Text style={ProductDetailStyles.productDescription}>
              {item.description || "Mô tả sản phẩm chưa được cập nhật."}
            </Text>
          </View>
          <TouchableOpacity
            style={ProductDetailStyles.chatButton}
            onPress={() => {
              if (!isLoggedIn) {
                Alert.alert(
                  "Thông báo",
                  "Bạn cần đăng nhập để trò chuyện với người bán"
                );
                return;
              }
              navigation.navigate("ChatScreen", {
                storeId: store.id,
                userId2: store.seller,
              });
            }}
          >
            <Text style={ProductDetailStyles.chatButtonText}>
              Chat with Seller
            </Text>
          </TouchableOpacity>

          {store && (
            <View style={ProductDetailStyles.storeContainer}>
              <Text style={ProductDetailStyles.storeHeader}>
                Thông tin cửa hàng
              </Text>
              <Image
                source={{ uri: store.image }}
                style={ProductDetailStyles.storeImage}
                resizeMode="cover"
              />
              <Text style={ProductDetailStyles.storeName}>
                Tên: {store.name}
              </Text>
              <Text style={ProductDetailStyles.storeDescription}>
                Mô tả: {store.description || "Đang cập nhật."}
              </Text>
              <Text style={ProductDetailStyles.storeRating}>
                Đánh giá: {store.rating || "Chưa có đánh giá"}★
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={ProductDetailStyles.compareButton}
            onPress={handleCompareProduct}
          >
            <Text style={ProductDetailStyles.compareButtonText}>
              So sánh sản phẩm
            </Text>
          </TouchableOpacity>

          <View style={ProductDetailStyles.quantityContainer}>
            <TouchableOpacity
              style={ProductDetailStyles.quantityButton}
              onPress={() => setQuantity((prev) => Math.max(prev - 1, 1))} // Không cho giảm dưới 1
            >
              <Text style={ProductDetailStyles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={ProductDetailStyles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={ProductDetailStyles.quantityButton}
              onPress={() => setQuantity((prev) => prev + 1)}
            >
              <Text style={ProductDetailStyles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Button for buying product */}
          <TouchableOpacity
            style={ProductDetailStyles.buyButton}
            onPress={handleBuyNow}
          >
            <Text style={ProductDetailStyles.buyButtonText}>Mua ngay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ProductDetailStyles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={ProductDetailStyles.addToCartButtonText}>
              Thêm vào giỏ hàng
            </Text>
          </TouchableOpacity>

          {/* Reviews Section */}
          <View style={ProductDetailStyles.reviewsContainer}>
            <Text style={ProductDetailStyles.reviewsHeader}>
              Đánh giá sản phẩm
            </Text>
            {reviews.length > 0 ? (
              <FlatList
                data={reviews}
                renderItem={renderReviewItem}
                keyExtractor={(item) => item.id.toString()}
              />
            ) : (
              <Text style={ProductDetailStyles.noReviewsText}>
                Chưa có đánh giá nào.
              </Text>
            )}
          </View>

          {/* Add review form */}
          {isLoggedIn && (
            <View style={ProductDetailStyles.addReviewContainer}>
              <Text style={ProductDetailStyles.addReviewHeader}>
                Viết đánh giá
              </Text>

              <AirbnbRating
                count={5}
                rating={rating}
                size={30}
                onFinishRating={(rate) => setRating(rate)}
                fullStarColor="gold"
              />
              <TextInput
                style={ProductDetailStyles.commentInput}
                placeholder="Nhập bình luận của bạn..."
                value={comment}
                onChangeText={(text) => setComment(text)}
                multiline
              />
              <TouchableOpacity
                style={ProductDetailStyles.submitButton}
                onPress={postReview}
              >
                <Text style={ProductDetailStyles.submitButtonText}>Gửi</Text>
              </TouchableOpacity>
            </View>
          )}
          {!isLoggedIn && (
            <View style={ProductDetailStyles.notLoggedInContainer}>
              <Text style={ProductDetailStyles.notLoggedInText}>
                Bạn cần đăng nhập để thực hiện hành động này. Vui lòng đăng
                nhập.
              </Text>
            </View>
          )}
        </View>
      )}
    />
  );
};

export default ProductDetails;
