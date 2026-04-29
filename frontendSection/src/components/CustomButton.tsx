import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@src/utils/colors';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  loading?: boolean;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
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
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 14,
    backgroundColor: colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryBlue,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
});

export default CustomButton;
