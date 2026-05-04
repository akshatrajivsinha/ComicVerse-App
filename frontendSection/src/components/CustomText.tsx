import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { fonts } from '@src/config/fonts';

interface CustomTextProps extends TextProps {
  font?: string;
}

const CustomText: React.FC<CustomTextProps> = ({ font = fonts.nunitoMedium, style, ...props }) => {
  return (
    <Text style={[styles.text, { fontFamily: font }, style]} {...props}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    // Default styles can be added here
  },
});

export default CustomText;
