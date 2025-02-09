const MyUserReducer = (currentState, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            return null;
        case "update_user":
            return { ...currentState, user: action.payload}
        default:
            return currentState;
    }
};

export default MyUserReducer;
