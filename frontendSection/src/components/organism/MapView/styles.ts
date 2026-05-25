// styles.ts

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
    page: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    container2: {
      height: '100%',
      width: '100%',
    },
    map: {
      flex: 1,
    },
    floatingControlsRow: {
      position: 'absolute',
      top: 15,
      right: 15,
      flexDirection: 'row',
      zIndex: 100,
    },
    floatingBackButton: {
      position: 'absolute',
      top: "1%",
      left: '0%',
      zIndex: 100,
    },
    animatedSearchContainer: {
      overflow: 'hidden',
    },
    animatedRouteContainer: {
      overflow: 'hidden',
      marginRight: 10,
    },
    buttonToggleStack: {
      flexDirection: 'column',
      alignSelf: 'flex-start',
      gap: 10,
    },
    searchToggleButton: {
      backgroundColor: '#007AFF',
      alignSelf: 'flex-start',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 25,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    routeFieldsCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 14,
      padding: 10,
      gap: 8,
      elevation: 4,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      height: '100%',
    },
    routeInputReadOnly: {
      backgroundColor: '#F5F5F5',
      borderRadius: 8,
      paddingHorizontal: 10,
      height: 36,
      fontSize: 13,
      color: '#333',
    },
    routeSubmitBtn: {
      backgroundColor: '#007AFF',
      borderRadius: 8,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    routeSubmitBtnText: {
      color: '#FFF',
      fontWeight: '600',
      fontSize: 13,
    },
    bottomActionsContainer: {
      position: 'absolute',
      top: 170,
      right: 15,
      alignItems: 'center',
      gap: 10,
    },
    recenterButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 25,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    clearMapButton: {
      backgroundColor: '#c30f06ff',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 25,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    icon: {
      height: 20,
      width: 20,
    },
    searchIcon: {
      height: 18,
      width: 18,
    },
    locationCard: {
      position: 'absolute',
      bottom: 10,
      left: 10,
      right: 10,
      backgroundColor: themeColors.backgroundDark,
      borderRadius: 16,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 5,
    },
    locationIcon: {
      width: 22,
      height: 22,
      marginRight: 12,
    },
    locationTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: themeColors.text,
      marginBottom: 4,
    },
    locationAddress: {
      fontSize: 13,
      color: themeColors.text,
      lineHeight: 18,
      width: '65%',
    },
    durationBadgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    durationTextTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: themeColors.text,
    },
    durationTimeVal: {
      fontSize: 18,
      fontWeight: '800',
      color: '#34C759',
    },
    routeInputWritable: {
      backgroundColor: '#F5F5F5',
      borderRadius: 8,
      paddingHorizontal: 10,
      height: 40,
      fontSize: 13,
      color: '#111111',
    },
  });
