import React, { useEffect, useState, useReducer } from 'react';
import { View, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './components/Home/Home';
import Login from './components/User/Login';
import Default from './components/DefaultApp/Default';
import { MyDispatchContext, MyUserContext } from './configs/UserContexts';
import MyUserReducer from './configs/UserReducers';
import Register from './components/User/Register';
import UserProfile from './components/User/UserProfile';
import ManageAddress from './components/User/ManageAddress';
import StoreOrder from "./components/User/StoreOrder";
import AddFood from './components/Seller/AddFood';
import AddMenu from './components/Seller/AddMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShoppingCart from './components/Home/ShoppingCart';
import FoodDetail from './components/Home/FoodDetail';
import StoreDetail from './components/Home/StoreDetail';
import EditUser from "./components/User/EditUser";
import RestaurantRegister from "./components/User/RestaurantRegister";
import Statistics from "./components/User/Statistics";
import ManageFood from "./components/Seller/ManageFood";
import StoreMenu from './components/Home/StoreMenu';
const Stack = createStackNavigator();

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const appStateListener = AppState.addEventListener("change", async (nextAppState) => {
      if (nextAppState === "inactive" || nextAppState === "background") {
        console.log("Ứng dụng vào nền, nhưng không xóa user_id");
      } else if (nextAppState === "active") {
        console.log("Ứng dụng đang hoạt động");
      }
    });

    return () => {
      appStateListener.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <MyUserContext.Provider value={{ user, loginInfo: (userData) => dispatch({ type: 'login', payload: userData }) }}>
        <MyDispatchContext.Provider value={dispatch}>
          <View style={{ flex: 1, marginTop: 25 }}>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Default">
              <Stack.Screen name="Default" component={Default} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="ManageAddress" component={ManageAddress} />
              <Stack.Screen name="UserProfile" component={UserProfile} />
              <Stack.Screen name="StoreOrder" component={StoreOrder} />
              <Stack.Screen name="EditUser" component={EditUser} />
              <Stack.Screen name="ShoppingCart" component={ShoppingCart}/>
              <Stack.Screen name="RestaurantRegister" component={RestaurantRegister}/>
              <Stack.Screen name="FoodDetail" component={FoodDetail} />
              <Stack.Screen name="StoreDetail" component={StoreDetail} />
              <Stack.Screen name='Statistics' component={Statistics}/>
              <Stack.Screen name="AddFood" component={AddFood} />
              <Stack.Screen name="AddMenu" component={AddMenu} />
              <Stack.Screen name="StoreMenu" component={StoreMenu} />
              <Stack.Screen name="ManageFood" component={ManageFood} />
            </Stack.Navigator>
          </View>
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
}

