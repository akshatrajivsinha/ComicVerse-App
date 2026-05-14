import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ImageStyle } from 'react-native';
import { useColors } from '@src/utils/colors';
import CustomText from '@src/components/atom/CustomText';
import CircularImageCard from '@src/components/molecule/CircularImageCard';
import VideoPlayer from '@src/components/atom/VideoPlayer';
import { fonts } from '@src/config/fonts';

interface VideoPlayerCardProps {
  videoUri: string | number;
  aspectRatio?: string;
  height?: number;
  width?: number;
  categoryImage?: string;
  categoryTitle?: string;
  poster?: string;
  isMuted?: boolean;
  autoPlay?: boolean;
  repeat?: boolean;
  controlsMode?: 'default' | 'custom';
}

const VideoPlayerCard = ({
  videoUri,
  aspectRatio = '16:9',
  height,
  width,
  categoryImage,
  categoryTitle,
  poster,
  isMuted = false,
  repeat = true,
  controlsMode = 'custom',
}: VideoPlayerCardProps) => {
  const themeColors = useColors();
  const styles = createStyles(themeColors);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [muted, setMuted] = useState(isMuted);

  const handlePlay = () => {
    setIsPlaying(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <View style={styles.container}>
      {!isPlaying ? (
        <TouchableOpacity onPress={handlePlay} style={styles.posterContainer}>
          {poster ? (
            <Image source={{ uri: poster }} style={styles.poster as ImageStyle} />
          ) : (
            <View style={styles.placeholder} />
          )}
          <View style={styles.playButton}>
            <CustomText style={styles.playIcon}> ▶</CustomText>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.videoContainer}>
          <VideoPlayer
            videoUri={videoUri}
            aspectRatio={aspectRatio}
            height={height}
            width={width}
            isMuted={muted}
            autoPlay={true}
            repeat={repeat}
            paused={isPaused}
            controls={controlsMode === 'default'}
          />
          {controlsMode === 'custom' && (
            <View style={styles.customControls}>

              <TouchableOpacity onPress={toggleMute} style={styles.muteButton}>
                <CustomText style={styles.muteIcon}>{muted ? '🔇' : '🔊'}</CustomText>
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePause} style={styles.pauseButton}>
                <CustomText style={styles.pauseIcon}>{isPaused ? ' ▶' : '⏸'}</CustomText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
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
  posterContainer: {
    width: '100%',
    height: 189,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: themeColors.backgroundCard,
  },
  playButton: {
    position: 'absolute',
    bottom: -10,
    left: 40,
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: 'rgba(239, 233, 233, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    
  },
  videoContainer: {
    width: '100%',
    position: 'relative',
  },
  muteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteIcon: {
    fontSize: 18,
  },
  customControls: {
    position: 'absolute',
    top: 2,
    right: 8,
  },
  pauseButton: {
    position: 'absolute',
    top: 50,
    right: 6,
    width: 30,
    height: 30,
    borderRadius: 26,
    backgroundColor: 'rgba(250, 246, 246, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseIcon: {
    fontSize: 18,
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
