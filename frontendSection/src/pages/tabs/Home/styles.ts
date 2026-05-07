import { StyleSheet } from 'react-native';

interface ThemeColors {
  backgroundDark: string;
  textSlate: string;
  text: string;
}

export const createStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.backgroundDark,
      gap: 18,
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
    videoContainer: {
    },
    categoriesContainer: {
    },
    categoryFlatList: {
      paddingHorizontal: 8,
    },
    videoTitle:{
      paddingHorizontal:8,
      color: themeColors.text,
      fontSize: 16
    }
  });
