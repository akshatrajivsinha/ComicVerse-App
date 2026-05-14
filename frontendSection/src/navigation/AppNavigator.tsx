import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from '@src/pages/auth/LandingPage';
import LoginPage from '@src/pages/auth/LoginPage';
import RegisterPage from '@src/pages/auth/RegisterPage';
import OTPScreen from '@src/pages/auth/OTPScreen';
import TabNavigator from '@src/navigation/TabNavigator';
import ShowDetail from '@src/pages/tabs/HomeTab/Show';
import { useAuthStore } from '@src/store/authStore';
import { screenNames } from '@src/navigation/screenName';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={screenNames.LANDING}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={screenNames.LANDING} component={LandingPage} />
      <Stack.Screen name={screenNames.LOGIN} component={LoginPage} />
      <Stack.Screen name={screenNames.REGISTER} component={RegisterPage} />
      <Stack.Screen name={screenNames.OTP} component={OTPScreen} />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={screenNames.MAIN_TABS}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={screenNames.MAIN_TABS} component={TabNavigator} />
      <Stack.Screen name={screenNames.SHOW_DETAIL} component={ShowDetail} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const authToken = useAuthStore((state) => state.authToken);

  return (
      <NavigationContainer>
        {authToken ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
  );
};

export default AppNavigator;
