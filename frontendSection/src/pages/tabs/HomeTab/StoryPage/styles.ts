// styles.ts

import { StyleSheet, Dimensions } from 'react-native';


const { width } = Dimensions.get('window');

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

    heroContainer: {
      height: 620,
      overflow: 'hidden',
    },

    heroImage: {
      width,
      height: 620,
      position: 'absolute',
    },

    gradient: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },

    heroContent: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 10,
    },

    title: {
      color: '#fff',
      fontSize: 34,
      fontWeight: '900',
      lineHeight: 42,
    },

    infoText: {
      color: 'rgba(255,255,255,0.75)',
      fontSize: 14,
      marginTop: 10,
      lineHeight: 22,
      fontWeight: '600',
    },

    authorText: {
      color: 'rgba(255,255,255,0.55)',
      fontSize: 13,
      marginTop: 6,
    },

    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 18,
    },

    metaBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.28)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 100,
      marginRight: 10,
      marginBottom: 10,
    },

    metaText: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '700',
    },

    contentContainer: {
      paddingHorizontal: 12,
      paddingVertical: 24,
    },

    sectionTitle: {
      color: '#fff',
      fontSize: 24,
      fontWeight: '800',
      marginBottom: 14,
    },

    description: {
      color: 'rgba(255,255,255,0.72)',
      fontSize: 16,
      lineHeight: 28,
    },

    bottomSpace: {
      height: 60,
    },
  });