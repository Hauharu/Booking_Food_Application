import { StyleSheet } from "react-native";

const RegisterStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FAFB", // Nền nhẹ
  },
  RegisterInput: {
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
  },
  RegisterButton: {
    backgroundColor: "#FF3B3F", // Màu đỏ cam nổi bật
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 12,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RegisterStyles;
