import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

const HEADER_HEIGHT = height * 0.62;


interface ThemeColors {
  backgroundDark: string;
  textSlate: string;
  text: string;
  teal: string;
  secondaryPurple: string;
  backgroundCard: string;
  border: string;
  black: string;
}

export const styles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.backgroundDark,
    },
    contentContainer: {
      padding: 16,
    },
    title: {
      fontSize: 28,
      color: themeColors.text,
      marginBottom: 8,
    },
    metaText: {
      fontSize: 14,
      color: themeColors.textSlate,
    },
    description: {
      fontSize: 16,
      color: themeColors.textSlate,
      lineHeight: 24,
      marginBottom: 24,
    },
    heroContainer: {
      height: HEADER_HEIGHT,
      position: 'relative',
      overflow: 'hidden',
    },
    heroImage: {
      width: width,
      height: HEADER_HEIGHT,
      position: 'absolute',
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: HEADER_HEIGHT,
    },
    heroContent: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 22,
    },
    metaBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: 'rgba(255,255,255,0.12)',
      marginRight: 10,
    },
    playButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      paddingHorizontal: 24,
      height: 56,
      borderRadius: 30,
      marginRight: 14,
    },
    playButtonText: {
      color: '#000',
      fontSize: 16,
      fontWeight: '800',
      marginLeft: 8,
    },
    sectionTitle: {
      color: '#fff',
      fontSize: 22,
      fontWeight: '800',
      marginBottom: 14,
    },
  });
