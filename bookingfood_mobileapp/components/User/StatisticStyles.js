import { StyleSheet } from 'react-native';

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
    subtitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
    statContainer: {
      marginVertical: 10,
      padding: 12,
      backgroundColor: '#fff',
      borderRadius: 8,
      elevation: 3,
    },
    storeName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#007bff',
    },
    storeValue: {
      fontSize: 16,
      color: '#333',
    },
    errorText: {
      fontSize: 18,
      color: 'red',
      textAlign: 'center',
    },
});

export default styles;
