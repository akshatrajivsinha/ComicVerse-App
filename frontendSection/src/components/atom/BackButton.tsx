import { colors } from '@src/utils/colors';
import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';

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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.9, { duration: 100 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 100 });
        }}
        style={styles.backButton}
      >
        <Image
          source={require('@src/assets/icons/backIcon.png')}
          style={styles.icon}
          resizeMode="contain"
          tintColor={colors.black}
        />
      </Pressable>
    </Animated.View>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backButton: {
    marginVertical:15,
    marginHorizontal:16,
    backgroundColor:colors.backgroundLight,
    alignSelf:'flex-start',
    padding:2,
    borderRadius:30
  },
  icon:{
    height:30,
    width:30,
  }
});
