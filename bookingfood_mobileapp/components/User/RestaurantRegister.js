import { ActivityIndicator, Text, TouchableOpacity, View, Image, Keyboard, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import styles from "./RegisterStyles";
import { ScrollView } from "react-native";
import { useEffect, useContext, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import authApis, { endpoints } from "../../configs/APIs";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RestaurantRegisterScreen = () => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null); // ảnh người dùng
    const [imageRes, setImageRes] = useState(null); // ảnh nhà hàng

    //thong tin nguoi dung
    const [user, setUser] = useState({
        'first_name': '',
        'last_name': '',
        'email': '',
        'phone': '',
        'username': '',
        'password': '',
        'confirm_password': ''
    });
    const users = {
        'first_name': { 'title': 'Nhập họ', 'field': 'first_name', 'secure': false },
        'last_name': { 'title': 'Nhập tên', 'field': 'last_name', 'secure': false },
        'email': { 'title': 'Nhập địa chỉ email', 'field': 'email', 'secure': false },
        'phone': { 'title': 'Nhập số điện thoại', 'field': 'phone', 'secure': false },
        'username': { 'title': 'Nhập tên đăng nhập', 'field': 'username', 'secure': false },
        'password': { 'title': 'Nhập mật khẩu', 'field': 'password', 'secure': true },
        'confirm_password': { 'title': 'Xác nhận mật khẩu', 'field': 'confirm_password', 'secure': true }
    };

    // thông tin nha hang
    const [resInfo, setResInfo] = useState({
        "name": "",
    });
    const restaurant_info = {
        "name": {
            "title": "Tên cửa hàng",
            "field": "name",
            "secure": false,
            "keyboardType": "default"
        }
    };

    const updateUserRestaurant = (value, field) => {
        setUser({ ...user, [field]: value });
    };
    const updateRestaurant = (value, field) => {
        setResInfo({ ...resInfo, [field]: value });
    };

    const pickImage = async (imgType) => {
        console.log("check:", imgType);
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) {
                if (imgType === "imgUser") {
                    setImage(result.assets[0]);
                } else if (imgType === "imgRes") {
                    setImageRes(result.assets[0]);
                }
            }
        }
    };

    //validate du lieu 
    const [errors, setErrors] = useState({});

    const handleError = (errorMessage, input) => {
        setErrors(prev => ({ ...prev, [input]: errorMessage }));
    };

    const handleFocus = (field) => {
        setErrors(prev => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        Keyboard.dismiss();
        let valid = true;

        for (let u in user) {
            if (!user[u]) {
                handleError(`${users[u].title} không được để trống`, u);
                valid = false;
            }

            if (u === "phone" && user[u].length !== 10) {
                handleError(`${users[u].title} phải có đúng 10 hoặc 11 chữ số`, u);
                valid = false;
            }
        }

        return valid;
    };

    const [newUser, setNewUser] = useState({});
    const createNewUser = async () => {
        if (!validate()) {
            return;
        }
        try {
            const form = new FormData();
            for (let u in user)
                if (u !== 'confirm')
                    form.append(u, user[u]);
            form.append('role', "restaurant-user");

            if (image) {
                form.append('avatar', {
                    uri: image.uri,
                    name: image.uri.split('/').pop(),
                    type: 'image/png'
                });
            } else {
                form.append('image', 'Have not uploaded photos yet');
            }

            const response = await authApis.post(endpoints['createResUser'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'token'
                }
            });

            if (response.status === 201) {
                console.log(response.data);
                setNewUser(response.data);
                return response.data.id;
            }
        } catch (ex) {
            if (ex.response) {
                console.error('Server trả về lỗi:', ex.response.data);
            } else {
                console.error('Lỗi không xác định:', ex.message);
            }
        } finally {
            console.log('done add user res');
        }
    };

    const [query, setQuery] = useState('');
    const [addressRes, setAddressRes] = useState({
        address_line: "",
        latitude: "",
        longitude: "",
    });

    const fetchAddress = async (address_line) => {
        try {
            const res = await axios.get(`https://maps.gomaps.pro/maps/api/geocode/json?key=AIzaSyCEI0WPbw3uhgoWtees1dBh1jbFPZHXLMc`, {
                params: { address_line: address_line },
            });
            if (res.data.status === 'OK') {
                console.log(res.data.results);

                const formatted_address = res.data.results[0].formatted_address;
                const location = res.data.results[0].geometry.location;

                console.log(formatted_address);
                console.log(location.lat);

                setAddressRes({
                    address_line: formatted_address,
                    latitude: location.lat,
                    longitude: location.lng,
                });
            } else {
                Alert.alert('Lỗi', 'Địa chỉ không hợp lệ, vui lòng kiểm tra lại.');
                setAddressRes({
                    address_line: "",
                    latitude: "",
                    longitude: "",
                });
            }
        } catch (error) {
            console.error('Error fetching address details:', error);
        }
    };

    const registerRestaurant = async () => {
        if (!validate()) {
            return;
        }
        setLoading(true);
        try {
            const newUserId = await createNewUser();

            const form = new FormData();
            for (let r in resInfo)
                if (r !== 'confirm')
                    form.append(r, resInfo[r]);
            form.append('active', false);
            form.append('owner', Number(newUserId));

            await fetchAddress(query);
            form.append('address', addressRes.address_line);
            form.append('latitude', addressRes.latitude);
            form.append('longitude', addressRes.longitude);

            if (imageRes) {
                form.append('image', {
                    uri: imageRes.uri,
                    name: imageRes.uri.split('/').pop(),
                    type: 'imageRes/png'
                });
            } else {
                form.append('image', 'Have not uploaded photos yet');
            }
            const response = await authApis.post(endpoints['createRestaurant'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                      
                }
            });

            if (response.status === 201) {
                console.log(response.data);
                Alert.alert('Đã gửi yêu cầu', 'Tài khoản sẽ sớm được xác nhận!');
            }
        } catch (ex) {
            if (ex.response) {
                console.error('Lỗi từ server:', ex.response.data);
                Alert.alert('Lỗi', JSON.stringify(ex.response.data));
            } else {
                console.error('Lỗi không xác định:', ex.message);
                Alert.alert('Lỗi', ex.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#e3f2fd" }}>
            <ScrollView>
                <View style={{ margin: 10 }}>
                    <Text style={{ fontSize: 30, textAlign: "center", fontWeight: 'bold', color: "#0d47a1" }}>Thông tin người dùng</Text>
                </View>

                <View style={{
                    flex: 1,
                    backgroundColor: "#f5f5f5",
                    margin: 15,
                    padding: 10,
                    borderRadius: 10
                }}>
                    {Object.values(users).map(u =>
                        <View key={u.field} style={{ marginBottom: 10 }}>
                            {errors[u.field] && (
                                <Text style={{ color: 'red', fontSize: 12 }}>{errors[u.field]}</Text>
                            )}
                            <TextInput style={styles.loginInput}
                                value={user[u.field]}
                                keyboardType={u.keyboardType}
                                onChangeText={text => updateUserRestaurant(text, u.field)}
                                underlineColorAndroid="transparent"
                                placeholder={u.title}
                                error={!!errors[u.field]}
                                onFocus={() => handleFocus(u.field)}
                                secureTextEntry={u.secure}
                                mode="outlined" />
                        </View>
                    )}
                    <View style={{ marginBottom: 15 }}>
                        {image ? <Image source={{ uri: image.uri }} style={{
                            width: 150,
                            height: 150,
                            borderRadius: 15,
                            borderWidth: 2,
                            borderColor: '#ddd',
                            marginBottom: 10,

                        }} /> : ""}
                        <Button mode="outlined" onPress={() => pickImage('imgUser')}>
                            Chọn hình ảnh
                        </Button>
                    </View>

                </View>

                <View style={{ margin: 10 }}>
                    <Text style={{ fontSize: 30, textAlign: "center", fontWeight: 'bold', color: "#0d47a1" }}>Thông tin nhà hàng</Text>
                </View>
                <View style={{
                    flex: 1,
                    backgroundColor: "#f5f5f5",
                    padding: 15,
                    borderRadius: 10
                }}>
                    {Object.values(restaurant_info).map(r =>
                        <View key={r.field} style={{ marginBottom: 10 }}>
                            {errors[r.field] && (
                                <Text style={{ color: 'red', fontSize: 12 }}>{errors[r.field]}</Text>
                            )}
                            <TextInput style={styles.loginInput}
                                value={resInfo[r.field]}
                                keyboardType={r.keyboardType}
                                onChangeText={text => updateRestaurant(text, r.field)}
                                underlineColorAndroid="transparent"
                                placeholder={r.title}
                                error={!!errors[r.field]}
                                onFocus={() => handleFocus(r.field)}
                                secureTextEntry={r.secure}
                                mode="outlined" />
                        </View>
                    )}
                    <View style={{ marginBottom: 10 }}>
                        <TextInput
                            style={styles.loginInput}
                            mode="outlined"
                            placeholder="Địa chỉ (số nhà, đường, quận/huyện, thành phố)"
                            value={query}
                            onChangeText={(text) => {
                                setQuery(text);
                            }}
                        />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        {imageRes ? <Image source={{ uri: imageRes.uri }} style={{
                            width: 150,
                            height: 150,
                            borderRadius: 15,
                            borderWidth: 2,
                            borderColor: '#ddd',
                            marginBottom: 10,

                        }} /> : ""}
                        <Button mode="outlined" onPress={() => pickImage('imgRes')}>
                            Chọn hình ảnh
                        </Button>
                    </View>

                    <TouchableOpacity onPress={registerRestaurant} loading={loading} style={[styles.loginButton, { marginTop: 10, backgroundColor: "#0d47a1" }]}>
                        {loading && <ActivityIndicator style={{ marginRight: 10 }} color="#fff" />}
                        <Text style={{ color: "#fff", textAlign: "center", fontSize: 30, fontWeight: "bold" }}>Đăng ký</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
};
export default RestaurantRegisterScreen;    