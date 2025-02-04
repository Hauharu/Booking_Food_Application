import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  orderInfo: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#555",
  },
  orderItemContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    color: "#555",
  },
  productQuantity: {
    fontSize: 14,
    color: "#555",
  },
  itemTotalPrice: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 50,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentMethodContainer: {
    marginVertical: 20,
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingLeft: 10,
    backgroundColor: "#f8f8f8",
  },
  paymentButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 50,
    marginTop: 20,
    alignItems: "center",
  },
});

export default styles;
