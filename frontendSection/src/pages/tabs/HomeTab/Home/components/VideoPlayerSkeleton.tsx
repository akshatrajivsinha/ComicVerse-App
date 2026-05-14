import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '@src/utils/colors';

const VideoPlayerSkeleton = () => {
  const themeColors = useColors();
  const styles = createStyles(themeColors);

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer} />
      <View style={styles.categoryContainer}>
        <View style={styles.categoryImage} />
        <View style={styles.categoryTitle} />
      </View>
    </View>
  );
};

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    videoContainer: {
      width: '100%',
      height: 189,
      borderRadius: 12,
      backgroundColor: themeColors.backgroundCard,
      marginBottom: 12,
    },
    categoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    categoryImage: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: themeColors.backgroundCard,
      marginRight: 8,
    },
    categoryTitle: {
      width: 200,
      height: 16,
      borderRadius: 8,
      backgroundColor: themeColors.backgroundCard,
    },
  });

export default VideoPlayerSkeleton;
