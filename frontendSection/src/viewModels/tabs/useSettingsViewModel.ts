import { useState } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useColors } from '@src/utils/colors';
import { useAuthStore } from '@src/store/authStore';
import { useThemeStore } from '@src/store/themeStore';
import { useLanguageStore, languageOptions, Language } from '@src/store/languageStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth } from '@react-native-firebase/auth';

export const useSettingsViewModel = () => {
  const { clearAuthToken } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();
  const themeColors = useColors();
  const { t } = useTranslation();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const dropdownHeight = useSharedValue(0);
  const dropdownOpacity = useSharedValue(0);

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
    if (!showLanguageDropdown) {
      dropdownHeight.value = withSpring(languageOptions.length * 60);
      dropdownOpacity.value = withTiming(1);
    } else {
      dropdownHeight.value = withSpring(0);
      dropdownOpacity.value = withTiming(0);
    }
  };

  const dropdownStyle = useAnimatedStyle(() => ({
    height: dropdownHeight.value,
    opacity: dropdownOpacity.value,
  }));

  const handleLanguageChange = (languageCode: Language) => {
    setLanguage(languageCode);
    toggleLanguageDropdown();
  };

  const handleLogout = async() => {
    clearAuthToken();
    try {
  await Promise.allSettled([
    GoogleSignin.signOut(),
    getAuth().signOut(),
    // Promise.resolve(LoginManager.logOut()),
  ]);
} catch {
  return;
}
  };

  return {
    language,
    theme,
    themeColors,
    t,
    showLanguageDropdown,
    toggleLanguageDropdown,
    dropdownStyle,
    handleLanguageChange,
    handleLogout,
    toggleTheme,
    languageOptions,
  };
};
