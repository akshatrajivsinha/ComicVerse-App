import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '@src/utils/colors';

interface ShowsSkeletonProps {
  itemCount?: number;
}

const ShowsSkeleton = ({ itemCount = 4 }: ShowsSkeletonProps) => {
  const themeColors = useColors();
  const styles = createStyles(themeColors);

  return (
    <View style={styles.container}>
      <View style={styles.showTitle} />
      <View style={styles.divider} />
      <View style={styles.showsList}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <View key={index} style={styles.showItem}>
            <View style={styles.showImage} />
            <View style={styles.showTitle} />
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
    showsList: {
      flexDirection: 'row',
    },
    showItem: {
      marginRight: 12,
    },
    showImage: {
      width: 120,
      height: 180,
      borderRadius: 12,
      backgroundColor: themeColors.backgroundCard,
      marginBottom: 8,
    },
    showTitle: {
      width: 100,
      height: 16,
      borderRadius: 8,
      backgroundColor: themeColors.backgroundCard,
    },
  });

export default ShowsSkeleton;
