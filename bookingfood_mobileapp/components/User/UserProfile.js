import React, { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, FlatList, TouchableOpacity, RefreshControl } from "react-native"; // Import RefreshControl
import { Button, Card, Divider } from "react-native-paper";
import styles from "./UserProfileStyles";
import {authApis, BASE_URL, endpoints} from "../../configs/APIs";
import { MyDispatchContext, MyUserContext } from "../../configs/UserContexts";
import Styles from "../../styles/Styles";

const UserProfile = () => {
  const { user } = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigation();

  const [refreshing, setRefreshing] = useState(false); // Refreshing state
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchUserProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    const api = await authApis(token);
    try {
      const response = await api.get(endpoints['current-user']);
      dispatch({ type: "update_user", payload: response.data }); // Update user context with fetched data
    } catch (error) {
      console.log("Lỗi khi tải dữ liệu người dùng:", error.response?.data || error.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user_id");
    await AsyncStorage.removeItem(`shoppingCart_${user.id}`);
    dispatch({ type: "logout" });
    nav.navigate("Home");
  };

  const renderHeader = () => (
      <>
        <Card style={styles.card}>
          <Card.Content style={styles.header}>
            <TouchableOpacity onPress={() => nav.navigate("UploadAvatar")}>
              <Image source={{ uri: user.image }} style={styles.avatar} />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.name}>{user?.first_name || "N/A"} {user?.last_name || ""}</Text>
              <Text style={styles.role}>
                {user?.user_role === 0 ? "Người dùng" : user?.user_role === 1 ? "Chủ cửa hàng" : "N/A"}
              </Text>
            </View>
          </Card.Content>
        </Card>
        <Button mode="contained" onPress={() => nav.navigate("EditUser")} style={styles.uploadAvatarButton}>Chỉnh sửa thông tin người dùng</Button>

        <Button
            mode="contained"
            onPress={() => nav.navigate("ManageAddress")}
            style={styles.uploadAvatarButton}
        >
          Quản lý địa chỉ
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
              <Text style={styles.value}>
                {user?.user_role === 0 ? "Người dùng" : user?.user_role === 1 ? "Chủ cửa hàng" : "N/A"}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Tạo cửa hàng */}
        {user?.user_role === 0 && !user?.store && (
            <>
              <Button
                  mode="contained"
                  onPress={() => nav.navigate("RestaurantRegister")}
                  style={styles.registerButton}
              >
                Đăng kí cửa hàng
              </Button>
            </>
        )}

        {user?.user_role === 0 && user?.store && (
            <View style={Styles.centeredBox}>
              <Text style={Styles.centeredText}>
                Vui lòng chờ admin xác nhận cửa hàng bạn
              </Text>
            </View>
        )}

        {user?.user_role === 1 && user?.store && (
            <>
              <Button
                  mode="contained"
                  onPress={() => nav.navigate("StoreOrder")}
                  style={styles.registerButton}
              >
                Quản lý hóa đơn
              </Button>
              <Button
                  mode="contained"
                  onPress={() => nav.navigate("Statistics")} // Replace "NewRoute" with the desired navigation route
                  style={styles.registerButton} // Define another button style in your stylesheet
              >
                Xem doanh thu cửa hàng
              </Button>
              <Button
                  mode="contained"
                  onPress={() => nav.navigate("AddMenu")}
                  style={styles.registerButton}
              >
                Quản lý menu
              </Button>
              <Button
                  mode="contained"
                  onPress={() => nav.navigate("ManageFood")}
                  style={styles.registerButton}
              >
                Quản lý đồ ăn
              </Button>
              <Button
                  mode="contained"
                  onPress={() => nav.navigate("AddFood")}
                  style={styles.registerButton}
              >
                Thêm món ăn
              </Button>

            </>
        )}
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

          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }

          ListFooterComponent={
            <>
              <Button mode="contained" onPress={logout} style={styles.logoutButton}>Đăng xuất</Button>
            </>
          }
      />
  );
};

export default UserProfile;
