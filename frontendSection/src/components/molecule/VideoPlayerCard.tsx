import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageStyle,
} from 'react-native';
import { colors, useColors } from '@src/utils/colors';
import CustomText from '@src/components/atom/CustomText';
import CircularImageCard from '@src/components/molecule/CircularImageCard';
import VideoPlayer from '@src/components/atom/VideoPlayer';
import { fonts } from '@src/config/fonts';
import { MuteIcon, PauseIcon, PlayIcon, SpeakerIcon } from '@src/assets/icons';

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
            <Image
              source={{ uri: poster }}
              style={styles.poster as ImageStyle}
            />
          ) : (
            <View style={styles.placeholder} />
          )}
          <View style={styles.playButton}>
            <Image
              source={PlayIcon}
              style={styles.controlIcon}
              resizeMode="contain"
            />
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
                <Image
                  source={muted ? MuteIcon : SpeakerIcon}
                  style={styles.controlIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={togglePause}
                style={styles.pauseButton}
              >
                <Image
                  source={isPaused ? PlayIcon : PauseIcon}
                  style={styles.controlIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      {(categoryImage || categoryTitle) && (
        <View style={styles.categoryContainer}>
          {categoryImage && (
            <CircularImageCard imageUri={categoryImage} size={30} />
          )}
          {categoryTitle && (
            <CustomText font={fonts.bebasNeue} style={styles.categoryTitle}>
              {categoryTitle}
            </CustomText>
          )}
        </View>
      )}
    </View>
  );
};

export default VideoPlayerCard;

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    posterContainer: {
      width: '100%',
      height: 168,
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
      left: 30,
      transform: [{ translateX: -25 }, { translateY: -25 }],
      width: 40,
      height: 40,
      borderRadius: 25,
      backgroundColor: 'rgba(92, 87, 87, 1)',
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
      top: 0,
      right: 0,
      width: 30,
      height: 40,
      borderTopRightRadius: 14,
      borderTopLeftRadius: 14,
      backgroundColor: themeColors.background,
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
      width: 30,
      height: 80,
      borderRadius: 26,
      backgroundColor: 'rgba(250, 246, 246, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    pauseButton: {
      position: 'absolute',
      top: 40,
      right: 0,
      width: 30,
      height: 40,
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
    controlIcon: {
      width: 20,
      height: 20,
      tintColor: colors.text,
    },
  });
