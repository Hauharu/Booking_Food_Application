import React, { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { Button, Card, Divider } from "react-native-paper";
import styles from "./UserProfileStyles";
import { BASE_URL } from "../../configs/APIs";
import { MyDispatchContext, MyUserContext } from "../../configs/UserContexts";
import db from "../../configs/firebase";
import { ref, onValue } from "firebase/database";

const UserProfile = () => {
  const { user } = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigation();

  const [pendingSellers, setPendingSellers] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [chatUsers, setChatUsers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [averageRating, setAverageRating] = useState(4.5);
  const [badges, setBadges] = useState([{ id: 1, name: "Top Shoppers" }]);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user_id");
    await AsyncStorage.removeItem(`shoppingCart_${user.id}`);
    dispatch({ type: "logout" });
    nav.navigate("Home");
  };

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) return;
      const messagesRef = ref(db, `messages/${userId}`);
      onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const messages = snapshot.val();
          const unreadCount = Object.values(messages).reduce((count, msg) => (msg.read === false ? count + 1 : count), 0);
          setUnreadMessages(unreadCount);
        } else {
          setUnreadMessages(0);
        }
      });
    };
    fetchUnreadMessages();
  }, []);

  const renderHeader = () => (
    <>
      <Card style={styles.card}>
        <Card.Content style={styles.header}>
          <TouchableOpacity onPress={() => nav.navigate("UploadAvatar")}> 
            <Image source={{ uri: user?.avatar ? `${BASE_URL}${user.avatar}` : "https://cdn-icons-png.flaticon.com/128/4140/4140048.png" }} style={styles.avatar} />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.name}>{user?.first_name || "N/A"} {user?.last_name || ""}</Text>
            <Text style={styles.role}>{user?.role || "Người dùng"}</Text>
          </View>
        </Card.Content>
      </Card>
      <Button mode="contained" onPress={() => nav.navigate("UploadAvatar")} style={styles.uploadAvatarButton}>Thay đổi avatar</Button>
    </>
  );

  return (
    <FlatList
      ListHeaderComponent={renderHeader}
      data={recentActivities}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>{item.description}</Text>
          </Card.Content>
        </Card>
      )}
      ListFooterComponent={
        <>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Đánh giá trung bình: {averageRating}</Text>
              <Divider style={styles.divider} />
              <FlatList
                data={badges}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.badge}>{item.name}</Text>
                )}
              />
            </Card.Content>
          </Card>
          <Button mode="contained" onPress={logout} style={styles.logoutButton}>Đăng xuất</Button>
        </>
      }
    />
  );
};

export default UserProfile;
