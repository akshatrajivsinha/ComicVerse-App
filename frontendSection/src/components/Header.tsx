import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@src/utils/colors';
import CustomText from '@src/components/CustomText';
import { fonts } from '@src/config/fonts';

interface HeaderProps {
  title: string;
  fontSize?: number;
}

const Header: React.FC<HeaderProps> = ({ title, fontSize = 16 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CustomText font={fonts.nunitoExtraBold} style={[styles.title, { fontSize }]}>{title}</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.border,
  },
  headerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  title: {
    fontWeight: '800',
    color: colors.text,
  },
});

export default Header;
