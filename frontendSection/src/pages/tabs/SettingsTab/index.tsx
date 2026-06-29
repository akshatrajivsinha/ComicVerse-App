import React from 'react';
import {
  View,
  TouchableOpacity,
  Switch,
  ImageBackground,
  ScrollView,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { fonts } from '@src/config/fonts';
import CustomText from '@src/components/atom/CustomText';
import { EditIcon } from '@src/assets/icons';
import { useSettingsViewModel } from '@src/viewModels/tabs/useSettingsViewModel';
import { createStyles } from './styles';

const SettingScreen = () => {
  const {
    language,
    theme,
    themeColors,
    t,
    toggleLanguageDropdown,
    dropdownStyle,
    handleLanguageChange,
    handleLogout,
    toggleTheme,
    languageOptions,
    userData,
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
  } = useSettingsViewModel();

  const dynamicStyles = createStyles(themeColors);

  return (
    <View style={dynamicStyles.screenContainer}>
      <ImageBackground
        source={{ uri: coverImageUrl }}
        style={dynamicStyles.headerBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)']}
          style={dynamicStyles.gradientOverlay}
        >
          <SafeAreaView edges={['top']} style={dynamicStyles.headerOverlay}>
            <View style={dynamicStyles.topNavRow}>
              <CustomText
                font={fonts.nunitoBold}
                style={dynamicStyles.headerTitleText}
              >
                {t('settings.title')}
              </CustomText>
              <TouchableOpacity
                style={dynamicStyles.topEditButton}
                onPress={openEditModal}
              >
                <Image
                  source={EditIcon}
                  style={{ height: 16, width: 16 }}
                  resizeMode="contain"
                  // tintColor={'white'}
                />
              </TouchableOpacity>
            </View>

            <View style={dynamicStyles.profileRowContainer}>
              <Image
                source={{ uri: profileImageUrl }}
                style={dynamicStyles.inlineAvatar}
              />
              <View style={dynamicStyles.profileTextWrapper}>
                <CustomText
                  font={fonts.nunitoBold}
                  style={dynamicStyles.profileName}
                >
                  {userData?.profileName || t('settings.profileName')}
                </CustomText>
                <CustomText
                  font={fonts.nunitoBold}
                  style={dynamicStyles.profileEmail}
                >
                  {userData?.email || ''}
                </CustomText>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>

      <View style={dynamicStyles.optionsContainer}>
        <ScrollView
          contentContainerStyle={dynamicStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Language Selector Row */}
          <View style={dynamicStyles.settingColumn}>
            <TouchableOpacity
              style={dynamicStyles.settingRowNoPadding}
              onPress={toggleLanguageDropdown}
            >
              <View
                style={[
                  dynamicStyles.iconWrapper,
                  { backgroundColor: '#FEF7E0' },
                ]}
              >
                <CustomText style={{ color: '#B06000' }}>💬</CustomText>
              </View>
              <CustomText
                font={fonts.nunitoMedium}
                style={dynamicStyles.rowLabel}
              >
                {t('settings.language')}
              </CustomText>
              <CustomText
                font={fonts.nunitoBold}
                style={dynamicStyles.rightValueText}
              >
                {languageOptions.find(opt => opt.code === language)
                  ?.nativeName || 'English'}
              </CustomText>
            </TouchableOpacity>

            <Animated.View
              style={[dynamicStyles.languageDropdown, dropdownStyle]}
            >
              {languageOptions.map(option => (
                <TouchableOpacity
                  key={option.code}
                  style={dynamicStyles.languageOptionRow}
                  onPress={() => handleLanguageChange(option.code)}
                >
                  <View style={dynamicStyles.languageOptionLeft}>
                    <CustomText
                      font={fonts.nunitoMedium}
                      style={dynamicStyles.dropdownOptionText}
                    >
                      {option.nativeName}
                    </CustomText>
                    <CustomText
                      font={fonts.nunitoBold}
                      style={dynamicStyles.dropdownOptionSubtext}
                    >
                      {option.code === 'en'
                        ? 'English'
                        : option.code === 'hi'
                        ? 'Hindi'
                        : 'Malayalam'}
                    </CustomText>
                  </View>
                  <View
                    style={[
                      dynamicStyles.radioCircle,
                      option.code === language &&
                        dynamicStyles.radioCircleActive,
                    ]}
                  >
                    {option.code === language && (
                      <View style={dynamicStyles.radioCircleInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </View>

          <View style={dynamicStyles.divider} />

          {/* Dark Mode Switch Row */}
          <View style={dynamicStyles.settingRow}>
            <View
              style={[
                dynamicStyles.iconWrapper,
                { backgroundColor: '#F1F3F4' },
              ]}
            >
              <CustomText style={{ color: '#3C4043' }}>🌙</CustomText>
            </View>
            <CustomText
              font={fonts.nunitoMedium}
              style={dynamicStyles.rowLabel}
            >
              {t('settings.darkMode')}
            </CustomText>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{
                false: '#D1D1D6',
                true: themeColors.primaryBlue || '#34C759',
              }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          <View style={dynamicStyles.divider} />

          {/* Logout Row */}
          <TouchableOpacity
            style={dynamicStyles.settingRow}
            onPress={openLogoutModal}
          >
            <View
              style={[
                dynamicStyles.iconWrapper,
                { backgroundColor: '#FCE8E6' },
              ]}
            >
              <CustomText style={{ color: '#D93025' }}>🛑</CustomText>
            </View>
            <CustomText
              font={fonts.nunitoMedium}
              style={dynamicStyles.rowLabel}
            >
              {t('common.logout')}
            </CustomText>
            <CustomText
              font={fonts.nunitoBold}
              style={dynamicStyles.logoutSideText}
            >
              {t('settings.signOut')}
            </CustomText>
          </TouchableOpacity>
          <CustomText
            font={fonts.nunitoLight}
            style={{
              alignSelf: 'center',
              fontSize: 12,
              paddingVertical: 20,
              color: themeColors.text,
            }}
          >
            {t('settings.version')}
          </CustomText>
        </ScrollView>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeEditModal}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContainer}>
            <View style={dynamicStyles.modalHandle} />

            <CustomText
              font={fonts.nunitoExtraBold}
              style={dynamicStyles.modalTitle}
            >
              {t('settings.editProfile')}
            </CustomText>

            {/* Cover Image */}
            <CustomText
              font={fonts.nunitoSemiBold}
              style={dynamicStyles.modalSectionLabel}
            >
              {t('settings.coverImage')}
            </CustomText>
            <View style={dynamicStyles.modalImageRow}>
              <Image
                source={{ uri: tempCoverImage || coverImageUrl }}
                style={dynamicStyles.modalCoverPreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={dynamicStyles.modalPickButton}
                onPress={pickCoverImage}
              >
                <CustomText
                  font={fonts.nunitoBold}
                  style={dynamicStyles.modalPickButtonText}
                >
                  {t('settings.change')}
                </CustomText>
              </TouchableOpacity>
            </View>

            {/* Profile Image */}
            <CustomText
              font={fonts.nunitoSemiBold}
              style={dynamicStyles.modalSectionLabel}
            >
              {t('settings.profileImage')}
            </CustomText>
            <View style={dynamicStyles.modalImageRow}>
              <Image
                source={{ uri: tempProfileImage || profileImageUrl }}
                style={dynamicStyles.modalAvatarPreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={dynamicStyles.modalPickButton}
                onPress={pickProfileImage}
              >
                <CustomText
                  font={fonts.nunitoBold}
                  style={dynamicStyles.modalPickButtonText}
                >
                  {t('settings.change')}
                </CustomText>
              </TouchableOpacity>
            </View>

            {/* Name */}
            <CustomText
              font={fonts.nunitoSemiBold}
              style={dynamicStyles.modalSectionLabel}
            >
              {t('settings.profileName')}
            </CustomText>
            <TextInput
              style={dynamicStyles.modalInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder={t('settings.enterName')}
              placeholderTextColor={themeColors.textSlate}
            />

            {/* Buttons */}
            <View style={dynamicStyles.modalButtonRow}>
              <TouchableOpacity
                style={dynamicStyles.modalCancelButton}
                onPress={closeEditModal}
              >
                <CustomText
                  font={fonts.nunitoBold}
                  style={dynamicStyles.modalCancelText}
                >
                  {t('common.cancel')}
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={dynamicStyles.modalSaveButton}
                onPress={saveProfileChanges}
              >
                <CustomText
                  font={fonts.nunitoExtraBold}
                  style={dynamicStyles.modalSaveText}
                >
                  {t('common.save')}
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeLogoutModal}
      >
        <View style={dynamicStyles.logoutOverlay}>
          <View style={dynamicStyles.logoutContainer}>
            <View style={dynamicStyles.logoutIconRow}>
              <View style={dynamicStyles.logoutIconCircle}>
                <CustomText style={dynamicStyles.logoutIcon}>🛑</CustomText>
              </View>
            </View>

            <CustomText
              font={fonts.nunitoExtraBold}
              style={dynamicStyles.logoutTitle}
            >
              {t('settings.logoutTitle')}
            </CustomText>

            <CustomText
              font={fonts.nunitoMedium}
              style={dynamicStyles.logoutMessage}
            >
              {t('settings.logoutMessage')}
            </CustomText>

            <View style={dynamicStyles.logoutButtonRow}>
              <TouchableOpacity
                style={dynamicStyles.logoutCancelButton}
                onPress={closeLogoutModal}
              >
                <CustomText
                  font={fonts.nunitoBold}
                  style={dynamicStyles.logoutCancelText}
                >
                  {t('common.cancel')}
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={dynamicStyles.logoutConfirmButton}
                onPress={handleLogout}
              >
                <CustomText
                  font={fonts.nunitoExtraBold}
                  style={dynamicStyles.logoutConfirmText}
                >
                  {t('common.logout')}
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingScreen;
