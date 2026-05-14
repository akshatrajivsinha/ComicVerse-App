import React from 'react';
import { View, StyleSheet, Image, ViewStyle, TouchableOpacity } from 'react-native';
import { useColors } from '@src/utils/colors';
import CustomText from '@src/components/atom/CustomText';
import { fonts } from '@src/config/fonts';

interface ShowCardsProps {
  poster: string | number;
  title: string;
  height?: number;
  width?: number;
  containerStyle? : ViewStyle;
  onPress?: () => void;
}

const ShowCards = ({
  poster,
  title,
  height = 170,
  width = 260,
  containerStyle,
  onPress
}: ShowCardsProps) => {
  const themeColors = useColors();
  const styles = createStyles(themeColors, height, width);

  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContainer}>
        <Image source={typeof poster === 'string' ? { uri: poster } : poster} style={styles.image} />
        <View style={styles.gradientOverlay} />
        <View style={styles.iconOverlay}>
          <View style={styles.iconCircle}>
            <View style={styles.playIcon} />
          </View>
        </View>
      </View>
      <CustomText font={fonts.bebasNeue} style={styles.title}>
        {title}
      </CustomText>
    </TouchableOpacity>
  );
};

const createStyles = (themeColors: any, height: number, width:number) =>
  StyleSheet.create({
    container: {
      width: width,
      height: height
    },
    cardContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
      backgroundColor: themeColors.backgroundCard,
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    gradientOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    iconOverlay: {
      position: 'absolute',
      bottom: 8,
      left: 8
    },
    iconCircle: {
      width: 28,
      height: 28,
      borderRadius: 24,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    playIcon: {
      width: 0,
      height: 0,
      borderLeftWidth: 8,
      borderLeftColor: '#FFFFFF',
      borderTopWidth: 4,
      borderTopColor: 'transparent',
      borderBottomWidth: 4,
      borderBottomColor: 'transparent',
      marginLeft: 4,
    },
    title: {
      fontSize: 16,
      color: themeColors.text,
      marginTop: 8,
      paddingHorizontal: 4,
    },
  });

export default ShowCards;
