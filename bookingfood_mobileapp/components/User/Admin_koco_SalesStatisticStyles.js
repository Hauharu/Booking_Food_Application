import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f4f4f9',
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    statContainer: {
      marginVertical: 10,
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 8,
      elevation: 3, // Tạo hiệu ứng đổ bóng cho container
    },
    statTitle: {
      fontSize: 18,
      color: '#333',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#007bff',
    },
    subtitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 30,
      marginBottom: 10,
    },
    storeContainer: {
      marginVertical: 8,
      padding: 8,
      backgroundColor: '#e3e3e3',
      borderRadius: 6,
    },
    storeName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    storeValue: {
      fontSize: 16,
      color: '#333',
    },
  });

  export default styles;