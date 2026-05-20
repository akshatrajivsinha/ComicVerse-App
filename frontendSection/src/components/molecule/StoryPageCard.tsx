import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useColors } from '@src/utils/colors';
import CustomText from '@src/components/atom/CustomText';
import { fonts } from '@src/config/fonts';

interface StoryPageCardProps {
  imageUri: string;
  smallImageUri: string;
  category: string;
  title: string;
  onPress?: () => void;
  containerStyles?: ViewStyle;
}

const StoryPageCard = ({
  imageUri,
  smallImageUri,
  category,
  title,
  onPress,
  containerStyles,
}: StoryPageCardProps) => {
  const themeColors = useColors();
  const styles = createStyles(themeColors);

  const Card = onPress ? TouchableOpacity : View;
  const cardProps = onPress ? { onPress } : {};

  return (
    <Card style={[styles.container, containerStyles]} {...cardProps}>
      <Image source={{ uri: imageUri }} style={styles.mainImage} />
      <View style={styles.overlayContainer}>
        <View style={styles.slantedBg} />
        
        <View style={styles.contentWrapper}>
          <CustomText font={fonts.nunitoBold} style={styles.title} numberOfLines={3}>
            {title}
          </CustomText>
          <View style={styles.textContent}>
            <Image
              source={{ uri: smallImageUri }}
              style={styles.smallCircularImage}
            />
            <CustomText font={fonts.nunitoBold} style={styles.category}>
              {category}
            </CustomText>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default StoryPageCard;

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    container: {
      height: 200,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: themeColors.cardBackground,
      position: 'relative',
    },
    mainImage: {
      ...StyleSheet.absoluteFill,
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    overlayContainer: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      width: '97%',
      minHeight: 80,
      justifyContent: 'center',
    },
    slantedBg: {
      ...StyleSheet.absoluteFill,
      backgroundColor: themeColors.teal,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      transform: [{ skewX: '-15deg' }], 
    },
    contentWrapper: {
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    textContent: {
      flexDirection: 'row',
      gap: 6,
      alignItems: 'center',
      marginTop: 4,
    },
    smallCircularImage: {
      width: 18,
      height: 18,
      borderRadius: 9,
      resizeMode: 'cover',
    },
    category: {
      fontSize: 12,
      color: themeColors.backgroundLight,
    },
    title: {
      fontSize: 14,
      color: themeColors.backgroundLight,
      lineHeight: 18,
    },
  });
  