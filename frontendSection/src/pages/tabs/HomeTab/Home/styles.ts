import { StyleSheet } from 'react-native';

interface ThemeColors {
  backgroundDark: string;
  textSlate: string;
  text: string;
  teal: string;
  backgroundLight: string;
  backgroundCard: string;
}

export const createStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.backgroundDark
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    scrollViewContainer: {
      flexGrow:1,
      gap: 14,
      marginTop:8,
      paddingBottom:25
    },
    addressContainer: {
      width: '60%',
      paddingHorizontal: 12,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    addressLabel: {
      color: themeColors.textSlate,
      fontSize: 2,
    },
    addressText: {
      color: themeColors.text,
      fontSize: 12,
      lineHeight: 14,
    },
    mapMarkerIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
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
    showCardTextStory:{
      color: themeColors.backgroundLight,
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
