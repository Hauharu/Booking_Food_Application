import { StyleSheet } from "react-native";
import Colors from "../../colors/Colors";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background || '#0a8791', // Xanh nhạt dễ chịu
  },
  tabBar: {
    height: 70,
    position: 'absolute',
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff', // Màu trắng cho thanh tab
    shadowColor: '#87a8d0', // Xanh pastel cho bóng đổ
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 5,
  },
  tabButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa', // Xanh ngọc pastel cho nút tab
    borderRadius: 12,
  },
});

export default styles;
