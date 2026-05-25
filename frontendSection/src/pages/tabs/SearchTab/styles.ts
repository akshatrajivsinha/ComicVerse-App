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
    subtitle: {
      fontSize: 16,
      color: themeColors.textSlate,
    },
  });
