import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '@src/utils/colors';

interface BannersSkeletonProps {
  itemCount?: number;
}

const BannersSkeleton = ({ itemCount = 3 }: BannersSkeletonProps) => {
  const themeColors = useColors();
  const styles = createStyles(themeColors);

  return (
    <View style={styles.container}>
      <View style={styles.title} />
      <View style={styles.divider} />
      <View style={styles.bannersList}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <View key={index} style={styles.bannerItem}>
            <View style={styles.bannerImage} />
            <View style={styles.bannerContent}>
              <View style={styles.title} />
              <View style={styles.releaseDate} />
              <View style={styles.rating} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    header: {
      marginBottom: 8,
      color: themeColors.text,
    },
    divider: {
      height: 2,
      backgroundColor: themeColors.border,
      marginVertical: 12,
    },
    bannersList: {
      flexDirection: 'row',
    },
    bannerItem: {
      width: 340,
      height: 140,
      borderRadius: 16,
      backgroundColor: themeColors.backgroundCard,
      marginRight: 12,
      overflow: 'hidden',
      position: 'relative',
    },
    bannerImage: {
      width: '100%',
      height: '100%',
      backgroundColor: themeColors.backgroundCard,
      position: 'absolute',
    },
    bannerContent: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      gap: 4,
    },
    title: {
      width: '70%',
      height: 18,
      borderRadius: 9,
      backgroundColor: themeColors.backgroundCard,
    },
    releaseDate: {
      width: '40%',
      height: 12,
      borderRadius: 6,
      backgroundColor: themeColors.backgroundCard,
    },
    rating: {
      width: 50,
      height: 14,
      borderRadius: 7,
      backgroundColor: themeColors.backgroundCard,
    },
  });

export default BannersSkeleton;
