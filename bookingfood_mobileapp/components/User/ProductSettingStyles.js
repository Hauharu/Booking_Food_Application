import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    productImage: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
        borderRadius: 10,
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#fff",
        marginTop: 5,
    },
    saveButton: {
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    deleteButton: {
        backgroundColor: "transparent",
        padding: 15,
        borderWidth: 2,
        borderColor: "#000000",
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    saveText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    deleteText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default styles;