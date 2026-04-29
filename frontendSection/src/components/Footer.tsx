import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@src/utils/colors';

const Footer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>© 2026 ComicVerse App. All rights reserved.</Text>
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
