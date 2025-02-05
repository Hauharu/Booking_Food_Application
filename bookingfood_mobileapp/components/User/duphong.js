// // UserProfile hoàn chỉnh 
// // import React, { useEffect, useState, useContext } from "react";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { useNavigation } from "@react-navigation/native";
// // import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
// // import { Button, Card, Divider } from "react-native-paper";
// // import styles from "./UserProfileStyles";
// // import { BASE_URL } from "../../configs/APIs";
// // import { MyDispatchContext, MyUserContext } from "../../configs/UserContexts";
// // import db from "../../configs/firebase";
// // import { ref, onValue } from "firebase/database";

// // const UserProfile = () => {
// //   const { user } = useContext(MyUserContext);
// //   const dispatch = useContext(MyDispatchContext);
// //   const nav = useNavigation();

// //   const [pendingSellers, setPendingSellers] = useState([]);
// //   const [showPendingSellers, setShowPendingSellers] = useState(false);
// //   const [unreadMessages, setUnreadMessages] = useState(0);
// //   const [chatUsers, setChatUsers] = useState([]);
// //   const [showChatUsers, setShowChatUsers] = useState(false);

// //   // Example data (you would get this from your backend or Firebase)
// //   const [recentActivities, setRecentActivities] = useState([]);
// //   const [averageRating, setAverageRating] = useState(4.5);
// //   const [badges, setBadges] = useState([{ id: 1, name: "Top Shoppers" }]);

// //   const logout = async () => {
// //     await AsyncStorage.removeItem("user_id");
// //     await AsyncStorage.removeItem(`shoppingCart_${user.id}`);
// //     dispatch({ type: "logout" });
// //     nav.navigate("Home");
// //   };

// //   // Fetch pending sellers
// //   const fetchPendingSellers = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       if (!token) {
// //         console.error("Không tìm thấy token, vui lòng đăng nhập lại.");
// //         return;
// //       }

// //       const response = await fetch(`${BASE_URL}/manage_sellers/`, {
// //         method: "GET",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       const data = await response.json();
// //       if (response.ok) {
// //         setPendingSellers(data);
// //       } else {
// //         console.log("Lỗi khi lấy danh sách seller:", data);
// //       }
// //     } catch (error) {
// //       console.error("Lỗi kết nối:", error);
// //     }
// //   };

// //   const approveSeller = async (sellerId) => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       if (!token) {
// //         console.error("Không tìm thấy token, vui lòng đăng nhập lại.");
// //         return;
// //       }

// //       const response = await fetch(`${BASE_URL}/manage_sellers/${sellerId}/`, {
// //         method: "PATCH",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({ status: "approved" }),
// //       });

// //       if (response.ok) {
// //         setPendingSellers((prevSellers) =>
// //           prevSellers.filter((seller) => seller.id !== sellerId)
// //         );
// //         console.log(`Seller ${sellerId} đã được duyệt.`);
// //       } else {
// //         const errorData = await response.json();
// //         console.error("Lỗi khi duyệt seller:", errorData);
// //       }
// //     } catch (error) {
// //       console.error("Lỗi kết nối:", error);
// //     }
// //   };

// //   // Fetch unread messages count
// //   useEffect(() => {
// //     const fetchUnreadMessages = async () => {
// //       const userId = await AsyncStorage.getItem("user_id");

// //       if (!userId) return;

// //       const messagesRef = ref(db, `messages/${userId}`);
// //       onValue(messagesRef, (snapshot) => {
// //         if (snapshot.exists()) {
// //           const messages = snapshot.val();
// //           const unreadCount = Object.values(messages).reduce((count, msg) => {
// //             if (msg.read === false) {
// //               count++;
// //             }
// //             return count;
// //           }, 0);
// //           setUnreadMessages(unreadCount);
// //         } else {
// //           setUnreadMessages(0);
// //         }
// //       });
// //     };

// //     fetchUnreadMessages();
// //   }, []);

// //   useEffect(() => {
// //     if (user?.role === "employee") {
// //       fetchPendingSellers();
// //     }
// //   }, [user]);

// //   return (
// //     <ScrollView style={styles.container}>
// //       {/* User Info Card */}
// //       <Card style={styles.card}>
// //         <Card.Content style={styles.header}>
// //           <TouchableOpacity onPress={() => nav.navigate("UploadAvatar")}>
// //             <Image
// //               source={{
// //                 uri: user?.avatar
// //                   ? `${BASE_URL}${user.avatar}`
// //                   : "https://cdn-icons-png.flaticon.com/128/4140/4140048.png",
// //               }}
// //               style={styles.avatar}
// //             />
// //           </TouchableOpacity>
// //           <View style={styles.userInfo}>
// //             <Text style={styles.name}>
// //               {user?.first_name || "N/A"} {user?.last_name || ""}
// //             </Text>
// //             <Text style={styles.role}>{user?.role || "Người dùng"}</Text>
// //           </View>
// //         </Card.Content>
// //       </Card>

// //       {/* Profile Customization Button */}
// //       <Button
// //         mode="contained"
// //         onPress={() => nav.navigate("UploadAvatar")}
// //         style={styles.uploadAvatarButton}
// //       >
// //         Thay đổi avatar
// //       </Button>

// //       {/* Info Card */}
// //       <Card style={styles.card}>
// //         <Card.Content>
// //           <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
// //           <Divider style={styles.divider} />
// //           <View style={styles.detailRow}>
// //             <Text style={styles.label}>Họ:</Text>
// //             <Text style={styles.value}>{user?.first_name || "N/A"}</Text>
// //           </View>
// //           <View style={styles.detailRow}>
// //             <Text style={styles.label}>Tên:</Text>
// //             <Text style={styles.value}>{user?.last_name || "N/A"}</Text>
// //           </View>
// //           <View style={styles.detailRow}>
// //             <Text style={styles.label}>Số điện thoại:</Text>
// //             <Text style={styles.value}>{user?.phone || "N/A"}</Text>
// //           </View>
// //           <View style={styles.detailRow}>
// //             <Text style={styles.label}>Email:</Text>
// //             <Text style={styles.value}>{user?.email || "N/A"}</Text>
// //           </View>
// //           <View style={styles.detailRow}>
// //             <Text style={styles.label}>Vai trò:</Text>
// //             <Text style={styles.value}>{user?.role || "Người dùng"}</Text>
// //           </View>
// //         </Card.Content>
// //       </Card>

// //       {/* Recent Activities */}
// //       <Card style={styles.card}>
// //         <Card.Content>
// //           <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
// //           <Divider style={styles.divider} />
// //           {recentActivities.map((item) => (
// //             <View key={item.id.toString()} style={styles.detailRow}>
// //               <Text style={styles.label}>{item.description}</Text>
// //             </View>
// //           ))}
// //         </Card.Content>
// //       </Card>

// //       {/* User Rating */}
// //       <View style={styles.detailRow}>
// //         <Text style={styles.label}>Đánh giá trung bình:</Text>
// //         <Text style={styles.value}>{averageRating || "Chưa có đánh giá"}</Text>
// //       </View>

// //       {/* User Badges */}
// //       <Card style={styles.card}>
// //         <Card.Content>
// //           <Text style={styles.sectionTitle}>Danh hiệu & Thành tích</Text>
// //           <Divider style={styles.divider} />
// //           {badges.map((item) => (
// //             <View key={item.id.toString()} style={styles.badgeRow}>
// //               <Text style={styles.badge}>{item.name}</Text>
// //             </View>
// //           ))}
// //         </Card.Content>
// //       </Card>

// //       {/* Chat Users */}
// //       {user?.role !== "admin" && (
// //         <Button
// //           mode="contained"
// //           onPress={() => setShowChatUsers(!showChatUsers)}
// //           style={styles.receiveMessagesButton}
// //         >
// //           {unreadMessages > 0
// //             ? `Bạn có ${unreadMessages} tin nhắn chưa đọc`
// //             : chatUsers.length > 0
// //             ? `Có ${chatUsers.length} người đã nhắn tin`
// //             : "Nhận tin nhắn"}
// //         </Button>
// //       )}

// //       {showChatUsers && chatUsers.length > 0 && (
// //         <Card style={styles.card}>
// //           <Card.Content>
// //             <Text style={styles.sectionTitle}>Danh sách người nhắn tin</Text>
// //             <Divider style={styles.divider} />
// //             {chatUsers.map((item, index) => (
// //               <View key={index} style={styles.detailRow}>
// //                 <Text style={styles.label}>Người dùng: {item}</Text>
// //                 <Button
// //                   style={styles.value}
// //                   mode="contained"
// //                   onPress={() => nav.navigate("ChatScreen", { userId2: item })}
// //                 >
// //                   Chat ngay
// //                 </Button>
// //               </View>
// //             ))}
// //           </Card.Content>
// //         </Card>
// //       )}

// //       {/* Pending Sellers */}
// //       {user?.role === "employee" && (
// //         <Button
// //           mode="contained"
// //           onPress={() => setShowPendingSellers(!showPendingSellers)}
// //           style={styles.pendingSellersButton}
// //         >
// //           {showPendingSellers
// //             ? "Ẩn danh sách chờ duyệt"
// //             : "Xem seller chờ duyệt"}
// //         </Button>
// //       )}

// //       {showPendingSellers && (
// //         <Card style={styles.card}>
// //           <Card.Content>
// //             <Text style={styles.sectionTitle}>Danh sách seller chờ duyệt</Text>
// //             <Divider style={styles.divider} />
// //             {pendingSellers.map((item) => (
// //               <View key={item.id.toString()} style={styles.detailRow}>
// //                 <Text style={styles.label}>
// //                   Seller: {item.first_name} {item.last_name}
// //                 </Text>
// //                 <Button
// //                   style={styles.value}
// //                   mode="contained"
// //                   onPress={() => approveSeller(item.id)}
// //                 >
// //                   Duyệt
// //                 </Button>
// //               </View>
// //             ))}
// //           </Card.Content>
// //         </Card>
// //       )}

// //       <Button mode="contained" onPress={logout} style={styles.logoutButton}>
// //         Đăng xuất
// //       </Button>
// //     </ScrollView>
// //   );
// // };

// // export default UserProfile;

































// import { ActivityIndicator, Text, TouchableOpacity, View, Image, Keyboard, Alert } from "react-native";
// import { TextInput, Button } from "react-native-paper";
// import styles from "./RegisterStyles";
// import { ScrollView } from "react-native";
// import { useContext, useState } from "react";
// import * as ImagePicker from 'expo-image-picker';
// import APIs, { endpoints } from "../../configs/APIs";
// import axios from "axios";

// const RestaurantRegisterScreen = () => {
//     const [loading, setLoading] = useState(false);
//     const [image, setImage] = useState(null); // ảnh người dùng
//     const [imageRes, setImageRes] = useState(null); // ảnh nhà hàng

//     //thong tin nguoi dung
//     const [user, setUser] = useState({
//         'first_name': '',
//         'last_name': '',
//         'email': '',
//         'phone': '',
//         'username': '',
//         'password': '',
//         'confirm_password': ''
//     });
//     const users = {
//         'first_name': { 'title': 'Nhập họ', 'field': 'first_name', 'secure': false },
//         'last_name': { 'title': 'Nhập tên', 'field': 'last_name', 'secure': false },
//         'email': { 'title': 'Nhập địa chỉ email', 'field': 'email', 'secure': false },
//         'phone': { 'title': 'Nhập số điện thoại', 'field': 'phone', 'secure': false },
//         'username': { 'title': 'Nhập tên đăng nhập', 'field': 'username', 'secure': false },
//         'password': { 'title': 'Nhập mật khẩu', 'field': 'password', 'secure': true },
//         'confirm_password': { 'title': 'Xác nhận mật khẩu', 'field': 'confirm_password', 'secure': true }
//     };

//     // thông tin nha hang
//     const [resInfo, setResInfo] = useState({
//         "name": "",
//     });
//     const restaurant_info = {
//         "name": {
//             "title": "Tên cửa hàng",
//             "field": "name",
//             "secure": false,
//             "keyboardType": "default"
//         }
//     };

//     const updateUserRestaurant = (value, field) => {
//         setUser({ ...user, [field]: value });
//     };
//     const updateRestaurant = (value, field) => {
//         setResInfo({ ...resInfo, [field]: value });
//     };

//     const pickImage = async (imgType) => {
//         console.log("check:", imgType);
//         let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//             alert("Permissions denied!");
//         } else {
//             const result = await ImagePicker.launchImageLibraryAsync();
//             if (!result.canceled) {
//                 if (imgType === "imgUser") {
//                     setImage(result.assets[0]);
//                 } else if (imgType === "imgRes") {
//                     setImageRes(result.assets[0]);
//                 }
//             }
//         }
//     };

//     //validate du lieu 
//     const [errors, setErrors] = useState({});

//     const handleError = (errorMessage, input) => {
//         setErrors(prev => ({ ...prev, [input]: errorMessage }));
//     };

//     const handleFocus = (field) => {
//         setErrors(prev => ({ ...prev, [field]: null }));
//     };

//     const validate = () => {
//         Keyboard.dismiss();
//         let valid = true;

//         for (let u in user) {
//             if (!user[u]) {
//                 handleError(`${users[u].title} không được để trống`, u);
//                 valid = false;
//             }

//             if (u === "phone" && user[u].length !== 10) {
//                 handleError(`${users[u].title} phải có đúng 10 hoặc 11 chữ số`, u);
//                 valid = false;
//             }
//         }

//         return valid;
//     };

//     const [newUser, setNewUser] = useState({});
//     const createNewUser = async () => {
//         if (!validate()) {
//             return;
//         }
//         try {
//             const form = new FormData();
//             for (let u in user)
//                 if (u !== 'confirm')
//                     form.append(u, user[u]);
//             form.append('role', "restaurant-user");

//             if (image) {
//                 form.append('avatar', {
//                     uri: image.uri,
//                     name: image.uri.split('/').pop(),
//                     type: 'image/png'
//                 });
//             } else {
//                 form.append('image', 'Have not uploaded photos yet');
//             }

//             const response = await APIs.post(endpoints['createResUser'], form, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 }
//             });

//             if (response.status === 201) {
//                 console.log(response.data);
//                 setNewUser(response.data);
//                 return response.data.id;
//             }
//         } catch (ex) {
//             if (ex.response) {
//                 console.error('Server trả về lỗi:', ex.response.data);
//             } else {
//                 console.error('Lỗi không xác định:', ex.message);
//             }
//         } finally {
//             console.log('done add user res');
//         }
//     };

//     const [query, setQuery] = useState('');
//     const [addressRes, setAddressRes] = useState({
//         address_line: "",
//         latitude: "",
//         longitude: "",
//     });

//     const fetchAddress = async (address_line) => {
//         try {
//             const res = await axios.get(`https://maps.gomaps.pro/maps/api/geocode/json?key=AIzaSyCEI0WPbw3uhgoWtees1dBh1jbFPZHXLMc`, {
//                 params: { address_line: address_line },
//             });
//             if (res.data.status === 'OK') {
//                 console.log(res.data.results);

//                 const formatted_address = res.data.results[0].formatted_address;
//                 const location = res.data.results[0].geometry.location;

//                 console.log(formatted_address);
//                 console.log(location.lat);

//                 setAddressRes({
//                     address_line: formatted_address,
//                     latitude: location.lat,
//                     longitude: location.lng,
//                 });
//             } else {
//                 Alert.alert('Lỗi', 'Địa chỉ không hợp lệ, vui lòng kiểm tra lại.');
//                 setAddressRes({
//                     address_line: "",
//                     latitude: "",
//                     longitude: "",
//                 });
//             }
//         } catch (error) {
//             console.error('Error fetching address details:', error);
//         }
//     };

//     const registerRestaurant = async () => {
//         if (!validate()) {
//             return;
//         }
//         setLoading(true);
//         try {
//             const newUserId = await createNewUser();

//             const form = new FormData();
//             for (let r in resInfo)
//                 if (r !== 'confirm')
//                     form.append(r, resInfo[r]);
//             form.append('active', false);
//             form.append('owner', Number(newUserId));

//             await fetchAddress(query);
//             form.append('address', addressRes.address_line);
//             form.append('latitude', addressRes.latitude);
//             form.append('longitude', addressRes.longitude);

//             if (imageRes) {
//                 form.append('image', {
//                     uri: imageRes.uri,
//                     name: imageRes.uri.split('/').pop(),
//                     type: 'imageRes/png'
//                 });
//             } else {
//                 form.append('image', 'Have not uploaded photos yet');
//             }
//             const response = await APIs.post(endpoints['createRestaurant'], form, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
                      
//                 }
//             });

//             if (response.status === 201) {
//                 console.log(response.data);
//                 Alert.alert('Đã gửi yêu cầu', 'Tài khoản sẽ sớm được xác nhận!');
//             }
//         } catch (ex) {
//             if (ex.response) {
//                 console.error('Lỗi từ server:', ex.response.data);
//                 Alert.alert('Lỗi', JSON.stringify(ex.response.data));
//             } else {
//                 console.error('Lỗi không xác định:', ex.message);
//                 Alert.alert('Lỗi', ex.message);
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <View style={{ flex: 1, backgroundColor: "#e3f2fd" }}>
//             <ScrollView>
//                 <View style={{ margin: 10 }}>
//                     <Text style={{ fontSize: 30, textAlign: "center", fontWeight: 'bold', color: "#0d47a1" }}>Thông tin người dùng</Text>
//                 </View>

//                 <View style={{
//                     flex: 1,
//                     backgroundColor: "#f5f5f5",
//                     margin: 15,
//                     padding: 10,
//                     borderRadius: 10
//                 }}>
//                     {Object.values(users).map(u =>
//                         <View key={u.field} style={{ marginBottom: 10 }}>
//                             {errors[u.field] && (
//                                 <Text style={{ color: 'red', fontSize: 12 }}>{errors[u.field]}</Text>
//                             )}
//                             <TextInput style={styles.loginInput}
//                                 value={user[u.field]}
//                                 keyboardType={u.keyboardType}
//                                 onChangeText={text => updateUserRestaurant(text, u.field)}
//                                 underlineColorAndroid="transparent"
//                                 placeholder={u.title}
//                                 error={!!errors[u.field]}
//                                 onFocus={() => handleFocus(u.field)}
//                                 secureTextEntry={u.secure}
//                                 mode="outlined" />
//                         </View>
//                     )}
//                     <View style={{ marginBottom: 15 }}>
//                         {image ? <Image source={{ uri: image.uri }} style={{
//                             width: 150,
//                             height: 150,
//                             borderRadius: 15,
//                             borderWidth: 2,
//                             borderColor: '#ddd',
//                             marginBottom: 10,

//                         }} /> : ""}
//                         <Button mode="outlined" onPress={() => pickImage('imgUser')}>
//                             Chọn hình ảnh
//                         </Button>
//                     </View>

//                 </View>

//                 <View style={{ margin: 10 }}>
//                     <Text style={{ fontSize: 30, textAlign: "center", fontWeight: 'bold', color: "#0d47a1" }}>Thông tin nhà hàng</Text>
//                 </View>
//                 <View style={{
//                     flex: 1,
//                     backgroundColor: "#f5f5f5",
//                     padding: 15,
//                     borderRadius: 10
//                 }}>
//                     {Object.values(restaurant_info).map(r =>
//                         <View key={r.field} style={{ marginBottom: 10 }}>
//                             {errors[r.field] && (
//                                 <Text style={{ color: 'red', fontSize: 12 }}>{errors[r.field]}</Text>
//                             )}
//                             <TextInput style={styles.loginInput}
//                                 value={resInfo[r.field]}
//                                 keyboardType={r.keyboardType}
//                                 onChangeText={text => updateRestaurant(text, r.field)}
//                                 underlineColorAndroid="transparent"
//                                 placeholder={r.title}
//                                 error={!!errors[r.field]}
//                                 onFocus={() => handleFocus(r.field)}
//                                 secureTextEntry={r.secure}
//                                 mode="outlined" />
//                         </View>
//                     )}
//                     <View style={{ marginBottom: 10 }}>
//                         <TextInput
//                             style={styles.loginInput}
//                             mode="outlined"
//                             placeholder="Địa chỉ (số nhà, đường, quận/huyện, thành phố)"
//                             value={query}
//                             onChangeText={(text) => {
//                                 setQuery(text);
//                             }}
//                         />
//                     </View>
//                     <View style={{ marginBottom: 15 }}>
//                         {imageRes ? <Image source={{ uri: imageRes.uri }} style={{
//                             width: 150,
//                             height: 150,
//                             borderRadius: 15,
//                             borderWidth: 2,
//                             borderColor: '#ddd',
//                             marginBottom: 10,

//                         }} /> : ""}
//                         <Button mode="outlined" onPress={() => pickImage('imgRes')}>
//                             Chọn hình ảnh
//                         </Button>
//                     </View>

//                     <TouchableOpacity onPress={registerRestaurant} loading={loading} style={[styles.loginButton, { marginTop: 10, backgroundColor: "#0d47a1" }]}>
//                         {loading && <ActivityIndicator style={{ marginRight: 10 }} color="#fff" />}
//                         <Text style={{ color: "#fff", textAlign: "center", fontSize: 30, fontWeight: "bold" }}>Đăng ký</Text>
//                     </TouchableOpacity>

//                 </View>
//             </ScrollView>
//         </View>
//     );
// };
// export default RestaurantRegisterScreen;