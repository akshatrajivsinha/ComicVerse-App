import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '@src/utils/colors';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.62;

const ShowDetailSkeleton = () => {
  const themeColors = useColors();
  const styles = createStyles(themeColors);

  return (
    <View style={styles.container}>
      <View style={styles.heroContainer}>
        <View style={styles.heroImage} />
        <View style={styles.gradient} />
        <View style={styles.backButtonPlaceholder} />
        <View style={styles.heroContent}>
          <View style={styles.title} />
          <View style={styles.metaRow}>
            <View style={styles.metaBadge} />
            <View style={styles.metaBadge} />
            <View style={styles.metaBadge} />
          </View>
          <View style={styles.playButton} />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.sectionTitle} />
        <View style={styles.descriptionLine} />
        <View style={styles.descriptionLine} />
        <View style={styles.descriptionLine} />
        <View style={styles.descriptionLine} />
      </View>

      <View style={styles.sectionSpacer}>
        <View style={styles.sectionTitle} />
        <View style={styles.showsRow}>
          <View style={styles.showCard} />
          <View style={styles.showCard} />
          <View style={styles.showCard} />
        </View>
      </View>

      <View style={styles.sectionSpacer}>
        <View style={styles.sectionTitle} />
        <View style={styles.bannersRow}>
          <View style={styles.bannerCard} />
          <View style={styles.bannerCard} />
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </View>
  );
};

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.backgroundDark,
    },
    heroContainer: {
      height: HEADER_HEIGHT,
      position: 'relative',
      overflow: 'hidden',
    },
    heroImage: {
      width: width,
      height: HEADER_HEIGHT,
      backgroundColor: themeColors.backgroundCard,
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: HEADER_HEIGHT,
      backgroundColor: themeColors.backgroundCard,
      opacity: 0.5,
    },
    backButtonPlaceholder: {
      position: 'absolute',
      top: 10,
      left: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: themeColors.backgroundCard,
    },
    heroContent: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
    },
    title: {
      width: '80%',
      height: 32,
      borderRadius: 8,
      backgroundColor: themeColors.backgroundCard,
      marginBottom: 22,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 22,
    },
    metaBadge: {
      width: 60,
      height: 32,
      borderRadius: 16,
      backgroundColor: themeColors.backgroundCard,
      marginRight: 10,
    },
    playButton: {
      width: 140,
      height: 56,
      borderRadius: 30,
      backgroundColor: themeColors.backgroundCard,
    },
    contentContainer: {
      padding: 16,
    },
    sectionTitle: {
      width: 150,
      height: 24,
      borderRadius: 8,
      backgroundColor: themeColors.backgroundCard,
      marginBottom: 14,
    },
    descriptionLine: {
      width: '100%',
      height: 16,
      borderRadius: 8,
      backgroundColor: themeColors.backgroundCard,
      marginBottom: 8,
    },
    sectionSpacer: {
      paddingHorizontal: 16,
      marginBottom: 24,
    },
    showsRow: {
      flexDirection: 'row',
    },
    showCard: {
      width: 140,
      height: 200,
      borderRadius: 12,
      backgroundColor: themeColors.backgroundCard,
      marginRight: 16,
    },
    bannersRow: {
      flexDirection: 'row',
    },
    bannerCard: {
      width: 280,
      height: 160,
      borderRadius: 12,
      backgroundColor: themeColors.backgroundCard,
      marginRight: 16,
    },
    bottomSpacer: {
      height: 60,
    },
  });

export default ShowDetailSkeleton;
