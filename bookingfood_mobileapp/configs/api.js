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
  "current-store-menu": (id) => `/Store/${id}/menus/`, // Chức năng lấy menu của cửa hàng và hiển thị các đồ ăn trong menu đó 'GET'
  "current-store-update": (id) => `/Store/${id}/update/`, // Chức năng cập nhật thông tin cửa hàng 'PATCH'

  //Đồ ăn
  "food": "/Food/", // Thêm đường dẫn cho "food , lấy danh sách toàn bộ đồ ăn trong database // 'GET'
  "food-details": (id) => `/Food/${id}/`, //Thông tin chi tiết đồ ăn + Cập nhật chi tiết + Xóa đồ ăn // 'GET + PATCH + DELETE'
  "food-addtomenu": (id) => `/Food/${id}/add-to-menu`, // Thêm đồ ăn vào menu của cửa hàng // 'PATCH'
  "food-review": (id) => `/Food/${id}/review`, // Lấy review của đồ ăn và đăng review cho đồ ăn // 'GET + POST'
  "food-status-update": (id) => `/Food/${id}/update-food-status` // Cập nhật trạng thái đồ ăn và
};

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000
});

export default axiosInstance;
