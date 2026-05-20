import React from 'react';
import { View, StyleSheet, TextStyle } from 'react-native';
import { colors } from '@src/utils/colors';
import CustomText from '@src/components/atom/CustomText';
import { fonts } from '@src/config/fonts';

const Footer = ({textStyle}: {textStyle?:TextStyle}) => {
  return (
    <View style={styles.container}>
      <CustomText font={fonts.nunitoMedium} style={[styles.text, textStyle]}>© 2026 ComicVerse App. All rights reserved.</CustomText>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: colors.textSlateDark,
  },
});
