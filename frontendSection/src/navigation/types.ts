import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  MainStack: NavigatorScreenParams<MainStackParamList>;
};

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
  OTP: { phoneNumber?: string; email?: string; };
};

export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  ShowDetail: { slug?: string; };
};

export type TabParamList = {
  Home: undefined;
  Shows: undefined;
  Search: undefined;
  Shop: undefined;
  Setting: undefined;
};

export type AuthStackNavigationProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type MainStackNavigationProps<T extends keyof MainStackParamList> = NativeStackScreenProps<
  MainStackParamList,
  T
>;

export type TabNavigationProps<T extends keyof TabParamList> = BottomTabScreenProps<
  TabParamList,
  T
>;

export type ShowDetailNavigationProps = NativeStackScreenProps<
  MainStackParamList,
  'ShowDetail'
>;

