import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '@src/utils/colors';

interface StoriesSkeletonProps {
  itemCount?: number;
}

const StoriesSkeleton = ({ itemCount = 2 }: StoriesSkeletonProps) => {
  const themeColors = useColors();
  const styles = createStyles(themeColors);

  return (
    <View style={styles.container}>
      <View style={styles.categoryText} />
      <View style={styles.divider} />
      {Array.from({ length: itemCount }).map((_, index) => (
        <View key={index} style={styles.storyItem}>
          <View style={styles.storyImage} />
          <View style={styles.storyContent}>
            <View style={styles.smallImage} />
            <View style={styles.textLines}>
              <View style={styles.categoryText} />
              <View style={styles.titleText} />
            </View>
          </View>
        </View>
      ))}
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
    storyItem: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    storyImage: {
      width: 100,
      height: 100,
      borderRadius: 12,
      backgroundColor: themeColors.backgroundCard,
      marginRight: 12,
    },
    storyContent: {
      flex: 1,
      justifyContent: 'center',
    },
    smallImage: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: themeColors.backgroundCard,
      marginBottom: 8,
    },
    textLines: {
      gap: 6,
    },
    categoryText: {
      width: 60,
      height: 14,
      borderRadius: 7,
      backgroundColor: themeColors.backgroundCard,
    },
    titleText: {
      width: '80%',
      height: 16,
      borderRadius: 8,
      backgroundColor: themeColors.backgroundCard,
    },
  });

export default StoriesSkeleton;
