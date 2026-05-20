import { useState, useEffect, useCallback } from 'react';
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
import { getUserByDatabaseToken, UserProfile } from '@src/utils/api'; 

export const useSettingsViewModel = () => {
  const { authToken, clearAuthToken } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();
  const themeColors = useColors();
  const { t } = useTranslation();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const dropdownHeight = useSharedValue(0);
  const dropdownOpacity = useSharedValue(0);

  const fetchUserData = useCallback(async () => {
    if (!authToken) return;
    setLoadingProfile(true);
    
    try {
      const result = await getUserByDatabaseToken(authToken);
      if (result.success && result.user) {
        setUserData(result.user);
      }
    } catch (error) {
      console.error('Failed to fetch user data on settings load:', error);
    } finally {
      setLoadingProfile(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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
    setUserData(null);
    try {
      await Promise.allSettled([
        GoogleSignin.signOut(),
        getAuth().signOut(),
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
    userData,
    loadingProfile,
  };
};
