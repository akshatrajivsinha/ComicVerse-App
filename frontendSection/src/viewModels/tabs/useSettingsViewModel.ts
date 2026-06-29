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
import {
  getUserByDatabaseToken,
  setUserProfile,
  UserProfile,
} from '@src/utils/api';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

export const useSettingsViewModel = () => {
  const { authToken, clearAuthToken } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();
  const themeColors = useColors();
  const { t } = useTranslation();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [coverImage, setCoverImage] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempCoverImage, setTempCoverImage] = useState('');
  const [tempProfileImage, setTempProfileImage] = useState('');

  const dropdownHeight = useSharedValue(0);
  const dropdownOpacity = useSharedValue(0);

  const fetchUserData = useCallback(async () => {
    if (!authToken) return;
    setLoadingProfile(true);

    try {
      const result = await getUserByDatabaseToken(authToken);
      if (result.success && result.user) {
        setUserData(result.user);
        setCoverImage(result.user.coverImage || '');
        setProfileImage(result.user.profileImage || '');
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

  const handleLogout = async () => {
    setLogoutModalVisible(false);
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

  const openEditModal = () => {
    setTempName(userData?.profileName || '');
    setTempCoverImage(coverImage);
    setTempProfileImage(profileImage || userData?.profileImage || '');
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
  };

  const openLogoutModal = () => setLogoutModalVisible(true);
  const closeLogoutModal = () => setLogoutModalVisible(false);

  const pickImage = (callback: (dataUrl: string) => void) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: true,
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.6,
      },
      (response) => {
        if (response.didCancel || response.errorCode) return;
        const asset: Asset | undefined = response.assets?.[0];
        if (asset?.base64 && asset?.type) {
          callback(`data:${asset.type};base64,${asset.base64}`);
        }
      },
    );
  };

  const pickCoverImage = () => {
    pickImage((uri) => setTempCoverImage(uri));
  };

  const pickProfileImage = () => {
    pickImage((uri) => setTempProfileImage(uri));
  };

  const saveProfileChanges = async () => {
    if (!authToken) return;
    setSavingProfile(true);

    const updatedName = tempName || userData?.profileName || '';
    const updatedCoverImage = tempCoverImage || coverImage || '';
    const updatedProfileImage = tempProfileImage || profileImage || userData?.profileImage || '';

    try {
      const saveResult = await setUserProfile(authToken, {
        profileName: updatedName,
        coverImage: updatedCoverImage,
        profileImage: updatedProfileImage,
      });
      console.log("saveResult", saveResult)
      if (saveResult?.success) {
        console.log("Succes",saveResult.user)
        const apiUser = saveResult.user;
        setUserData(apiUser || null);
        setCoverImage(apiUser?.coverImage || updatedCoverImage);
        setProfileImage(apiUser?.profileImage || updatedProfileImage);
      }
      setEditModalVisible(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSavingProfile(false);
    }
  };

  const profileImageUrl =
    profileImage || userData?.profileImage || 'https://jkfenner.com/wp-content/uploads/2019/11/default.jpg';

  const coverImageUrl =
    coverImage || 'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=1200';

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
    savingProfile,
    profileImageUrl,
    coverImageUrl,
    editModalVisible,
    logoutModalVisible,
    tempName,
    setTempName,
    tempCoverImage,
    tempProfileImage,
    openEditModal,
    closeEditModal,
    openLogoutModal,
    closeLogoutModal,
    pickCoverImage,
    pickProfileImage,
    saveProfileChanges,
  };
};
