import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '@src/utils/colors';

interface CategorySkeletonProps {
  itemCount?: number;
}

const CategorySkeleton = ({ itemCount = 5 }: CategorySkeletonProps) => {
  const themeColors = useColors();
  const styles = createStyles(themeColors);

  return (
    <View style={styles.container}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <View key={index} style={styles.categoryItem} />
      ))}
    </View>
  );
};

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: 12,
    },
    categoryItem: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: themeColors.backgroundCard,
      marginRight: 12,
    },
  });

export default CategorySkeleton;
