import {ActivityIndicator, Alert, Button, LogBox, Text, TouchableOpacity, View} from "react-native";
import { TextInput } from "react-native-paper";
import styles from "./LoginStyles";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import APIs, { authApis, endpoints } from "../../configs/APIs";
// import QueryString from "qs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {MyDispatchContext, MyUserContext} from "../../configs/UserContexts";
// import { Icon, Skeleton } from "@rneui/themed";

LogBox.ignoreLogs([
    "Warning: Star: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
    "Warning: TapRating: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
    "TypeError: nav.navigate is not a function (it is undefined)",
    "[TypeError: navigation.navigate is not a function (it is undefined)]\n"
]);

const Login =  ( navigation ) => {
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
    const dispatch = useContext(MyDispatchContext);
    const { loginInfo } = useContext(MyUserContext);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [user, setUser] = useState({
        'username': '',
        'password': ''
    });

    const users = {
        'username': {
            'title': 'Nhập tên đăng nhập',
            'field': 'username',
            'secure': false,
        },
        'password': {
            'title': 'Nhập mật khẩu',
            'field': 'password',
            'secure': true,
        }
    };

    const updateUser = (value, field) => {
        setUser({ ...user, [field]: value });
    };

    const login = async () => {
        try {
            setLoading(true);
            const loginData = {
                'client_id': 'pHN18cNsU33ELNhkgC24bbkNXMf2pV0edMLSzkDj',
                'client_secret': 'fy5hASOQj7kXsaVH2CAYQzFGC8ZzgcxdU8rFxdOxtltp8Nzgu4GLLtYLCslOUTwlli0GqLNmxdyr7kVwcC8jjllblO8tlKSmNXwMRN1fyYbjX15TLsdA3D3prnir3FXP',
                'grant_type': 'password',
                ...user
            };

            const res = await APIs.post(endpoints['login'], loginData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            await AsyncStorage.setItem('token', res.data.access_token);


            const authTokenApi = await authApis();
            const currentUser = await authTokenApi.get(endpoints['current-user']);
            await AsyncStorage.setItem("user_id", currentUser.data.id.toString());

            const resolvedData = currentUser.data;

            dispatch({ type: 'login',
                        payload: resolvedData
            });

            loginInfo(currentUser.data);

            nav.navigate("Home");



        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={{
            flex: 1,
            backgroundColor: "#f5f5f5",
            justifyContent: "center",
            alignItems: 'center',
            padding: 20,
            position: 'relative'
        }}>

            {
                Object.values(users).map(u =>
                    <TextInput
                        key={u.field}
                        secureTextEntry={u.secure}
                        mode="outlined"
                        style={styles.loginInput}
                        placeholder={u.title}
                        value={user[u.field]}
                        onChangeText={t => updateUser(t, u.field)}
                    />

                )
            }

            <TouchableOpacity onPress={login} loading={loading} style={styles.loginButton}>
                {loading && <ActivityIndicator style={{ marginRight: 10 }} color="#fff" />}
                <Text style={styles.logoutText}>Đăng nhập</Text>
            </TouchableOpacity>

            <View style={{
                flexDirection: 'row',
                marginTop: 20,  // Added space between login buttons and other elements
                justifyContent: 'center',
            }}>
                <TouchableOpacity
                    style={[styles.button, loading && { backgroundColor: "#999" }]}
                    onPress={login}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? "Đang xử lý..." : "Đăng nhập"}</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Quên mật khẩu ?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => nav.navigate("Register")} style={{ marginLeft: 15 }}>
                        <Text style={styles.register}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
};

export default Login;
