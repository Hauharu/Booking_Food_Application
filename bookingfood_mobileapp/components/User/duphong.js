
// import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
// import { HelperText, TextInput } from "react-native-paper"
// import styles from "./RegisterStyles"
// import { useNavigation } from "@react-navigation/native"
// import { useContext, useState } from "react"
// import APIs, { authApis, endpoints } from "../../configs/APIs"
// import QueryString from "qs"
// import AsyncStorage from "@react-native-async-storage/async-storage"
// import { MyDispatchContext } from "../../configs/UserContexts"
// import * as ImagePicker from 'expo-image-picker';


// const RegisterScreen = () => {

//     const nav = useNavigation()
//     const [loading, setLoading] = useState(false)
//     const dispatch = useContext(MyDispatchContext)
//     const [avatar, setAvatar] = useState()
//     const [user, setUser] = useState({
//         'username': '',
//         'password': ''
//     })

//     const users = {
//         'email': {
//             'title': 'Nhập địa chỉ email',
//             'field': 'email',
//             'secure': false,
//         },
//         'phone_number': {
//             'title': 'Nhập số điện thoại',
//             'field': 'phone_number',
//             'secure': false,
//         },
//         'username': {
//             'title': 'Nhập tên đăng nhập',
//             'field': 'username',
//             'secure': false,
//         },
//         'password': {
//             'title': 'Nhập mật khẩu',
//             'field': 'password',
//             'secure': true,
//         },
//         'confirm_password': {
//             'title': 'Xác nhân mật khẩu',
//             'field': 'confirm_password',
//             'secure': true,
//         }
//     }
//     const updateUser = (value, field) => {
//         setUser({ ...user, [field]: value })
//     }


//     const pickImage = async () => {
//         let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//             alert("Permissions denied!");
//         } else {
//             const result = await ImagePicker.launchImageLibraryAsync();
//             if (!result.canceled)
//                 setAvatar(result.assets[0])
//         }
//     }

//     const register = async () => {
//         try {
//             setLoading(true)

//             if (user.password !== user.confirm_password) {
//                 Alert.alert("Lỗi", "Mật khẩu và xác nhận mật khẩu không khớp!");
//                 return;
//             }


//             if (!user.email || !user.username || !user.password || !user.phone_number) {
//                 Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
//                 return;
//             }

//             const form = new FormData()
//             form.append("email", user.email)
//             form.append("phone_number", user.phone_number)
//             form.append("username", user.username)
//             form.append("password", user.password)


//             console.info(form);

//             if (avatar) {
//                 form.append("avatar", {
//                     uri: avatar.uri,
//                     name: avatar.uri.split("/").pop(),
//                     type: "image/jpeg", // Hoặc image/png tùy theo ảnh
//                 });
//             }

//             form.append('avatar', {
//                 uri: avatar.uri,
//                 name: avatar.uri.split("/").pop(),
//                 type: "image/jpeg"
//             });


//             const res = await APIs.post(endpoints['register'], form, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             })


//             nav.navigate('LoginScreen')
//         } catch (error) {
//             if (error.response) {
//                 // Lỗi từ phía server (HTTP status)
//                 console.error("Response Error:", error.response.data);
//             } else if (error.request) {
//                 // Không nhận được phản hồi từ server
//                 console.error("Request Error:", error.request);
//             } else {
//                 // Lỗi khác
//                 console.error("Error:", error.message);
//             }
//         } finally {
//             setLoading(false)
//         }
//     }

//     const hasError = (field) => {
//         if (!user[field]) return "Trường này không được để trống!";

//         if (field === "email" && !/\S+@\S+\.\S+/.test(user.email)) return "Email không hợp lệ!";

//         if (field === "phone_number" && !/^\d{10,11}$/.test(user.phone_number)) return "Số điện thoại không hợp lệ!";

//         if (field === "password" && user.password.length < 3) return "Mật khẩu phải có ít nhất 3 ký tự!";

//         if (field === "confirm_password" && user.confirm_password !== user.password) return "Mật khẩu không khớp!";

//         return null;
//     }

//     return (
//         <View style={styles.container}>

//             {Object.values(users).map(u =>
//                 <View key={u.field} style={{width: '100%'}}>

//                     <TextInput
//                         label={u.title}
//                         secureTextEntry={u.secure}
//                         mode="outlined"
//                         style={styles.RegisterInput}
//                         placeholder={u.title}
//                         value={user[u.field]}
//                         onChangeText={t => updateUser(t, u.field)} />
//                     <HelperText type="error" visible={!!hasError(u.field)}>
//                         {hasError(u.field)}
//                     </HelperText>
//                 </View>
//             )
//             }
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>

//                 <TouchableOpacity onPress={pickImage} style={styles.ChooseImageButton}>
//                     <Text style={styles.ChooseImageText}>{avatar ? 'Đổi ảnh đại diện' : 'Chọn ảnh đại diện'}</Text>
//                 </TouchableOpacity>

//                 {avatar && (
//                     <Image source={{ uri: avatar.uri }} style={styles.AvatarPreview} />
//                 )}
//             </View>


//             <TouchableOpacity onPress={register} loading={loading} style={styles.RegisterButton}>
//                 {loading && <ActivityIndicator style={{ marginRight: 10 }} color="#fff" />}
//                 <Text style={styles.logoutText}>Đăng ký</Text>
//             </TouchableOpacity>



//         </View>
//     )
// }
// export default RegisterScreen

