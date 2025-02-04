import React, { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, FlatList, ScrollView,TouchableOpacity } from "react-native";
import { Button, Card, Divider } from "react-native-paper";
import styles from "./UserProfileStyles";
import { BASE_URL } from "../../configs/APIs";
import { MyDispatchContext, MyUserContext } from "../../configs/UserContexts";
import db from "../../configs/firebase";
import { ref, get, child, onValue } from "firebase/database";

const UserProfile = () => {
  const { user } = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigation();

  const [pendingSellers, setPendingSellers] = useState([]);
  const [showPendingSellers, setShowPendingSellers] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [chatUsers, setChatUsers] = useState([]);
  const [showChatUsers, setShowChatUsers] = useState(false);

  // Example data (you would get this from your backend or Firebase)
  const [recentActivities, setRecentActivities] = useState([]);
  const [averageRating, setAverageRating] = useState(4.5); 
  const [badges, setBadges] = useState([{ id: 1, name: "Top Shoppers" }]);

  const logout = async () => {
    await AsyncStorage.removeItem("user_id");
    await AsyncStorage.removeItem(`shoppingCart_${user.id}`);
    dispatch({ type: "logout" });
    nav.navigate("Home");
  };

  // Fetch pending sellers
  const fetchPendingSellers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Không tìm thấy token, vui lòng đăng nhập lại.");
        return;
      }

      const response = await fetch(`${BASE_URL}/manage_sellers/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setPendingSellers(data);
      } else {
        console.log("Lỗi khi lấy danh sách seller:", data);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  const approveSeller = async (sellerId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Không tìm thấy token, vui lòng đăng nhập lại.");
        return;
      }

      const response = await fetch(`${BASE_URL}/manage_sellers/${sellerId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "approved" }),
      });

      if (response.ok) {
        setPendingSellers((prevSellers) =>
          prevSellers.filter((seller) => seller.id !== sellerId)
        );
        console.log(`Seller ${sellerId} đã được duyệt.`);
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi duyệt seller:", errorData);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      const userId = await AsyncStorage.getItem("user_id");

      if (!userId) return;

      const messagesRef = ref(db, `messages/${userId}`);
      onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const messages = snapshot.val();
          const unreadCount = Object.values(messages).reduce((count, msg) => {
            if (msg.read === false) {
              count++;
            }
            return count;
          }, 0);
          setUnreadMessages(unreadCount);
        } else {
          setUnreadMessages(0);
        }
      });
    };

    fetchUnreadMessages();
  }, []);

  useEffect(() => {
    if (user?.role === "employee") {
      fetchPendingSellers();
    }
  }, [user]);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.header}>
          <TouchableOpacity onPress={() => nav.navigate("UploadAvatar")}>
            <Image
              source={{
                uri: user?.avatar
                  ? `${BASE_URL}${user.avatar}`
                  : "https://cdn-icons-png.flaticon.com/128/4140/4140048.png",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.name}>
              {user?.first_name || "N/A"} {user?.last_name || ""}
            </Text>
            <Text style={styles.role}>{user?.role || "Người dùng"}</Text>
          </View>
        </Card.Content>a
      </Card>

      {/* Profile Customization Button */}
      <Button
        mode="contained"
        onPress={() => nav.navigate("UploadAvatar")}
        style={styles.uploadAvatarButton}
      >
        Thay đổi avatar
      </Button>

      {/* Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <Divider style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.label}>Họ:</Text>
            <Text style={styles.value}>{user?.first_name || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Tên:</Text>
            <Text style={styles.value}>{user?.last_name || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}>{user?.phone || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Vai trò:</Text>
            <Text style={styles.value}>{user?.role || "Người dùng"}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Activities */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          <Divider style={styles.divider} />
          <FlatList
            data={recentActivities}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.detailRow}>
                <Text style={styles.label}>{item.description}</Text>
              </View>
            )}
          />
        </Card.Content>
      </Card>

      {/* User Rating */}
      <View style={styles.detailRow}>
        <Text style={styles.label}>Đánh giá trung bình:</Text>
        <Text style={styles.value}>{averageRating || "Chưa có đánh giá"}</Text>
      </View>

      {/* User Badges */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Danh hiệu & Thành tích</Text>
          <Divider style={styles.divider} />
          <FlatList
            data={badges}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.badgeRow}>
                <Text style={styles.badge}>{item.name}</Text>
              </View>
            )}
          />
        </Card.Content>
      </Card>

      {/* Chat and Pending Sellers (existing) */}
      {user?.role !== "admin" && (
        <Button
          mode="contained"
          onPress={() => setShowChatUsers(!showChatUsers)}
          style={styles.receiveMessagesButton}
        >
          {unreadMessages > 0
            ? `Bạn có ${unreadMessages} tin nhắn chưa đọc`
            : chatUsers.length > 0
            ? `Có ${chatUsers.length} người đã nhắn tin`
            : "Nhận tin nhắn"}
        </Button>
      )}

      {showChatUsers && chatUsers.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Danh sách người nhắn tin</Text>
            <Divider style={styles.divider} />
            <FlatList
              data={chatUsers}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Người dùng: {item}</Text>
                  <Button
                    style={styles.value}
                    mode="contained"
                    onPress={() => nav.navigate("ChatScreen", { userId2: item })}
                  >
                    Chat ngay
                  </Button>
                </View>
              )}
            />
          </Card.Content>
        </Card>
      )}

      {user?.role === "employee" && (
        <Button
          mode="contained"
          onPress={() => setShowPendingSellers(!showPendingSellers)}
          style={styles.pendingSellersButton}
        >
          {showPendingSellers
            ? "Ẩn danh sách chờ duyệt"
            : "Xem seller chờ duyệt"}
        </Button>
      )}

      {showPendingSellers && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Danh sách seller chờ duyệt</Text>
            <Divider style={styles.divider} />
            <FlatList
              data={pendingSellers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.detailRow}>
                  <Text style={styles.label}>
                    Seller: {item.first_name} {item.last_name}
                  </Text>
                  <Button
                    style={styles.value}
                    mode="contained"
                    onPress={() => approveSeller(item.id)}
                  >
                    Duyệt
                  </Button>
                </View>
              )}
            />
          </Card.Content>
        </Card>
      )}

      <Button mode="contained" onPress={logout} style={styles.logoutButton}>
        Đăng xuất
      </Button>
    </ScrollView>
  );
};

export default UserProfile;
