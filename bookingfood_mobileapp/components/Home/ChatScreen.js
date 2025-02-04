import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { ref, push, onValue, off, set } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import db from "../../configs/firebase";
import styles from "../Home/ChatScreenStyles";
import { Ionicons } from "@expo/vector-icons"; // Import icon gửi tin nhắn

const ChatScreen = ({ route }) => {
  const { userId2 } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current; // Hiệu ứng gửi tin nhắn

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      setUserId(storedUserId);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId && userId2) {
      const messagesRef = ref(db, `messages/${userId}/${userId2}`);
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messagesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setMessages(messagesArray);

          // Đánh dấu tin nhắn là đã đọc
          messagesArray.forEach((message) => {
            if (!message.read) {
              const messageRef = ref(
                db,
                `messages/${userId}/${userId2}/${message.id}`
              );
              set(messageRef, { ...message, read: true });
            }
          });
        } else {
          setMessages([]);
        }
      });

      return () => off(messagesRef);
    }
  }, [userId, userId2]);

  const sendMessage = () => {
    if (text.trim() === "") return;
    const timestamp = new Date().toISOString();
    const newMessage = {
      senderId: userId,
      receiverId: userId2,
      text,
      timestamp,
      status: "sent",
      read: false,
    };

    push(ref(db, `messages/${userId}/${userId2}`), newMessage);
    push(ref(db, `messages/${userId2}/${userId}`), newMessage);
    setText("");

    // Hiệu ứng gửi tin nhắn
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.senderId === userId ? styles.myMessage : styles.otherMessage,
              item.read && item.receiverId === userId && styles.readMessage,
            ]}
          >
            <Text style={styles.userId}>
              {item.senderId === userId ? "Bạn" : "Khách hàng"}
            </Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString()}{" "}
              {item.read && item.senderId === userId && (
                <Ionicons name="checkmark-done" size={14} color="green" />
              )}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Nhập tin nhắn..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Ionicons name="send" size={24} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
