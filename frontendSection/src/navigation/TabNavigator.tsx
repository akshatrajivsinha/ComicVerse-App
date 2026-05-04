import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import HomeScreen from '@src/pages/tabs/HomeScreen';
import SearchScreen from '@src/pages/tabs/SearchScreen';
import ShowsScreen from '@src/pages/tabs/ShowsScreen';
import SettingScreen from '@src/pages/tabs/SettingScreen';
import ShopScreen from '@src/pages/tabs/ShopScreen';
import { colors } from '@src/utils/colors';

const Tab = createBottomTabNavigator();

const AnimatedTabIcon = ({ focused, icon }: { focused: boolean; icon: any }) => {
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
        tintColor={focused ? colors.secondaryPurple : colors.black}
      />
    </Animated.View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.text,
          borderTopColor: colors.border,
          height: 72,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: colors.secondaryPurple,
        tabBarInactiveTintColor: colors.black,
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
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} icon={require('@src/assets/icons/homeLogo.png')} />
          ),
        }}
      />
      <Tab.Screen
        name="Shows"
        component={ShowsScreen}
        options={{
          tabBarLabel: 'Shows',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} icon={require('@src/assets/icons/videoLogo.png')} />
          ),
        }}
      />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ focused }) => (
              <AnimatedTabIcon focused={focused} icon={require('@src/assets/icons/searchLogo.png')} />
            ),
          }}
        />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} icon={require('@src/assets/icons/shoppingLogo.png')} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} icon={require('@src/assets/icons/settingLogo.png')} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
