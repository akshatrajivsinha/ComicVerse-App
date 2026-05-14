import { StyleSheet } from 'react-native';

interface ThemeColors {
  backgroundDark: string;
  textSlate: string;
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
  });
