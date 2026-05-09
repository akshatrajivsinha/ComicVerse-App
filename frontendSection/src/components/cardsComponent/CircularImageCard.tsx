import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useColors } from '@src/utils/colors';
import CustomText from '@src/components/CustomText';
import { fonts } from '@src/config/fonts';

interface CircularImageCardProps {
  imageUri: string;
  title?: string;
  size?: number;
  onPress?: () => void;
  containerStyles?: ViewStyle;
}

const CircularImageCard = ({ imageUri, title, size = 80, onPress, containerStyles }: CircularImageCardProps) => {
  const themeColors = useColors();
  const styles = createStyles(themeColors, size);

  const Card = onPress ? TouchableOpacity : View;
  const cardProps = onPress ? { onPress } : {};

  return (
    <Card style={[styles.container, containerStyles]} {...cardProps}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>
      {title && <CustomText font={fonts.nunitoMedium} style={styles.title}>{title}</CustomText>}
    </Card>
  );
};

export default CircularImageCard;

const createStyles = (themeColors: any, size: number) => StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imageContainer: {
    width: size,
    height: size,
    borderRadius: size ?? 80,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: themeColors.primaryBlue,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    color: themeColors.text,
    textAlign: 'center',
  },
});
