import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const FoodDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  foodImage: {
    width: width,
    height: 300,
    marginBottom: 20,
    borderRadius: 16,  // Rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,  // Android shadow
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: -20, // Overlapping image
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoContainer1: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    marginHorizontal: 20,
    marginTop: -20, // Overlapping image
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  foodName: {
    fontSize: 35,
    fontWeight: "600",
    color: "#04423e",
    marginBottom: 10,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  foodPrice: {
    fontSize: 22,
    color: "#FF5722", // Updated color
    fontWeight: "bold",
    marginBottom: 10,
  },
  foodStatus: {
    fontSize: 30,
    color: "#777",
    marginBottom: 8,
  },
  foodStatus1: {
    fontSize: 20,
    color: "#777",
    marginBottom: 8,
  },
  foodDescription: {
    fontSize: 25,
    color: "#555",
    lineHeight: 24,
    marginBottom: 20,
  },
  buyButton: {
    backgroundColor: "#FF5722",
    padding: 15,
    borderRadius: 50,
    margin: 20,
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#d32f2f",
    textAlign: "center",
  },
  reviewsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  reviewsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  // reviewItem: {
  //   marginBottom: 14,
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#eee",
  //   paddingBottom: 10,
  // },
  // reviewUser: {
  //   fontWeight: "600",
  //   color: "#555",
  // },
  // reviewComment: {
  //   color: "#666",
  //   marginTop: 6,
  // },
  noReviewsText: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
  },
  addReviewContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  addReviewHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    height: 90,
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addToCartButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 50,
    margin: 20,
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  addToCartButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  quantityButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  storeContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  storeHeader: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 14,
    color: "#333",
  },
  storeImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  storeDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  storeRating: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
  },
  foodRating: {
    fontSize: 20,
    color: "#ffcd07",
    fontWeight: "600",
  },
  reviewItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  reviewUser: {
    fontWeight: 'bold',
    fontSize: 20
  },
  reviewComment: {
    marginVertical: 5,
  },
  quantityAddToCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

});

export default FoodDetailStyles;
