import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FAFAFA",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: "#666",
  },
  productItem: {
    backgroundColor: "#FFF",
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  productImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E91E63",
    marginTop: 4,
  },
  productRating: {
    fontSize: 14,
    color: "#FFA000",
    marginTop: 4,
  },
  storeName: {
    fontSize: 14,
    color: "#757575",
    marginTop: 4,
  },
  comparisonText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 6,
    padding: 6,
    borderRadius: 6,
    textAlign: "center",
  },
});

