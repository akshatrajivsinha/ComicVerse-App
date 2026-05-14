import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { colors } from '@src/utils/colors';
import { fonts } from '@src/config/fonts';

interface ThemeColors {
  backgroundDark: string;
  text: string;
  secondaryPurple: string;
  backgroundLight: string;
  primaryBlue: string;
  black: string;
  textDark: string;
}

export const createStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    container: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.57)',
      paddingHorizontal: 12,
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    title: {
      fontSize: 34,
      fontWeight: '800',
      color: themeColors.text,
      fontFamily: fonts.nunitoExtraBold,
    } as TextStyle,
    subtitle: {
      fontSize: 16,
      color: themeColors.text,
      marginBottom: 16,
      marginTop: 8,
      fontFamily: fonts.nunitoBold,
    } as TextStyle,
    buttonContainer: {
      flexDirection: 'row',
      paddingBottom: 16,
      gap: 8,
    },
    socialButtonContainer: {
      flexDirection: 'row',
      paddingBottom: 14,
      gap: 6,
    },
    loginButton: {
      flex: 1,
      height: 48,
      borderRadius: 8,
      backgroundColor: themeColors.backgroundLight,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: themeColors.primaryBlue,
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 8,
    } as ViewStyle,
    registerButton: {
      flex: 1,
      height: 48,
      borderRadius: 8,
      backgroundColor: themeColors.secondaryPurple,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 8,
    } as ViewStyle,
    buttonText: {
      color: themeColors.secondaryPurple,
      fontSize: 16,
      fontWeight: '700',
    } as TextStyle,
    buttonTextRegister: {
      color: themeColors.text,
      fontSize: 16,
      fontWeight: '700',
    } as TextStyle,
    socialButtonTextRegister: {
      color: themeColors.text,
      fontSize: 14,
      fontWeight: '700',
    } as TextStyle,
    socialButtonText: {
      color: themeColors.textDark,
      fontSize: 14,
      fontWeight: '700',
    },
    socialLoginButton: {
      flex: 1,
      height: 75,
      borderRadius: 8,
      backgroundColor: themeColors.textDark,
    } as ViewStyle,
    socialLoginButton2: {
      flex: 1,
      height: 48,
      borderRadius: 8,
      backgroundColor: themeColors.backgroundLight,
    } as ViewStyle,
    containerSocialLoginButton: {
      flexDirection: 'row',
      marginBottom: 14,
      gap: 8,
      height: 48,
    },
    fullScreenLoader: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.72)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      elevation: 10,
    } as ViewStyle,
  });

export const styles = createStyles(colors);
