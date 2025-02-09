import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    SelectButton: {
        backgroundColor: '#6200ea',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    selectText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 16,
    },
    SaveButton: {
        backgroundColor: '#03dac6',
        padding: 16,
        borderRadius: 8,
    },
    saveText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default styles;
