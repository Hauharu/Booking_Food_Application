import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import styles from "./RegisterStyles";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { MyDispatchContext } from "../../configs/UserContexts";

const Register = () => {
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
    const dispatch = useContext(MyDispatchContext);
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

    const updateUser = (value, field) => {
        setUser({ ...user, [field]: value });
    };

    const register = async () => {
        try {
            setLoading(true);

            if (user.password !== user.confirm_password) {
                Alert.alert("Lỗi", "Mật khẩu và xác nhận mật khẩu không khớp!");
                setLoading(false);
                return;
            }

            if (!user.first_name || !user.last_name || !user.email || !user.username || !user.password || !user.phone) {
                Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
                setLoading(false);
                return;
            }

            const form = new FormData();
            form.append("first_name", user.first_name);
            form.append("last_name", user.last_name);
            form.append("email", user.email);
            form.append("phone", user.phone);
            form.append("username", user.username);
            form.append("password", user.password);

            console.log("🔹 FormData chuẩn bị gửi:", form);

            const res = await APIs.post(endpoints['register'], form, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            Alert.alert("Thành công", "Đăng ký thành công!", [
                { text: "OK", onPress: () => nav.replace("Login") }
            ]);
        } 
        catch (error) {
            console.error("❌ Lỗi:", error.response?.data || error.response?.status || error.message);
        } finally {
            setLoading(false);
        }
    };

    const hasError = (field) => {
        const value = user[field] || "";
        if (!value) return "Trường này không được để trống!";
        if (field === "email" && !/\S+@\S+\.\S+/.test(value)) return "Email không hợp lệ!";
        if (field === "phone" && !/^\d{10,11}$/.test(value)) return "Số điện thoại không hợp lệ!";
        if (field === "password" && value.length < 3) return "Mật khẩu phải có ít nhất 8 ký tự!";
        if (field === "confirm_password" && value !== user.password) return "Mật khẩu không khớp!";
        return null;
    };

    return (
        <View style={styles.container}>
            {Object.values(users).map(u => (
                <View key={u.field} style={{ width: '100%' }}>
                    <TextInput
                        label={u.title}
                        secureTextEntry={u.secure}
                        mode="outlined"
                        style={styles.RegisterInput}
                        placeholder={u.title}
                        value={user[u.field]}
                        onChangeText={t => updateUser(t, u.field)}
                    />
                    <HelperText type="error" visible={!!hasError(u.field)}>
                        {hasError(u.field)}
                    </HelperText>
                </View>
            ))}

            <TouchableOpacity onPress={register} style={styles.RegisterButton} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.logoutText}>Đăng ký</Text>}
            </TouchableOpacity>
        </View>
    );
};

export default Register;