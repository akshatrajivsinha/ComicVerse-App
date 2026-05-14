import { StyleSheet } from 'react-native';

interface ThemeColors {
  backgroundDark: string;
  textSlate: string;
  text: string;
  teal: string;
}

export const createStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.backgroundDark
    },
    scrollViewContainer: {
      flexGrow:1,
      gap: 14,
      marginTop:18,
      paddingBottom:25
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
    showCardText: {
      color: themeColors.text,
      marginBottom: 4,
      marginLeft: 12,
      fontSize: 22,
    },
    categoryFlatList: {
      paddingHorizontal: 8,
    },
    videoTitle: {
      paddingHorizontal: 8,
      color: themeColors.text,
      fontSize: 16,
    },
    containerStyle: {
      marginRight: 12,
    },
    storyCardContainer: {
      marginBottom: 12,
    },
    storyListContainer: {
      paddingHorizontal: 12,
    },
    divider: {
      height: 2,
      backgroundColor: themeColors.text,
      opacity: 0.4,
      marginLeft: 12,
      marginRight: 12,
      marginBottom: 12,
    },
    backgroundView:{
      backgroundColor: themeColors.teal,
      paddingVertical: 12
    },
    bannerCardContainer: {
      marginRight: 12,
      borderRadius: 12
    },
    bannerListContainer: {
      paddingHorizontal: 8,
    },
  });
