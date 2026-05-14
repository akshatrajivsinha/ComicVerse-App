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
      <View style={{flex:1, marginLeft:16,gap:4}}>
        <CustomText font={fonts.nunitoBold} style={styles.title}>
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
    </Card>
  );
};

export default StoryPageCard;

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 12,
      backgroundColor: themeColors.cardBackground,
    },
    mainImage: {
      width: 100,
      height: 100,
      borderRadius: 12,
      resizeMode: 'cover',
    },
    textContent: {
      flexDirection: 'row',
      gap:4,
      alignItems:'center'
    },
    smallCircularImage: {
      width: 20,
      height: 20,
      borderRadius: 20,
      resizeMode: 'cover',
    },
    textContainer: {
      flex: 1,
    },
    category: {
      fontSize: 14,
      color: themeColors.text,
    },
    title: {
      fontSize: 16,
      color: themeColors.text,
      lineHeight:16,
      marginTop:4
    },
  });
