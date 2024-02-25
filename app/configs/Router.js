import React from 'react';
import {Image, StyleSheet} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import config from '../configs';

import HomeRenderIcon from '../images/pic/btn-homepage2.png';
import HomePressedIcon from '../images/pic/btn-homepage.png';
import UserCenterRenderIcon from '../images/common/tab_gerenzhongxini_n.png';
import UserCenterPressedIcon from '../images/common/tab_gerenzhongxini_h.png';

// 请按字母排序以方便人工检索
import * as About from '../layouts/About';
import * as ConnectDevice from '../layouts/ConnectDevice';
import * as Drawer from '../layouts/Drawer';
import * as Device from '../layouts/Device';
import * as Home from '../layouts/Home';
import * as Login from '../layouts/Login';
import * as LoginCode from '../layouts/LoginCode';
import * as LoginPage from '../layouts/LoginPage';
import * as LoginResetPasswd from '../layouts/LoginResetPasswd';
import * as QRCodes from '../layouts/QRCodes';
import * as Register from '../layouts/Register';
import * as Setting from '../layouts/Setting';
import * as User from '../layouts/User';
import * as UserSetting from '../layouts/UserSetting';
import * as UserSettingAddr from '../layouts/UserSettingAddr';
import * as UserSettingEmail from '../layouts/UserSettingEmail';
import * as UserSettingName from '../layouts/UserSettingName';
import * as UserSettingPasswd from '../layouts/UserSettingPasswd';
import * as WebViewLayout from '../layouts/WebViewLayout';

import connectComponent from '../utils/connectComponent';

const styles = StyleSheet.create({
  tabIcon: {
    height: 23,
    width: 23,
    resizeMode: 'cover',
  },
});

// 请按字母排序以方便人工检索
const RouterConfigs = {
  About: {
    screen: connectComponent(About),
  },
  ConnectDevice: {
    screen: connectComponent(ConnectDevice),
  },
  Device: {
    screen: connectComponent(Device),
  },
  Home: {
    screen: connectComponent(Home),
  },
  Login: {
    screen: connectComponent(Login),
  },
  LoginCode: {
    screen: connectComponent(LoginCode),
  },
  LoginPage: {
    screen: connectComponent(LoginPage),
  },
  LoginResetPasswd: {
    screen: connectComponent(LoginResetPasswd),
  },
  QRCodes: {
    screen: connectComponent(QRCodes),
  },
  Register: {
    screen: connectComponent(Register),
  },
  Setting: {
    screen: connectComponent(Setting),
  },
  User: {
    screen: connectComponent(User),
  },
  UserSetting: {
    screen: connectComponent(UserSetting),
  },
  UserSettingAddr: {
    screen: connectComponent(UserSettingAddr),
  },
  UserSettingEmail: {
    screen: connectComponent(UserSettingEmail),
  },
  UserSettingName: {
    screen: connectComponent(UserSettingName),
  },
  UserSettingPasswd: {
    screen: connectComponent(UserSettingPasswd),
  },
  WebViewLayout: {
    screen: connectComponent(WebViewLayout),
  },
};

const Stack = createStackNavigator();

function HomeStackScreen() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      mode="card" // 跳转方式：默认的 card ，在 iOS 上是从右到左跳转，在 Android 上是从下到上，都是使用原生系统的默认跳转方式
      headerMode="screen" // 导航条动画效果： float 表示会渐变，类似于 iOS 的原生效果， screen 表示没有渐变， none 表示隐藏导航条
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: config.backgroundColor,
        },
      }}
    >
      <Stack.Screen name="About" component={RouterConfigs.About.screen} />
      <Stack.Screen
        name="ConnectDevice"
        component={RouterConfigs.ConnectDevice.screen}
      />
      <Stack.Screen name="Device" component={RouterConfigs.Device.screen} />
      <Stack.Screen name="Home" component={RouterConfigs.Home.screen} />
      <Stack.Screen name="Login" component={RouterConfigs.Login.screen} />
      <Stack.Screen
        name="LoginCode"
        component={RouterConfigs.LoginCode.screen}
      />
      <Stack.Screen
        name="LoginPage"
        component={RouterConfigs.LoginPage.screen}
      />
      <Stack.Screen
        name="LoginResetPasswd"
        component={RouterConfigs.LoginResetPasswd.screen}
      />
      <Stack.Screen name="QRCodes" component={RouterConfigs.QRCodes.screen} />
      <Stack.Screen name="Register" component={RouterConfigs.Register.screen} />
      <Stack.Screen name="Setting" component={RouterConfigs.Setting.screen} />
      <Stack.Screen
        name="UserSetting"
        component={RouterConfigs.UserSetting.screen}
      />
      <Stack.Screen
        name="UserSettingAddr"
        component={RouterConfigs.UserSettingAddr.screen}
      />
      <Stack.Screen
        name="UserSettingEmail"
        component={RouterConfigs.UserSettingEmail.screen}
      />
      <Stack.Screen
        name="UserSettingName"
        component={RouterConfigs.UserSettingName.screen}
      />
      <Stack.Screen
        name="UserSettingPasswd"
        component={RouterConfigs.UserSettingPasswd.screen}
      />
      <Stack.Screen
        name="WebViewLayout"
        component={RouterConfigs.WebViewLayout.screen}
      />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function HomeTabScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      lazy={true}
      tabBarOptions={{
        activeTintColor: '#2562b4',
        // inactiveTintColor: '#999999',
        // showLabel: false,
        style: {
          backgroundColor: '#FFFFFF',
        },
        labelStyle: {
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          title: '首页',
          tabBarIcon: ({focused, tintColor}) => (
            <Image
              source={focused ? HomePressedIcon : HomeRenderIcon}
              style={styles.tabIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="UserCenter"
        component={RouterConfigs.User.screen}
        navigationOptions={{
          title: '个人中心',
          tabBarIcon: ({focused, tintColor}) => (
            <Image
              source={focused ? UserCenterPressedIcon : UserCenterRenderIcon}
              style={styles.tabIcon}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const drawerWidth = 252; // drawerWidth 要和 ../layouts/Drawer.js 中的 ImageBackground 的 width 相同

const DrawerNav = createDrawerNavigator();

export default function Router() {
  return (
    <NavigationContainer>
      <DrawerNav.Navigator
        initialRouteName="DrawerHome"
        drawerStyle={{
          backgroundColor: '#204A87',
          width: drawerWidth,
        }}
        drawerContentOptions={{
          activeTintColor: '#83B5F7',
          inactiveTintColor: 'white',
          itemStyle: {
            paddingVertical: 5,
            paddingHorizontal: drawerWidth * 0.2,
          },
          labelStyle: {
            marginLeft: 0,
          },
        }}
      >
        <DrawerNav.Screen
          name="DrawerHome"
          component={HomeTabScreen}
          options={{
            drawerLabel: config.localeGet(config.locale, 'Home'),
            drawerIcon: ({focused, tintColor}) => (
              <Image
                source={HomePressedIcon}
                style={{width: 25, height: 25, tintColor: tintColor}}
              />
            ),
          }}
        />
        <DrawerNav.Screen
          name="DrawerAbout"
          component={RouterConfigs.About.screen}
          options={{
            drawerLabel: config.localeGet(config.locale, 'About'),
            drawerIcon: ({tintColor}) => (
              <Image
                source={UserCenterPressedIcon}
                style={{width: 25, height: 25, tintColor: tintColor}}
              />
            ),
          }}
        />
      </DrawerNav.Navigator>
    </NavigationContainer>
  );
}
