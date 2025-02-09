import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, RefreshControl, Image } from "react-native";
import { Button, TextInput, Checkbox } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RestaurantStyles from "./AddMenuStyles";
import APIs, {endpoints, BASE_URL, authApis} from "../../configs/APIs";
import DropDownPicker from "react-native-dropdown-picker";
import { MyUserContext } from "../../configs/UserContexts";

const AddMenu = ({ navigation, route }) => {
    const { onGoBack } = route.params || {};
    const [loading, setLoading] = useState(false);
    const [nameMenu, setNameMenu] = useState("");
    const [openTime, setTimeOpen] = useState(false);
    const [valueTime, setTimeValue] = useState(null);
    const [timeItems, setTimeItems] = useState([
        { label: "Sáng", value: "Sáng" },
        { label: "Trưa", value: "Trưa" },
        { label: "Chiều", value: "Chiều" },
        { label: "Tối", value: "Tối" },
        { label: "Cả ngày", value: "Cả ngày" },
    ]);

    const [checkedFoods, setCheckedFoods] = useState({});
    const user = useContext(MyUserContext);
    const storeId = user.store_id; // Ensure this is correct
    const [page, setPage] = useState(1);
    const [foods, setFoods] = useState([]);

    const loadFoods = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    throw new Error("Authentication token not found.");
                }
                const url = `${endpoints["foodm"]}?page=${page}`;
                console.info(url);
                const res = await APIs.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Log the fetched foods to check the data structure
                console.log("Fetched foods:", res.data.results);

                if (page > 1) {
                    setFoods((current_res) => [...current_res, ...res.data.results]);
                } else {
                    setFoods(res.data.results);
                }

                if (!res.data.next) {
                    setPage(0);
                }
            } catch (ex) {
                console.error("Error loading foods:", ex);
            } finally {
                setLoading(false);
            }
        }
    };

    const addMenu = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token"); // Retrieve token from storage
            const form = new FormData();
            form.append("name", nameMenu);
            form.append("serve_period", valueTime);
            form.append("active", true);

            const selectedFoodIds = Object.entries(checkedFoods)
                .filter(([_, checked]) => checked)
                .map(([id]) => Number(id));

            console.info("Selected Food IDs:", JSON.stringify(selectedFoodIds));

            form.append("food", JSON.stringify(selectedFoodIds)); // Make sure the array is sent as a JSON string

            const api = await authApis(token)
            const response = await api.post(`${endpoints["menu"]}`, form, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Include the token here
                },
            });
            if (response.status === 201) {
                console.log(response.data);
                Alert.alert("Thành công", "Menu đã được thêm mới!");
                if (onGoBack) onGoBack();
                navigation.goBack();
            }
        } catch (ex) {
            if (ex.response) {
                console.error("Server trả về lỗi:", ex.response.data);
                Alert.alert("Lỗi", ex.response.data.message || "Không thể thêm menu.");
            } else {
                console.error("Lỗi không xác định:", ex.message);
                Alert.alert("Lỗi", "Không thể thêm menu. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFoods();
    }, [storeId, page]);

    const loadMore = () => {
        if (page > 0 && !loading) setPage(page + 1);
    };
    const refresh = () => {
        setPage(1);
        loadFoods();
    };

    const renderItem = ({ item }) => {
        // Build the full image URL if necessary
        let imageUrl = item.image;
        if (imageUrl && !imageUrl.startsWith("http")) {
            imageUrl = `${BASE_URL}${imageUrl}`;
        }

        return (
            <TouchableOpacity
                style={[RestaurantStyles.dishCard, { justifyContent: "space-between", flexDirection: "row", alignItems: "center" }]}
                key={`${item.id}-${Math.random()}`}
            >
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <Image
                        source={{ uri: imageUrl || 'https://yourplaceholderimage.url/placeholder.png' }} // Use the correct image URL field or placeholder
                        style={{ width: 70, height: 70, borderRadius: 10, marginRight: 10 }}
                        resizeMode="cover"
                    />
                    <View style={{ flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
                        <Text style={RestaurantStyles.dishName}>{item.name}</Text>
                        <Text>Thành tiền: {item.price} VNĐ</Text>
                    </View>
                </View>
                <Checkbox
                    status={checkedFoods[item.id] ? "checked" : "unchecked"}
                    onPress={() => {
                        setCheckedFoods((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                        }));
                    }}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
                <Text style={{ margin: 5, fontSize: 17, fontWeight: "bold" }}>Tên menu:</Text>
                <TextInput
                    style={RestaurantStyles.inputMargin}
                    mode="outlined"
                    onChangeText={(text) => setNameMenu(text)}
                    placeholder="Tên menu mới ..."
                    value={nameMenu}
                />

                <Text style={{ marginTop: 5, fontSize: 17, fontWeight: "bold" }}> Thời điểm phục vụ: </Text>
                <View style={RestaurantStyles.dropDownStyle}>
                    <DropDownPicker
                        style={{ marginTop: 10 }}
                        open={openTime}
                        value={valueTime}
                        items={timeItems}
                        setOpen={setTimeOpen}
                        setValue={setTimeValue}
                        setItems={setTimeItems}
                        listMode="SCROLLVIEW"
                        placeholder="Chọn thời điểm phục vụ"
                    />
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={{ marginTop: 5, fontSize: 17, fontWeight: "bold", paddingLeft: 10 }}>  Các món ăn: </Text>
                <FlatList
                    style={RestaurantStyles.scrollViewStyle}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
                    onEndReached={loadMore}
                    data={foods}
                    keyExtractor={(item, index) => `food-${item.id}-${index}`}
                    renderItem={renderItem}
                    refreshing={loading}
                />
            </View>
            <View style={{ padding: 10 }}>
                <Button icon="plus" mode="contained" style={[RestaurantStyles.addBtn]} onPress={addMenu} loading={loading} disabled={loading}>
                    Thêm menu
                </Button>
            </View>
        </View>
    );
};

export default AddMenu;
