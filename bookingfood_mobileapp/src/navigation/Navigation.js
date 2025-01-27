import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, TouchableOpacity, View, Text } from 'react-native-ui-lib';
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  RestaurantScreen,
  FoodScreen,
  FavoritesScreen,
  FilterScreen,
  FilteredItemsScreen,
  CartScreen,
  CheckoutScreen,
  OrdersScreen,
  OrderDetailScreen,
  ShowAllScreen,
  ProfileScreen
} from '../screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="Restaurant"
        component={RestaurantScreen}
      />
      <Stack.Screen
        name="Food"
        component={FoodScreen}
      />

    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Tài khoản',
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Đăng nhập',
        }}
      />
      <Stack.Screen name="Register"
        component={RegisterScreen}
        options={{
          title: 'Đăng ký',
        }}
      />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator
      initialRouteName="CartScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          headerTitle: 'Giỏ hàng',
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          headerTitle: 'Thanh Toán',
        }}
      />
    </Stack.Navigator>
  );
}

function OrderStack() {
  return (
    <Stack.Navigator
      initialRouteName="OrdersScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="OrdersScreen"
        component={OrdersScreen}
        options={{
          headerTitle: 'Đơn hàng',
        }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          headerTitle: 'Chi tiết đơn hàng',
        }}
      />
    </Stack.Navigator>
  );
}

function MainTab({ navigation }) {
  return (
    <Tab.Navigator
      initialRouteName="MainStack"
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: {
          height: 58,
          paddingBottom: 8
        },
        headerStyle: {
          backgroundColor: Colors.primary
        },
        headerTintColor: Colors.white,
        headerLeft: () => (
          <TouchableOpacity paddingL-20 onPress={() => navigation.navigate("Home")} center>
            <MaterialCommunityIcons name="arrow-left" color={Colors.white} size={32} />
          </TouchableOpacity>
        )
      }}
    >
      <Tab.Screen
        name="MainStack"
        component={MainStack}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderStack}
        options={{
          tabBarLabel: 'Đơn hàng',
          headerTitle: 'Đơn hàng',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          tabBarLabel: 'Giỏ hàng',
          headerTitle: 'Giỏ hàng',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Yêu thích',
          headerTitle: 'Yêu thích',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Tài khoản',
          headerTitle: 'Tài khoản',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const FilterStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Filter'
        component={FilterScreen}
        options={{
          headerTitle: 'Lọc món ăn và địa điểm',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name='FilteredItems'
        component={FilteredItemsScreen}
        options={{
          headerTitle: 'Danh sách món ăn và địa điểm',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  )
}

const ShowAllStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='ShowAll'
        component={ShowAllScreen}
        options={{
          headerTitle: 'Xem tất cả',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  )
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Drawer.Screen name="Trang chủ" component={MainTab} />
        <Drawer.Screen name="Lọc" component={FilterStack} />
        <Drawer.Screen name="Xem tất cả" component={ShowAllStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

