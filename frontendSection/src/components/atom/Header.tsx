import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '@src/utils/colors';
import CustomText from '@src/components/atom/CustomText';
import { fonts } from '@src/config/fonts';

interface HeaderProps {
  title: string;
  fontSize?: number;
}

const Header: React.FC<HeaderProps> = ({ title, fontSize = 16 }) => {
  const themeColors = useColors();

  return (
    <View style={[styles.container]}>
        <CustomText
          font={fonts.bebasNeue}
          style={[styles.title, { fontSize, color: themeColors.text }]}
        >
          {title}
        </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '800',
  },
});

export default Header;
