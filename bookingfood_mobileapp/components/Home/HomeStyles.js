import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingTop: 20, // Đảm bảo khoảng cách ở trên
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  categoryScroll: {
    paddingVertical: 10,
    marginBottom: 16,
  },
  categoryChip: {
    width: "auto",
    height: 47,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderColor: "#4CAF50",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryChipText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  loading: {
    marginTop: 20,
    alignSelf: "center",
  },
  productList: {
    flexDirection: "flex", // Điều chỉnh để sản phẩm nằm ngang
    justifyContent: "space-between", // Tạo khoảng cách giữa các sản phẩm
    paddingBottom: 16,
    marginTop: 16, // Đảm bảo sản phẩm bắt đầu từ trên
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16, // Tăng khoảng cách dưới mỗi sản phẩm
    width: (width - 48) / 2, // Đảm bảo 2 sản phẩm mỗi hàng
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  productImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  storeName: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
    fontStyle: "italic",
  },
});


export default HomeStyles;
