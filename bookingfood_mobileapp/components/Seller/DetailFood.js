import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Switch, Image, Alert } from "react-native";
import { TextInput, Button } from 'react-native-paper';
import RestaurantStyles from "./AddFoodStyles";
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import RestaurantAPIs, { endpoints } from "../../configs/APIs";
import { useContext } from "react";
import { MyUserContext } from "../../configs/UserContexts";



const DetailFood = ({ navigation, route }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { foodId, onGoBack } = route.params || {};
    const user = useContext(MyUserContext)
    const restaurantId = user.restaurant_id
    const [loading, setLoading] = useState(false);
    const [food, setFood] = useState({
        "name": "",
        "price": "",
        "description": ""
    })

    const updateFood = (value, field) => {
        setFood({ ...food, [field]: value });
    }

    const foods = {
        "name": {
            "title": "Tên món ăn",
            "field": "name",
            "icon": "text",
            "keyboardType": "default"
        },
        "price": {
            "title": "Giá tiền",
            "field": "price",
            "icon": "text",
            "keyboardType": "numeric"
        },
        "description": {
            "title": "Mô tả món ăn",
            "field": "description",
            "icon": "text",
            "keyboardType": "default"
        }
    }

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [categoriesItems, setCategoriesItems] = useState([]);

    const [openTime, setTimeOpen] = useState(false);
    const [valueTime, setTimeValue] = useState(null);
    const [timeItems, setTimeItems] = useState([
        { label: 'Sáng', value: 'Sáng' },
        { label: 'Trưa', value: 'Trưa' },
        { label: 'Chiều', value: 'Chiều' },
        { label: 'Tối', value: 'Tối' },
        { label: 'Cả ngày', value: 'Cả ngày' },
    ]);

    const [image, setImage] = useState(null)

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled)
                setImage(result.assets[0]);
        }
    }

    const loadCategories = async () => {
        try {
            let url = `${endpoints['restaurantCategories'](restaurantId)}`

            let res = await RestaurantAPIs.get(url);
            let dictionaryCategories = res.data.results.map(c => ({
                label: c.name,
                value: c.id
            }));
            console.info(url)
            setCategoriesItems(dictionaryCategories)
        }
        catch (ex) {
            console.error('error' + ex);
        } finally {
            console.info('Done');
        }
    }

    const [isAvailable, setIsAvailable] = useState(false);
    const toggleAvailability = () => {
        setIsAvailable((prev) => !prev);
    };

    const loadFood = async () => {
        setLoading(true)
        try {
            let url = `${endpoints['detailFood'](foodId)}`
            let res = await RestaurantAPIs.get(url)
            console.log(res.data.is_available)


            setFood({
                name: res.data.name || "",
                price: res.data.price?.toString() || "",
                description: res.data.description || "",
            });


            setValue(res.data.category);
            setTimeValue(res.data.serve_period);
            setImage({ uri: res.data.image });
            setIsAvailable(res.data.is_available);
            console.info(res.data.serve_period)
        }
        catch (ex) {
            console.error('lỗi' + ex);
        } finally {
            setLoading(false);
        }
    }


    const update = async () => {
        setLoading(true);
        try {
            // tổ chức cập nhật
            const form = new FormData();
            for (let f in food)
                if (f !== 'confirm')
                    form.append(f, food[f]);
            form.append('category', value);
            form.append('serve_period', valueTime);
            form.append('is_available', isAvailable);
            if (image) {
                form.append('image', {
                    uri: image.uri,
                    name: image.uri.split('/').pop(),
                    type: 'image/png'
                });
            }
            else {
                form.append('image', 'Have not uploaded photos yet');
            }
            console.info("Serve period gửi lên::", valueTime);
            console.info("Form data:", Array.from(form.entries()));
            const response = await RestaurantAPIs.patch(`${endpoints['detailFood'](foodId)}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                console.log(response.data);
                setFood({
                    "name": "",
                    "price": "",
                    "description": ""
                });
                setImage('');
                Alert.alert('Thành công', 'Món ăn mới đã được cập nhật!');
                if (onGoBack) onGoBack();
                navigation.goBack();
                // Alert.alert(
                //     "Thành công",
                //     "Đơn hàng đã được xác nhận giao hàng!",
                //     [{ text: "OK", onPress: () => navigation.goBack() }]
                // );
            }

        } catch (ex) {
            if (ex.response) {
                console.error('Server trả về lỗi:', ex.response.data);
                Alert.alert('Lỗi', ex.response.data.message || 'Không thể cập nhật món ăn.');
            } else {
                console.error('Lỗi không xác định:', ex.message);
                Alert.alert('Lỗi', 'Không thể cập nhật món ăn. Vui lòng thử lại.');
            }

        } finally {
            setLoading(false);
        }
    }

    const deleteFood = async () => {
        setLoading(true);
        try {
            let url = `${endpoints['detailFood'](foodId)}`
            let response = await RestaurantAPIs.delete(url)
            if (response.status === 204) {
                console.log(response.data);
                setFood({
                    "name": "",
                    "price": "",
                    "description": ""
                });
                setImage('');
                Alert.alert('Thành công', 'Món ăn đã được xóa!');
                if (onGoBack) onGoBack();
                navigation.goBack();
            }
        } catch (ex) {
            if (ex.response) {
                console.error('Server trả về lỗi:', ex.response.data);
                Alert.alert('Lỗi', ex.response.data.message || 'Không thể xóa món ăn.');
            } else {
                console.error('Lỗi không xác định:', ex.message);
                Alert.alert('Lỗi', 'Không thể xóa món ăn. Vui lòng thử lại.');

            }

        } finally {
            setLoading(false);
        }
    }




    useEffect(() => {
        loadCategories();
        loadFood();
    }, [restaurantId]);

    return (


        <View style={{ flex: 1 }}>
            <ScrollView nestedScrollEnabled={true}>
                <>
                    {Object.values(foods).map(f =>
                        <View key={f.field}>
                            <Text style={{ marginTop: 5, fontSize: 17, fontWeight: 'bold' }}> {f.title}:</Text>
                            <TextInput style={RestaurantStyles.inputMargin}
                                mode="outlined"
                                value={food[f.field]}
                                keyboardType={f.keyboardType}
                                onChangeText={text => updateFood(text, f.field)}
                            />
                        </View>
                    )}

                </>

                <View style={RestaurantStyles.switchContainerCustom}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Còn món: </Text>
                    <Switch
                        value={isAvailable}
                        onValueChange={toggleAvailability} />
                </View>
                <View style={RestaurantStyles.dropDownStyle}>
                    <Text style={{ marginTop: 5, fontSize: 17, fontWeight: 'bold' }}> Hình ảnh: </Text>
                    <Button mode="outlined" onPress={pickImage}>
                        Chọn hình ảnh
                    </Button>
                    {image ? <Image source={{ uri: image.uri }} style={{ width: 100, height: 100, margin: 10, borderRadius: 15 }} /> : ""}
                </View>
                <Text style={{ marginTop: 5, fontSize: 17, fontWeight: 'bold' }}> Danh mục: </Text>
                <View style={RestaurantStyles.dropDownStyle}>
                    <DropDownPicker style={{ marginTop: 10 }}
                        open={open}
                        value={value}
                        items={categoriesItems}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setCategoriesItems}
                        listMode="SCROLLVIEW"
                        placeholder="Chọn danh mục"
                    />
                </View>
                <Text style={{ marginTop: 5, fontSize: 17, fontWeight: 'bold' }}> Thời điểm bán: </Text>
                <View style={RestaurantStyles.dropDownStyle}>
                    <DropDownPicker style={{ marginTop: 10 }}
                        open={openTime}
                        value={valueTime}
                        items={timeItems}
                        setOpen={setTimeOpen}
                        setValue={setTimeValue}
                        setItems={setTimeItems}
                        listMode="SCROLLVIEW"
                        placeholder="Chọn thời điểm bán"
                    />
                </View>
                <View style={[RestaurantStyles.groupBtn]}>
                    <Button icon="content-save-outline" mode="contained" style={[RestaurantStyles.addBtn]} onPress={update}>
                        Lưu thay đổi
                    </Button>
                    <Button icon="delete-outline" mode="contained" style={[RestaurantStyles.deleteBtn]} onPress={deleteFood}>
                        Xóa món ăn
                    </Button>
                </View>
            </ScrollView>



        </View>
    );
};
export default DetailFood