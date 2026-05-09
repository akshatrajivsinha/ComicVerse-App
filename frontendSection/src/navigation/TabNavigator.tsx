import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useColors } from '@src/utils/colors';
import HomeScreen from '@src/pages/tabs/Home';
import SearchScreen from '@src/pages/tabs/Search';
import ShowsScreen from '@src/pages/tabs/Shows';
import SettingScreen from '@src/pages/tabs/Settings';
import ShopScreen from '@src/pages/tabs/Shop';

const Tab = createBottomTabNavigator();

const AnimatedTabIcon = ({
  focused,
  icon,
  themeColors,
}: {
  focused: boolean;
  icon: any;
  themeColors: any;
}) => {
  const scale = useSharedValue(focused ? 1.2 : 1);
  const opacity = useSharedValue(focused ? 1 : 0.5);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
    opacity: withTiming(opacity.value, { duration: 200 }),
  }));

  React.useEffect(() => {
    scale.value = focused ? 1.2 : 1;
    opacity.value = focused ? 1 : 0.7;
  });

  return (
    <Animated.View style={animatedStyle}>
      <Image
        source={icon}
        style={{ width: 20, height: 22 }}
        resizeMode="contain"
        tintColor={focused ? themeColors.secondaryPurple : themeColors.black}
      />
    </Animated.View>
  );
};

const TabNavigator = () => {
  const { t } = useTranslation();
  const themeColors = useColors();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: themeColors.backgroundCard,
          borderTopColor: themeColors.border,
          height: 72,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: themeColors.secondaryPurple,
        tabBarInactiveTintColor: themeColors.black,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('tabs.home'),
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              focused={focused}
              icon={require('@src/assets/icons/homeLogo.png')}
              themeColors={themeColors}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Shows"
        component={ShowsScreen}
        options={{
          tabBarLabel: t('tabs.shows'),
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              focused={focused}
              icon={require('@src/assets/icons/videoLogo.png')}
              themeColors={themeColors}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: t('tabs.search'),
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              focused={focused}
              icon={require('@src/assets/icons/searchLogo.png')}
              themeColors={themeColors}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          tabBarLabel: t('tabs.shop'),
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              focused={focused}
              icon={require('@src/assets/icons/shoppingLogo.png')}
              themeColors={themeColors}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              focused={focused}
              icon={require('@src/assets/icons/settingLogo.png')}
              themeColors={themeColors}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
