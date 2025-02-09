import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignItems: "center",
    color: "#333",
    margin: 20,
  },
  loading: {
    marginTop: 20,
  },
  storeList: {
    paddingHorizontal: 10,
  },
  storeCard: {
    width: width / 2 - 20, // Adjust width for better layout
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    marginHorizontal: 3,
  },
  storeImage: {
    width: "100%",
    height: 160, // Adjust to make it look more square
    borderRadius: 12,
  },
  storeInfo: {
    padding: 10,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  storeRating: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
});

export default HomeStyles;
