import axios from "axios";

const baseURL = 'http://127.0.0.1:8000'

//Người dùng
const apiEndpoints = {
  register: "/Users/",   //đăng ký người dùng
  login: "/o/token/",    //đăng nhập người dùng
  "current-user": "/Users/current-user/",   //Thông tin người dùng 'GET + PATCH'
  "current-user-address": "/Users/current-user/address/",   //Địa chỉ nhà người dùng 'GET + POST + PATCH'
  "current-user-order": "/Users/current-user/my-order/",   //Đơn hàng người dùng 'GET'
  "current-user-followedstore": "/Users/current-user/followed-store/",   //Cửa hàng người dùng theo dõi 'GET'
  "current-user-reviews": "/User/current-user/reviews/", //Các comments và reviews của người dùng 'GET'

  //Cửa hàng
  "store": "/Store/",   //Lấy danh sách cửa hàng và chức năng tạo cửa hàng 'GET + POST'
  "current-store": (id) => "/Store/${id}/",   //Thông tin và các chức năng liên quan đến cửa hàng 'GET + POST + PATCH + DELETE'
  "current-store-comment": (id) => "/Store/${id}/comment/", //Bình luận cửa hàng 'GET + POST'
  "current-store-follow": (id) => "/Store/${id}/follow/", //Chức năng để theo dõi cửa hàng 'POST'
  "current-store-food": (id) => "/Store/${id}/foods/", // Chức năng lấy danh sách đồ ăn cửa hàng 'GET'
  "current-store-menu": (id) => "/Store/${id}/menus/", // Chức năng lấy menu của cửa hàng và hiển thị các đồ ăn trong menu đó 'GET'

  //Đồ ăn dành cho chủ cửa hàng
  "foodm": "/FoodM/", //Truy cập danh sách đồ ăn của cửa hàng và thêm đồ ăn cho cửa hàng 'GET + POST
  "foodm-detail": (id) => "/FoodM/${id}", //Truy cập chi tiết đồ ăn, sửa và xóa đồ ăn có trong cửa hàng mình 'GET + PATCH + DELETE'
  "foodm-review": (id) => "/FoodM/${id}/review", //Truy cập review đồ ăn cửa hàng mình 'GET'
  "foodm-updatestatus": (id) => "/FoodM/{id}/update-food-status/", //Cập nhật trạng thái đồ ăn 'PATCH'

  //Đồ ăn cho tất cả người dùng
  "food": "/FoodP/", // Lấy danh sách tất cả đồ ăn (Dùng cho hiện danh sách ở màn hình chính) 'GET'
  "food-detail": (id) => "/FoodP/${id}/", //Lấy chi tiết một đồ ăn cụ thể 'GET'
  "food-review": (id) => "/FoodP/${id}/review/", //Lấy reviews của đồ ăn và cho phép đăng bình luận đồ ăn 'GET + POST'

  //Quản lý menu cửa hàng
  "menu": "/Menu/", //Truy xuất danh sách menu cửa hàng và cho phép tạo một menu mới 'GET + POST'
  "menu-detail": (id) => "/Menu/${id}/", //Truy xuất chi tiết một menu và cho phép chỉnh sửa thông tin menu và xóa menu đó 'GET + PATCH + DELETE'
  "menu-addfoods": (id) =>"/Menu/${id}/add-foods/", //Thêm đồ ăn vào menu 'PATCH'
  "menu-removefoods": (id) => "/Menu/${id}/remove-foods/", //Bỏ đồ ăn khỏi menu 'PATCH'

  //API chỉnh sửa comment
  "comment-edit": (id) => "/Comment/${id}/", //Cho phép người dùng chỉnh sửa nội dung và đánh giá comment 'PATCH + PUT(Nên dùng PATCH cho chắc)'
  "comment-delete": (id) => "/Comment/${id}/", //Cho phép người dùng xóa comment 'DELETE'

  //API chỉnh sửa review
  "review-edit": (id) => "/Review/${id}/", //Cho phép người dùng chỉnh sửa nội dung và đánh giá review 'PATCH + PUT(Nên dùng PATCH cho chắc)'
  "review-delete": (id) => "/Review/${id}/", //Cho phép người dùng xóa review 'DELETE'

  //API danh mục (chủ yếu để lấy danh sách cho lựa chọn thôi)
  "category":  "/Category/", //Truy xuất danh sách danh mục 'GET'
  "category-food": (id) => "/Category/${id}/food/", //"Truy xuất đồ ăn nằm trong danh mục 'GET'

  //API giỏ hàng
  "cart": "/Cart/", //Truy xuất giỏ hàng người đang đăng nhập hiện tại 'GET'
  "cart-add": "/Cart/add_to_cart/", //Thêm một đồ ăn vào giỏ hàng
  "cart-increase": (id) => "/Cart/${id}/increase_quantity/", //Cộng số lượng đồ ăn lên một (ID ở đây là id cartitem) 'POST'
  "cart-decrease": (id) => "/Cart/${id}/decrease_quantity/", //Giảm số lượng đồ ăn lên một (ID ở đây là id cartitem) 'POST'
  "cart-foodremove": (id) => "/Cart/${id}/remove_item/", //Bỏ đồ ăn khỏi giỏ hàng 'DELETE'
};

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000
});

export default axiosInstance;