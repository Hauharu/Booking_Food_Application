import { StyleSheet } from "react-native";

export default StyleSheet.create({
    subject: {
        fontSize: 20,
        margin: 10,
        textAlign: "center",
        fontWeight: 'bold',
        color: '#34495e', // Thay đổi màu văn bản
    },
    container: { 
        flex: 1, 
        backgroundColor: '#ecf0f1' // Màu nền sáng hơn
    },
    header: { 
        flexDirection: 'row', 
        padding: 16, 
        backgroundColor: '#2980b9' // Thay đổi màu nền header thành màu xanh
    },
    storeImage: { 
        width: 70, 
        height: 70, 
        borderRadius: 40, 
        marginRight: 16, 
        backgroundColor: '#ecf0f1' // Thay đổi màu nền ảnh store
    },
    storeInfo: { 
        flex: 1 
    },
    storeName: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#fff' // Thay đổi màu chữ tên store
    },
    storeDetails: { 
        fontSize: 14, 
        color: '#bdc3c7' // Thay đổi màu chữ chi tiết store
    },
    switchContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 16, 
        backgroundColor: '#fff', 
        marginVertical: 8 
    },
    switchLabel: { 
        fontSize: 16, 
        color: '#34495e' // Màu cho nhãn switch
    },
    menuOptions: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        backgroundColor: '#fff', 
        paddingVertical: 16 
    },
    menuItem: { 
        alignItems: 'center' 
    },
    iconText: { 
        fontSize: 16, 
        margin: 5, 
        color: '#2980b9' // Thay đổi màu cho văn bản trong menu
    },
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        padding: 16, 
        color: '#2c3e50' // Màu cho tiêu đề phần
    },
    dishList: { 
        paddingHorizontal: 16 
    },
    dishCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 16, 
        backgroundColor: '#fff', 
        padding: 8, 
        borderRadius: 8, 
        shadowColor: '#bdc3c7', // Màu bóng đổ nhẹ
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dishImage: { 
        width: 90, 
        height: 90, 
        borderRadius: 10, 
        marginRight: 16, 
        backgroundColor: 'grey' 
    },
    dishName: { 
        fontSize: 17, 
        color: '#34495e' // Màu chữ tên món ăn
    },
    headerProfile: {
        padding: 20,
        backgroundColor: '#8e44ad', // Màu tím cho header profile
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
        backgroundColor: '#fff' // Màu nền avatar
    },
    rating: {
        fontSize: 17,
        color: '#f39c12', // Màu vàng cho đánh giá
        marginVertical: 5,
    },
    phone: {
        fontSize: 17,
        color: '#fff', // Màu trắng cho số điện thoại
    },
    incomeNumber: {
        fontSize: 17,
        textAlign: "center",
        color: '#2ecc71' // Màu xanh lá cho thu nhập
    },
    oderName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50' // Màu chữ tên đơn hàng
    },
    containerCardMenu: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 10, 
        backgroundColor: '#fff', 
        padding: 8, 
        borderRadius: 8,
    },
    cardChoiceName: {
        fontSize: 16,
        margin: 10,
        color: '#34495e' // Màu cho tên lựa chọn món
    },
    addBtn: {
        backgroundColor: '#27ae60', // Màu xanh lá cho nút "Thêm"
        margin: 10,
        padding: 10,
        borderRadius: 5,
    },
    inputMargin: {
        margin: 10,
        borderColor: '#16a085', // Màu xanh ngọc cho viền ô nhập liệu
        borderWidth: 1,
    },
    dropDownStyle: {
        margin: 5,
        paddingHorizontal: 5,
    },
    groupBtn: {
        flexDirection: 'row',
    },
    deleteBtn: {
        backgroundColor: '#e74c3c', // Màu đỏ cho nút "Xóa"
        margin: 10,
        padding: 10,
        borderRadius: 5,
    },

    switchContainerCustom: { 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        padding: 8 
    },
    scrollViewStyle: {
        backgroundColor: 'white',
        margin: 10,
        height: 300
    },
    orderContainer: {
        backgroundColor: '#fff',
        padding: 10,
        margin: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    topOrderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    orderText: {
        fontSize: 18,
        color: '#2c3e50', // Màu cho chữ đơn hàng
    },
    statusText: {
        fontSize: 14,
        color: '#e67e22', // Màu cam cho trạng thái đơn hàng
        fontWeight: 'bold',
    },
    orderInfoContainer: {
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#7f8c8d', // Màu xám cho thông tin đơn hàng
        marginBottom: 2,
    },
    receiveOrderBtn: {
        backgroundColor: '#3498db', // Màu xanh dương cho nút nhận đơn
        borderRadius: 4,
        alignItems: 'center',
        margin: 5,
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    orderDetailContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    customerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50' // Màu chữ tên khách hàng
    },
    orderIdStyle: {
        fontSize: 16,
        color: '#7f8c8d', // Màu xám cho mã đơn hàng
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#34495e' // Màu cho tên món ăn trong chi tiết đơn hàng
    },
    rejectBtn: {
        backgroundColor: '#e74c3c', // Màu đỏ cho nút từ chối
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    headerOrder: {
        backgroundColor: '#fff',
        margin: 5,
        padding: 5
    },
    headerOrderText: {
        color: '#2c3e50', // Màu cho tiêu đề đơn hàng
        fontWeight: 'bold',
        fontSize: 18
    },
    datePickerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
        backgroundColor: "#fff",
        height: 50
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    listItemText: {
        fontSize: 16,
        color: "#333",
    },
    listItemValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#EE4D2D", 
    },
    chartContainer: {
        backgroundColor: "#fff",
        flex: 1
    }
});
