import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
    marginBottom: 20,
    // color: "#333",
  },
  loginButton: {
    backgroundColor: "#3498db",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 5,
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  chip: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: "#6200ee",
    borderRadius: 20,
  },
  text_style: {
    fontSize: 40,
    color: "red",
  },
  title_login: {
    fontSize: 20,
    justifyContent: "center",
    alignContent: "center",
  },
  scrollViewContainer: {
    padding: 10,
  },
  productList: {
    flexDirection: "row", // Dùng flexDirection row để các phần tử nằm ngang
    flexWrap: "wrap", // Cho phép các phần tử xuống dòng khi hết không gian
    justifyContent: "space-between", // Căn đều các phần tử
  },
  productContainer: {
    width: "48%", // Mỗi sản phẩm chiếm khoảng 48% chiều rộng màn hình để hiển thị 2 cột
    marginBottom: 10,
    alignItems: "center",
  },
  productImage: {
    width: 150, // Điều chỉnh chiều rộng ảnh
    height: 150, // Điều chỉnh chiều cao ảnh
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    textAlign: "center",
  },
});
