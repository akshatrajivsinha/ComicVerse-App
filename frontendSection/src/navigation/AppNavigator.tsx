import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from '@src/pages/auth/LandingPage/LandingPage';
import LoginPage from '@src/pages/auth/LoginPage/LoginPage';
import RegisterPage from '@src/pages/auth/RegisterPage/RegisterPage';
import OTPScreen from '@src/pages/auth/OTPScreen/OTPScreen';
import TabNavigator from '@src/navigation/TabNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
