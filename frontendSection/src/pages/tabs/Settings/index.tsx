import React from 'react';
import { View, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { fonts } from '@src/config/fonts';
import Header from '@src/components/Header';
import CustomText from '@src/components/CustomText';
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
  } = useSettingsViewModel();
  const dynamicStyles = createStyles(themeColors);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header title={t('settings.title')} fontSize={18} />
      <View style={dynamicStyles.innerContainer}>
        <CustomText font={fonts.nunitoMedium} style={dynamicStyles.subtitle}>{t('settings.subtitle')}</CustomText>
        
        {/* Theme Toggle */}
        <View style={dynamicStyles.settingItem}>
          <CustomText font={fonts.nunitoMedium} style={dynamicStyles.settingLabel}>
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </CustomText>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: themeColors.primaryBlue }}
            thumbColor={theme === 'dark' ? themeColors.secondaryPurple : '#f4f3f4'}
          />
        </View>
        
        {/* Language Selector */}
        <View style={dynamicStyles.languageContainer}>
          <TouchableOpacity 
            style={dynamicStyles.languageButton} 
            onPress={toggleLanguageDropdown}
          >
            <CustomText font={fonts.nunitoMedium} style={dynamicStyles.languageLabel}>
              {t('settings.language')}
            </CustomText>
            <View style={dynamicStyles.selectedLanguage}>
              <CustomText font={fonts.nunitoSemiBold} style={dynamicStyles.selectedLanguageText}>
                {languageOptions.find(opt => opt.code === language)?.nativeName}
              </CustomText>
            </View>
          </TouchableOpacity>
          
          <Animated.View style={[dynamicStyles.languageDropdown, dropdownStyle]}>
            {languageOptions.map((option) => (
              <TouchableOpacity
                key={option.code}
                style={[
                  dynamicStyles.languageOption,
                  option.code === language && dynamicStyles.languageOptionSelected,
                ]}
                onPress={() => handleLanguageChange(option.code)}
              >
                <CustomText
                  font={fonts.nunitoMedium}
                  style={[
                    dynamicStyles.languageOptionText,
                    option.code === language && dynamicStyles.languageOptionTextSelected,
                  ]}
                >
                  {option.nativeName}
                </CustomText>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
        
        <TouchableOpacity style={dynamicStyles.logoutButton} onPress={handleLogout}>
          <CustomText font={fonts.nunitoSemiBold} style={dynamicStyles.logoutButtonText}>{t('common.logout')}</CustomText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;
