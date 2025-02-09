import { StyleSheet } from "react-native";

const RegisterStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  RegisterInput: {
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  RegisterButton: {
    backgroundColor: "#EE4D2D",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  ChooseImageButton: {
    backgroundColor: "#FF5722",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  ChooseImageText: {
    color: "#fff",
    fontSize: 14,
  },
  AvatarPreview: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default RegisterStyles;
