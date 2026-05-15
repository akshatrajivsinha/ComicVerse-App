import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Image,
  View,
} from 'react-native';
import { colors } from '@src/utils/colors';
import CustomText from '@src/components/atom/CustomText';
import { fonts } from '@src/config/fonts';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  loading?: boolean;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  icon?: any;
  iconTintColor?: string;
  font?: string;
  customButtonContent?: ViewStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  onPressIn,
  onPressOut,
  loading = false,
  buttonStyle,
  textStyle,
  disabled = false,
  icon,
  iconTintColor,
  font = fonts.nunitoBold,
  customButtonContent,
}) => {
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        buttonStyle,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator animating={loading} color={colors.text} />
      ) : (
        <View style={[styles.buttonContent, customButtonContent]}>
          {icon && (
            <Image
              source={icon}
              style={styles.icon}
              resizeMode="contain"
              tintColor={iconTintColor}
            />
          )}
          <CustomText font={font} style={[styles.buttonText, textStyle]}>
            {title}
          </CustomText>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
  buttonText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
});

export default CustomButton;
