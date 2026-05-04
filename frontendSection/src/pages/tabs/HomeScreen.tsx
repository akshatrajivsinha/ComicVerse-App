import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@src/utils/colors';
import Header from '@src/components/Header';
import CustomText from '@src/components/CustomText';
import { fonts } from '@src/config/fonts';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="ComicVerse" fontSize={20} />
      <View style={styles.innerContainer}>
        <CustomText font={fonts.nunitoMedium} style={styles.subtitle}>Welcome to the Home Screen</CustomText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSlate,
  },
});

export default HomeScreen;
