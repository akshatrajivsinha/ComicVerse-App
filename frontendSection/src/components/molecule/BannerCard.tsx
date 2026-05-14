import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ImageStyle, ViewStyle } from 'react-native';
import { useColors } from '@src/utils/colors';
import CustomText from '@src/components/atom/CustomText';
import { fonts } from '@src/config/fonts';

interface BannerCardProps {
  imageUri: string;
  title: string;
  releaseDate?: string;
  rating?: string;
  onPress?: () => void;
  containerStyles?: ViewStyle;
}

const BannerCard = ({ imageUri, title, releaseDate, rating, onPress, containerStyles }: BannerCardProps) => {
  const themeColors = useColors();
  const styles = createStyles(themeColors);

  const Card = onPress ? TouchableOpacity : View;
  const cardProps = onPress ? { onPress } : {};

  return (
    <Card style={[styles.container, containerStyles]} {...cardProps}>
      <Image source={{ uri: imageUri }} style={styles.bannerImage as ImageStyle} />
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <CustomText font={fonts.nunitoBold} style={styles.title} numberOfLines={2}>
            {title}
          </CustomText>
          {releaseDate && (
            <CustomText font={fonts.nunitoMedium} style={styles.releaseDate}>
              {releaseDate}
            </CustomText>
          )}
          {rating && (
            <View style={styles.ratingContainer}>
              <CustomText style={styles.star}>⭐</CustomText>
              <CustomText font={fonts.nunitoBold} style={styles.rating}>
                {rating}
              </CustomText>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};

export default BannerCard;

const createStyles = (themeColors: any) => StyleSheet.create({
  container: {
    width: 340,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    color: themeColors.backgroundLight,
    fontSize: 18,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  releaseDate: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  star: {
    fontSize: 14,
    marginRight: 4,
  },
  rating: {
    color: '#FFD700',
    fontSize: 14,
  },
});
