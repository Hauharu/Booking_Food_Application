import axios from "axios";

const baseURL = 'https://jsonplaceholder.typicode.com'

//Người dùng
const apiEndpoints = {
  register: "/Users/",   //đăng ký người dùng
  login: "/o/token/",    //đăng nhập người dùng
  "current-user": "/Users/current-user/",   //Thông tin người dùng 'GET + PATCH'
  "current-user-address": "/Users/current-user/address/",   //Địa chỉ nhà người dùng 'GET + POST + PATCH'
  "current-user-order": "/Users/current-user/my-order/",   //Đơn hàng người dùng 'GET'
  "current-user-followedstore": "/Users/current-user/followed-store/",   //Cửa hàng người dùng theo dõi 'GET'

  //Cửa hàng
  "store": "/Store/",   //Danh sách cửa hàng và chức năng tạo cửa hàng 'GET + POST'
  "current-store": (id) => `/Store/${id}/`,   //Thông tin và các chức năng liên quan đến cửa hàng 'GET + POST + PATCH + DELETE'
  "current-store-comment": (id) => `/Store/${id}/comment/`, //Bình luận cửa hàng 'GET + POST'
  "current-store-follow": (id) => `/Store/${id}/follow/`, //Chức năng để theo dõi cửa hàng
  "current-store-food": (id) => `/Store/${id}/food/`, // Chức năng lấy danh sách đồ ăn cửa hàng và thêm đồ ăn cho cửa hàng 'GET + POST'
  "current-store-update": (id) => `/Store/${id}/update/`, // Chức năng cập nhật thông tin cửa hàng 'PATCH'

  //Đồ ăn
  "food": "/Food/" // Thêm đường dẫn cho "food"
};

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000
});

export default axiosInstance;
