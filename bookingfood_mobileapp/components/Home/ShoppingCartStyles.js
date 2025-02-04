import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#4CAF50",
      textAlign: "center",
      marginBottom: 16,
    },
    cartItem: {
      flexDirection: "row",
      backgroundColor: "#fff",
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 12,
    },
    itemDetails: {
      flex: 1,
      justifyContent: "space-between",
    },
    itemName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    removeButton: {
      backgroundColor: "#f44336",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      alignSelf: "flex-start",
    },
    removeButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    footer: {
      marginTop: 20,
      padding: 16,
      backgroundColor: "#fff",
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    totalPrice: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 45,
      textAlign: "right",
    },
    checkoutButton: {
      backgroundColor: "#4CAF50",
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom:70,
      borderRadius: 8,
      alignItems: "center",
    },
    checkoutButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    
  });

  export default styles;
  