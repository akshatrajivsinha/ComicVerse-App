import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '@src/utils/colors';
import CustomText from '@src/components/CustomText';
import CircularImageCard from './CircularImageCard';
import VideoPlayer from '@src/components/VideoPlayer';
import { fonts } from '@src/config/fonts';

interface VideoPlayerCardProps {
  videoUri: string | number;
  aspectRatio?: string;
  height?: number;
  width?: number;
  categoryImage?: string;
  categoryTitle?: string;
  isMuted?: boolean;
  autoPlay?: boolean;
  repeat?: boolean;
}

const VideoPlayerCard = ({
  videoUri,
  aspectRatio = '16:9',
  height,
  width,
  categoryImage,
  categoryTitle,
  isMuted = false,
  autoPlay = true,
  repeat = true,
}: VideoPlayerCardProps) => {
  const themeColors = useColors();
  const styles = createStyles(themeColors);

  return (
    <View style={styles.container}>
      <VideoPlayer
        videoUri={videoUri}
        aspectRatio={aspectRatio}
        height={height}
        width={width}
        isMuted={isMuted}
        autoPlay={autoPlay}
        repeat={repeat}
      />
      {(categoryImage || categoryTitle) && (
        <View style={styles.categoryContainer}>
          {categoryImage && <CircularImageCard imageUri={categoryImage} size={30} />}
          {categoryTitle && <CustomText font={fonts.bebasNeue} style={styles.categoryTitle}>{categoryTitle}</CustomText>}
        </View>
      )}
    </View>
  );
};

export default VideoPlayerCard;

const createStyles = (themeColors: any) => StyleSheet.create({
  container: {
    width: '100%',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  categoryTitle: {
    paddingHorizontal: 8,
    color: themeColors.text,
    fontSize: 16,
  },
});
