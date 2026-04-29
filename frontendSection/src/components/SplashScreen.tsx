import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, StatusBar } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors } from '@src/utils/colors';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.statusBarDark} />
      <FastImage
        source={require('@src/assets/videos/comicVerse.gif')}
        style={styles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
    </Animated.View>
  );
};  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;
