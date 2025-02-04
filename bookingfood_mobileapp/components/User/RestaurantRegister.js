import { ActivityIndicator, Text, TouchableOpacity, View, Image, Keyboard, Alert, FlatList } from "react-native"
import { TextInput, Button } from "react-native-paper"
import CustomerStyles from "./RegisterStyles"
import { ScrollView } from "react-native"
import { useContext, useState } from "react"
import * as ImagePicker from 'expo-image-picker';
import APIs, { endpoints } from "../configs/APIs"
import axios from "axios";

const RestaurantRegisterScreen = () => {
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null) // ảnh người dùng
    const [imageRes, setImageRes] = useState(null) // ảnh nhà hàng

    //thong tin nguoi dung
    const [userInfo, setUserInfo] = useState({
        "username": "",
        "password": "",
        "email": "",
        "phone_number": "",
    })
    const user_info = {
        "username": {
            "title": "Tên người dùng",
            "field": "username",
            "secure": false,
            "icon": "text",
            "keyboardType": "default"
        },
        "password": {
            "title": "Mật khẩu",
            "field": "password",
            "secure": true,
            "icon": "text",
            "keyboardType": "default"
        },
        "email": {
            "title": "Email",
            "field": "email",
            "secure": false,
            "icon": "text",
            "keyboardType": "default"
        },
        "phone_number": {
            "title": "Số điện thoại",
            "field": "phone_number",
            "secure": false,
            "icon": "text",
            "keyboardType": "numeric"
        }
    }

    // thông tin nha hang
    const [resInfo, setResInfo] = useState({
        "name": "",
        "phone_number": "",
    })
    const restaurant_info = {
        "name": {
            "title": "Tên nhà hàng",
            "field": "name",
            "secure": false,
            "icon": "text",
            "keyboardType": "default"
        },
        // "address": {
        //     "title": "Địa chỉ nhà hàng",
        //     "field": "address",
        //     "secure": false,
        //     "icon": "text",
        //     "keyboardType": "default"
        // },
        "phone_number": {
            "title": "Số điện thoại",
            "field": "phone_number",
            "secure": false,
            "icon": "text",
            "keyboardType": "numeric"
        }
    }

    const updateUserRestaurant = (value, field) => {
        setUserInfo({ ...userInfo, [field]: value });
    }
    const updateRestaurant = (value, field) => {
        setResInfo({ ...resInfo, [field]: value });
    }

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
    }

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

        for (let u in userInfo) {
            if (!userInfo[u]) {
                handleError(`${user_info[u].title} không được để trống`, u);
                valid = false;
            }

            if (u === "phone_number" && userInfo[u].length !== 10) {
                handleError(`${user_info[u].title} phải có đúng 10 chữ số`, u);
                valid = false;
            }
        }

        for (let r in resInfo) {
            if (!resInfo[r]) {
                handleError(`${restaurant_info[r].title} không được để trống`, r);
                valid = false;
            }

            if (r === "phone_number" && resInfo[r].length !== 10) {
                handleError(`${restaurant_info[r].title} phải có đúng 10 chữ số`, r);
                valid = false;
            }
        }

        return valid;
    };


    const [newUser, setNewUser] = useState({})
    const createNewUser = async () => {
        if (!validate()) {
            return;
        }
        try {
            const form = new FormData();
            for (let u in userInfo)
                if (u !== 'confirm')
                    form.append(u, userInfo[u]);
            form.append('role', "restaurant-user");

            if (image) {
                form.append('avatar', {
                    uri: image.uri,
                    name: image.uri.split('/').pop(),
                    type: 'image/png'
                });
            }
            else {
                form.append('image', 'Have not uploaded photos yet');
            }

            const response = await RestaurantAPIs.post(endpoints['createResUser'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })


            if (response.status === 201) {
                console.log(response.data);
                setNewUser(response.data)
                return response.data.id;;
            }
        }
        catch (ex) {
            if (ex.response) {
                console.error('Server trả về lỗi:', ex.response.data);
            } else {
                console.error('Lỗi không xác định:', ex.message);
            }
        } finally {
            console.log('done add user res')
        }
    }

    const [query, setQuery] = useState('');
    const [addressRes, setAddressRes] = useState({
        address: "",
        latitude: "",
        longitude: "",
    });


    const fetchAddress = async (address) => {
        try {
            const res = await axios.get(`https://maps.gomaps.pro/maps/api/geocode/json?key=AlzaSyQEakGpZpSpxMQGLE1emuT9M6bsbwOboWH`, {
                params: { address: address },
            });
            if (res.data.status === 'OK') {
                console.log(res.data.results)

                const formatted_address = res.data.results[0].formatted_address;
                const location = res.data.results[0].geometry.location;

                console.log(formatted_address);
                console.log(location.lat);

                setAddressRes({
                    address: formatted_address,
                    latitude: location.lat,
                    longitude: location.lng,
                });
            }
            else {
                Alert.alert('Lỗi', 'Địa chỉ không hợp lệ, vui lòng kiểm tra lại.');
                setAddressRes({
                    address: "",
                    latitude: "",
                    longitude: "",
                });
            }
        }
        catch (error) {
            console.error('Error fetching address details:', error);
        }
    };


    const registerRestaurant = async () => {
        if (!validate()) {
            return;
        }
        setLoading(true)
        try {
            const newUserId = await createNewUser(); // tao nguoi dung truoc


            const form = new FormData();
            for (let r in resInfo)
                if (r !== 'confirm')
                    form.append(r, resInfo[r]);
            form.append('active', false);

            form.append('owner', Number(newUserId));

            await fetchAddress(query);
            form.append('address', addressRes.address);
            form.append('latitude', addressRes.latitude);
            form.append('longitude', addressRes.longitude);

            if (imageRes) {
                form.append('image', {
                    uri: imageRes.uri,
                    name: imageRes.uri.split('/').pop(),
                    type: 'imageRes/png'
                });
            }
            else {
                form.append('image', 'Have not uploaded photos yet');
            }


            console.info("Form data:", JSON.stringify(
                Object.fromEntries(form.entries()),
                null,
                2
            ));

            const response = await RestaurantAPIs.post(endpoints['createRestaurant'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })


            if (response.status === 201) {
                console.log(response.data);

                Alert.alert('Đã gửi yêu cầu', 'Tài khoản sẽ sớm được xác nhận!');
            }
        }
        catch (ex) {
            if (ex.response) {
                console.error('Server trả về lỗi:', ex.response.data);
                Alert.alert('Lỗi', ex.response.data.message || 'Không thể đăng ký nhà hàng.');
            } else {
                console.error('Lỗi không xác định:', ex.message);
                Alert.alert('Lỗi', 'Không thể đăng ký nhà hàng. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    }





    return (
        <View style={{ flex: 1 }}>
            <ScrollView >
                <View style={{ margin: 10, }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Thông tin người dùng</Text>
                </View>

                <View style={{
                    flex: 1,
                    backgroundColor: "#f5f5f5",
                    margin: 15
                }}>
                    {Object.values(user_info).map(u =>
                        <View key={u.field}>
                            {errors[u.field] && (
                                <Text style={{ color: 'red', fontSize: 12 }}>{errors[u.field]}</Text>
                            )}
                            <TextInput style={CustomerStyles.loginInput}
                                value={userInfo[u.field]}
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
                    <View >
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

                <View style={{ margin: 10, }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Thông tin nhà hàng</Text>
                </View>
                <View style={{
                    flex: 1,
                    backgroundColor: "#f5f5f5",
                    padding: 15,
                }}>
                    {Object.values(restaurant_info).map(r =>
                        <View key={r.field}>
                            {errors[r.field] && (
                                <Text style={{ color: 'red', fontSize: 12 }}>{errors[r.field]}</Text>
                            )}
                            <TextInput style={CustomerStyles.loginInput}
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
                    <View>
                        <TextInput
                            style={CustomerStyles.loginInput}
                            mode="outlined"
                            placeholder="Địa chỉ (số nhà, đường, quận/huyện, thành phố)"
                            value={query}
                            onChangeText={(text) => {
                                setQuery(text);
                            }}
                        />
                    </View>
                    <View >
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

                    <TouchableOpacity onPress={registerRestaurant} loading={loading} style={[CustomerStyles.loginButton, { marginTop: 10 }]}>
                        {loading && <ActivityIndicator style={{ marginRight: 10 }} color="#fff" />}
                        <Text style={CustomerStyles.logoutText}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}
export default RestaurantRegisterScreen


