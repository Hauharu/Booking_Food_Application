import React, { useContext, } from 'react';
import { SafeAreaView, TouchableOpacity, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../Home/Home';
import Login from '../User/Login';
import Search from '../Home/Search';
import UserProfile from '../User/UserProfile';
import Order from '../Home/Order';
import styles from './DefaultStyles';
import Colors from '../../colors/Colors';
import ShoppingCart from '../Home/ShoppingCart';
import { MyUserContext } from '../../configs/UserContexts';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const TabButton = ({ item, onPress, accessibilityState }) => {
  const focused = accessibilityState.selected;
  const IconComponent = item.type === 'Ionicons' ? Icon : MaterialCommunityIcons;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.tabButtonContainer}
    >
      <View style={{ alignItems: 'center' }}>
        <IconComponent
          name={focused ? item.activeIcon : item.inActiveIcon}
          size={28}
          color={focused ? '#0a8791' : Colors.primaryLite} // Màu icon khi được chọn là #0a8791
        />
        <Text
          style={{
            fontSize: 10,
            color: focused ? '#0a8791' : Colors.primaryLite, // Màu chữ khi được chọn
            marginTop: 4,
          }}
        >
          {item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function Default() {
  const { user } = useContext(MyUserContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 0,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarButton: (props) => (
              <TabButton
                {...props}
                item={{
                  route: 'Home',
                  type: 'Ionicons',
                  activeIcon: 'home',
                  inActiveIcon: 'home-outline',
                  label: 'Trang chủ',
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarButton: (props) => (
              <TabButton
                {...props}
                item={{
                  route: 'Search',
                  type: 'Ionicons',
                  activeIcon: 'search',
                  inActiveIcon: 'search-sharp',
                  label: 'Tìm kiếm',
                }}
              />
            ),
          }}
        />
          {user !== null && (
              <>
                  <Tab.Screen
                      name="ShoppingCart"
                      component={ShoppingCart}
                      options={{
                          tabBarButton: (props) => (
                              <TabButton
                                  {...props}
                                  item={{
                                      route: 'ShoppingCart',
                                      type: 'Ionicons',
                                      activeIcon: 'cart',
                                      inActiveIcon: 'cart-outline',
                                      label: 'Thanh toán',
                                  }}
                              />
                          ),
                      }}
                  />
                  <Tab.Screen
                      name="Order"
                      component={Order}  // Replace this with your actual component for the "Order" tab
                      options={{
                          tabBarButton: (props) => (
                              <TabButton
                                  {...props}
                                  item={{
                                      route: 'Order',
                                      type: 'Ionicons',
                                      activeIcon: 'clipboard',
                                      inActiveIcon: 'clipboard-outline',
                                      label: 'Order',
                                  }}
                              />
                          ),
                      }}
                  />
              </>
          )}



        <Tab.Screen
          name="Login"
          component={user === null ? Login : UserProfile}
          options={{
            tabBarButton: (props) => (
              <TabButton
                {...props}
                item={{
                  route: 'Login',
                  type: 'MaterialCommunityIcons',
                  activeIcon: 'account',
                  inActiveIcon: 'account-outline',
                  label: 'Tài khoản',
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
