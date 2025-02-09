import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TextInput, Alert } from "react-native";
import { Button, Card } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { authApis, BASE_URL, endpoints } from "../../configs/APIs";
import { MyUserContext } from "../../configs/UserContexts";
import styles from "./ManageAddressStyles";

const ManageAddress = () => {
    const { user } = useContext(MyUserContext);
    const nav = useNavigation();
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState("");
    const [editingAddress, setEditingAddress] = useState(null);
    const [updatedAddress, setUpdatedAddress] = useState("");

    // Fetch addresses from API
    const fetchAddresses = async () => {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const api = await authApis(token);

        try {
            const response = await api.get(endpoints["current-user-address"]);
            setAddresses(response.data);
        } catch (error) {
            console.log("Error fetching addresses:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    // Add a new address
    const addAddress = async () => {
        if (!newAddress.trim()) return Alert.alert("Lỗi", "Vui lòng nhập địa chỉ");

        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const api = await authApis(token);

        const formData = new FormData();
        formData.append("address_ship", newAddress);

        try {
            const response = await api.post(endpoints["current-user-address"], formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setAddresses([...addresses, response.data]); // Update state
            setNewAddress(""); // Clear input field
        } catch (error) {
            console.log("Error adding address:", error.response?.data || error.message);
        }
    };

    // Update an existing address
    const updateAddress = async (addressId) => {
        if (!updatedAddress.trim()) return Alert.alert("Lỗi", "Vui lòng nhập địa chỉ mới");

        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const api = await authApis(token);

        const formData = new FormData();
        formData.append("address_id", addressId);
        formData.append("address_ship", updatedAddress);

        try {
            await api.patch(endpoints["current-user-address"], formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            fetchAddresses(); // Refresh address list
            setEditingAddress(null); // Close edit mode
            setUpdatedAddress(""); // Clear input field
        } catch (error) {
            console.log("Error updating address:", error.response?.data || error.message);
        }
    };

    // Render each address with an "Edit" button
    const renderAddressItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Text style={styles.addressText}>{item.address_ship}</Text>

                {/* Show input field if editing this address */}
                {editingAddress === item.id ? (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập địa chỉ mới"
                            value={updatedAddress}
                            onChangeText={setUpdatedAddress}
                        />
                        <Button mode="contained" onPress={() => updateAddress(item.id)} style={styles.saveButton}>
                            Lưu
                        </Button>
                    </>
                ) : (
                    <Button mode="outlined" onPress={() => setEditingAddress(item.id)} style={styles.editButton}>
                        Chỉnh sửa
                    </Button>
                )}
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <FlatList data={addresses} keyExtractor={(item) => item.id.toString()} renderItem={renderAddressItem} />

            {/* Add New Address Section */}
            <TextInput
                style={styles.input}
                placeholder="Nhập địa chỉ mới"
                value={newAddress}
                onChangeText={setNewAddress}
            />
            <Button mode="contained" onPress={addAddress} style={styles.addButton}>
                Thêm địa chỉ
            </Button>
        </View>
    );
};

export default ManageAddress;
