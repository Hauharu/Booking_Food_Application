import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f2f2f2",
  },
  messageContainer: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 15,
    maxWidth: "75%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 18,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 18,
  },
  userId: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    color: "#000000",
  },
  timestamp: {
    fontSize: 12,
    color: "#000000",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  readMessage: {
    backgroundColor: "#e6e6e6",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default styles;
