import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { useColors } from '@src/utils/colors';
import CustomText from '@src/components/atom/CustomText';
import { fonts } from '@src/config/fonts';

interface VideoPlayerProps {
  videoUri: string | number;
  aspectRatio?: string;
  height?: number;
  width?: number;
  title?: string;
  poster?: string | number;
  categoryImage?: string;
  categoryTitle?: string;
  isMuted?: boolean;
  autoPlay?: boolean;
  repeat?: boolean;
  paused?: boolean;
  controls?: boolean;
}

const VideoPlayer = ({
  videoUri,
  height,
  title,
  autoPlay = true,
  repeat = true,
  isMuted = false,
  paused = false,
  controls = false,
}: VideoPlayerProps) => {
  const themeColors = useColors();
  const styles = createStyles(themeColors, height);

  return (
    <View style={styles.container}>
      <Video
        source={typeof videoUri === 'string' ? { uri: videoUri } : videoUri as any}
        style={styles.video}
        resizeMode="cover"
        muted={isMuted}
        repeat={repeat}
        playWhenInactive={true}
        playInBackground={false}
        controls={controls}
        paused={paused || !autoPlay}
      />
      {title && <CustomText font={fonts.nunitoMedium} style={styles.title}>{title}</CustomText>}
    </View>
  );
};

export default VideoPlayer;

const createStyles = (themeColors: any, height?: number) => {
  
  let calculatedHeight = height;

  return StyleSheet.create({
    container: {
      width: '100%',
      height: calculatedHeight || 200,
      backgroundColor: themeColors.backgroundCard,
      overflow: 'hidden',
      borderWidth: 1
    },
    video: {
      width: '100%',
      height: '100%',
    },
    title: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: '#FFFFFF',
      fontSize: 14,
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
};
