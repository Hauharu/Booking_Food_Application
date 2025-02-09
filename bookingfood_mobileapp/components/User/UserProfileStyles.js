import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  role: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#007AFF",
  },
  divider: {
    marginVertical: 8,
    height: 1,
    backgroundColor: "#ddd",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  value: {
    fontSize: 16,
    color: "#222",
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    paddingVertical: 10,
  },
  createStoreButton: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 10,
  },
  addProductButton: {
    marginTop: 10,
    backgroundColor: "#28A745",
    borderRadius: 10,
    paddingVertical: 10,
  },
  viewProductsButton: {
    marginTop: 10,
    backgroundColor: "#FFA500",
    borderRadius: 10,
    paddingVertical: 10,
  },
  pendingSellersButton: {
    marginTop: 10,
    backgroundColor: "#6C757D",
    borderRadius: 10,
    paddingVertical: 10,
  },
  receiveMessagesButton: {
    marginTop: 10,
    backgroundColor: "#17A2B8",
    borderRadius: 10,
    paddingVertical: 10,
  },
});

export default styles;
