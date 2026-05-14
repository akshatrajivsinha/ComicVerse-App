import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors } from '@src/utils/colors';
import CustomText from '@src/components/atom/CustomText';
import { fonts } from '@src/config/fonts';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface BackButtonProps {
  onPress: () => void;
}

const BackButton = ({ onPress }: BackButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withTiming(0.9, { duration: 100 });
  };

  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  return (
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={styles.backButton}
        >
          <CustomText font={fonts.nunitoBold} style={styles.backArrow}>←</CustomText>
        </Pressable>
      </Animated.View>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backArrow: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
});
