import { RESTAURANTS, FOODS } from "../data";

const initialState = {
    foods: FOODS,
    filterFoods: FOODS,
    favFoods: FOODS.filter(food => food.isFav === true),
    restaurants: RESTAURANTS,
    filterRestaurants: RESTAURANTS,
    favRestaurants: RESTAURANTS.filter(restaurant => restaurant.isFav === true),
    cartItems: [],
    orderItems: [],
    auth: {
        isLoggedIn: true,
        user: {},
    }
}

const reducer = (state = initialState, action) => {
    // Thay đổi món ăn yêu thích
    if (action.type === 'TOGGLE_FAVORITE_FOOD') {
        const existsIndex = state.favFoods.findIndex(food => food.id === action.foodId);
        if (existsIndex >= 0) {
            const updatedFavFoods = [...state.favFoods]
            updatedFavFoods.splice(existsIndex, 1)
            return { ...state, favFoods: updatedFavFoods }
        }
        else {
            const food = state.foods.find(food => food.id === action.foodId);
            return { ...state, favFoods: state.favFoods.concat(food) }
        }
    }
    // Thay đổi nhà hàng yêu thích
    if (action.type === 'TOGGLE_FAVORITE_RESTAURANT') {
        const existsIndex = state.favRestaurants.findIndex(restaurant => restaurant.id === action.restaurantId);
        if (existsIndex >= 0) {
            const updatedFavRestaurants = [...state.favRestaurants]
            updatedFavRestaurants.splice(existsIndex, 1)
            return { ...state, favRestaurants: updatedFavRestaurants }
        }
        else {
            const restaurant = state.restaurants.find(restaurant => restaurant.id === action.restaurantId);
            return { ...state, favRestaurants: state.favRestaurants.concat(restaurant) }
        }
    }

    // Lọc món ăn và nhà hàng
    if (action.type === 'SET_FILTER') {
        const appliedFilters = action.filters;
        const updatedFilteredFoods = state.foods.filter(food => {
            if (appliedFilters.isBrandOn || appliedFilters.isSaleOn) {
                if (appliedFilters.isBrandOn != food.isBrand)
                    return false;
                if (appliedFilters.isSaleOn != food.isSale)
                    return false;
            }
            if (appliedFilters.categoryIndex != 0 && appliedFilters.categoryIndex != food.categoryId)
                return false;
            if (appliedFilters.ratingIndex != 0 && appliedFilters.ratingIndex != Math.floor(food.rating))
                return false;
            if (appliedFilters.priceIndex != 0) {
                switch (appliedFilters.priceIndex) {
                    case 1:
                        return food.price < 10000
                    case 2:
                        return food.price >= 20000 && food.price <= 30000
                    case 3:
                        return food.price >= 30000 && food.price <= 40000
                    case 4:
                        return food.price >= 40000 && food.price <= 50000
                    case 5:
                        return food.price > 50000
                }
            }
            return true;
        })

        const updatedFilteredRestaurants = state.restaurants.filter(restaurant => {
            if (appliedFilters.isBrandOn || appliedFilters.isSaleOn) {
                if (appliedFilters.isBrandOn != restaurant.isBrand)
                    return false;
                if (appliedFilters.isSaleOn != restaurant.isSale)
                    return false;
            }
            if (appliedFilters.categoryIndex != 0 && appliedFilters.categoryIndex != restaurant.categoryId)
                return false;
            if (appliedFilters.ratingIndex != 0 && appliedFilters.ratingIndex != Math.floor(restaurant.rating))
                return false;
            if (appliedFilters.priceIndex !== 0) {
                const foodsOfRestaurants = FOODS.filter(food => food.restaurantId == restaurant.id)
                if (foodsOfRestaurants.length !== 0) {
                    let check = false
                    foodsOfRestaurants.map(food => {
                        switch (appliedFilters.priceIndex) {
                            case 1:
                                check = food.price < 10000
                                break;
                            case 2:
                                check = food.price >= 20000 && food.price <= 30000
                                break;
                            case 3:
                                check = food.price >= 30000 && food.price <= 40000
                                break;
                            case 4:
                                check = food.price >= 40000 && food.price <= 50000
                                break;
                            case 5:
                                check = food.price > 50000
                                break;
                        }
                    });
                    return check;
                }
            }
            return true;
        })
        return { ...state, filterFoods: updatedFilteredFoods, filterRestaurants: updatedFilteredRestaurants }
    }

    //Thêm 1 item vào giỏ hàng
    if (action.type === 'ADD_TO_CART') {
        const newCartItem = action.cartItem;
        const existingCartItemIndex = state.cartItems.findIndex((item) => item.foodId === newCartItem.foodId);
        if (existingCartItemIndex >= 0) {
            const updatedCartItems = [...state.cartItems];
            updatedCartItems[existingCartItemIndex].quantity += newCartItem.quantity;
            return { ...state, cartItems: updatedCartItems };
        } else {
            const updatedCartItems = [...state.cartItems, newCartItem];
            return { ...state, cartItems: updatedCartItems };
        }
    }

    //Thêm nhiều item vào giỏ hàng
    if (action.type === 'ADD_MANY_TO_CART') {
        const newCartItems = action.cartItems;
        const updatedCartItems = [...state.cartItems];
        newCartItems.forEach((newCartItem) => {
            const existingCartItemIndex = updatedCartItems.findIndex((item) => item.foodId === newCartItem.foodId);
            if (existingCartItemIndex >= 0) {
                updatedCartItems[existingCartItemIndex].quantity += newCartItem.quantity;
            } else {
                updatedCartItems.push(newCartItem);
            }
        });
        return { ...state, cartItems: updatedCartItems };
    }

    // Cập nhật giỏ hàng
    if (action.type === 'UPDATE_CART') {
        return { ...state, cartItems: action.cartItems };
    }

    // Xóa khỏi giỏ hàng
    if (action.type === 'DELETE_FROM_CART') {
        const itemIdToRemove = action.foodId;
        const updatedCartItems = state.cartItems.filter((item) => item.foodId !== itemIdToRemove);
        return { ...state, cartItems: updatedCartItems };
    }

    //Thêm vào danh sách đơn hàng
    if (action.type === 'ADD_TO_ORDERS') {
        return {
            ...state,
            orderItems: [...state.orderItems, action.newOrderItem],
            cartItems: []
        };
    }

    return state
}
export default reducer