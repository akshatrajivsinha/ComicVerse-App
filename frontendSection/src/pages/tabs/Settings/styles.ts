import { StyleSheet } from 'react-native';

interface ThemeColors {
  backgroundDark: string;
  textSlate: string;
  text: string;
  backgroundCard: string;
  border: string;
  primaryBlue: string;
}

export const createStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.backgroundDark,
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    subtitle: {
      fontSize: 16,
      color: themeColors.textSlate,
    },
    settingItem: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      marginTop: 20,
      borderWidth: 1,
      backgroundColor: themeColors.backgroundCard,
      borderColor: themeColors.border,
    },
    settingLabel: {
      fontSize: 16,
      color: themeColors.text,
    },
    languageContainer: {
      width: '100%',
      marginTop: 20,
    },
    languageButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: themeColors.backgroundCard,
      borderColor: themeColors.border,
    },
    languageLabel: {
      fontSize: 16,
      color: themeColors.text,
    },
    selectedLanguage: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: themeColors.primaryBlue,
    },
    selectedLanguageText: {
      color: '#FFFFFF',
      fontSize: 14,
    },
    languageDropdown: {
      borderRadius: 12,
      marginTop: 8,
      borderWidth: 1,
      overflow: 'hidden',
      backgroundColor: themeColors.backgroundCard,
      borderColor: themeColors.border,
    },
    languageOption: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
    languageOptionSelected: {
      backgroundColor: themeColors.primaryBlue + '20',
    },
    languageOptionText: {
      fontSize: 16,
      color: themeColors.text,
    },
    languageOptionTextSelected: {
      color: '#6C63FF',
      fontWeight: '600',
    },
    logoutButton: {
      marginTop: 24,
      backgroundColor: '#FF3B30',
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 8,
    },
    logoutButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });
