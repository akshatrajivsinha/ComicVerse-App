import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from '@src/pages/auth/LandingPage/LandingPage';
import LoginPage from '@src/pages/auth/LoginPage/LoginPage';
import RegisterPage from '@src/pages/auth/RegisterPage/RegisterPage';
import OTPScreen from '@src/pages/auth/OTPScreen/OTPScreen';
import TabNavigator from '@src/navigation/TabNavigator';
import { useAuthStore } from '@src/store/authStore';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
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
    </Stack.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const authToken = useAuthStore((state) => state.authToken);
  // const hasHydrated = useAuthStore((state) => state.hasHydrated);

  // if (!hasHydrated) {
  //   return (
  //     <ActivityIndicator size="large" color="#b7b7edff" style={{ flex: 1 }} />
  //   );
  // }

  return (
    <NavigationContainer>
      {authToken ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
