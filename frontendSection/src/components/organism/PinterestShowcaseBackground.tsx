import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  cancelAnimation, 
  Easing 
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const GAP = 8;
const COLUMN_WIDTH = (SCREEN_WIDTH - 20) / 3;

interface FadingMasonryCardProps {
  imageList: any[];
  height: number;
  delay?: number;
}

const FadingMasonryCard = ({ imageList, height, delay = 0 }: FadingMasonryCardProps) => {
  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(1);
  const [toggle, setToggle] = useState(true);

  const opacityA = useSharedValue(1);
  const opacityB = useSharedValue(0);

  useEffect(() => {
    if (!imageList || imageList.length <= 1) return;

    const fadeDuration = 2000;    
    const displayDuration = 5500; 

    let isMounted = true;
    let timerId: ReturnType<typeof setTimeout>;

    const runCrossFade = () => {
      if (!isMounted) return;

      if (toggle) {
        opacityA.value = withTiming(0, { duration: fadeDuration });
        opacityB.value = withTiming(1, { duration: fadeDuration });

        timerId = setTimeout(() => {
          if (!isMounted) return;
          setIndexA((prev) => (prev + 2) % imageList.length);
          setToggle(false);
          timerId = setTimeout(runCrossFade, displayDuration);
        }, fadeDuration);
      } else {
        opacityA.value = withTiming(1, { duration: fadeDuration });
        opacityB.value = withTiming(0, { duration: fadeDuration });

        timerId = setTimeout(() => {
          if (!isMounted) return;
          setIndexB((prev) => (prev + 2) % imageList.length);
          setToggle(true);
          timerId = setTimeout(runCrossFade, displayDuration);
        }, fadeDuration);
      }
    };

    const initialStagger = setTimeout(runCrossFade, delay);

    return () => {
      isMounted = false;
      clearTimeout(initialStagger);
      clearTimeout(timerId);
    };
  }, [imageList, delay, toggle, opacityA, opacityB]);

  const animatedStyleA = useAnimatedStyle(() => ({ opacity: opacityA.value }));
  const animatedStyleB = useAnimatedStyle(() => ({ opacity: opacityB.value }));

  return (
    <View style={[styles.cardWrapper, { height }]}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyleB]}>
        <Image 
          source={imageList[indexB]} 
          style={{ width: COLUMN_WIDTH, height }} 
          resizeMode="cover"
        />
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, animatedStyleA]}>
        <Image 
          source={imageList[indexA]} 
          style={{ width: COLUMN_WIDTH, height }} 
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
};

interface ScrollingColumnProps {
  children: React.ReactNode;
  speed?: number;
}

const ScrollingColumn = ({ children, speed = 25000 }: ScrollingColumnProps) => {
  const translateY = useSharedValue(0);
  const [columnHeight, setColumnHeight] = useState(0);

  useEffect(() => {
    if (columnHeight === 0) return;

    const scrollDistance = (columnHeight / 2) + (GAP / 2);

    translateY.value = 0;
    translateY.value = withRepeat(
      withTiming(-scrollDistance, {
        duration: speed,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    return () => cancelAnimation(translateY);
  }, [columnHeight, speed, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View 
      style={styles.columnContainer} 
      onLayout={(e) => setColumnHeight(e.nativeEvent.layout.height)}
    >
      <Animated.View style={[styles.column, animatedStyle]}>
        {children}
        {children}
      </Animated.View>
    </View>
  );
};

// ==========================================
// EXPORTED PINTEREST SHOWCASE BACKGROUND
// ==========================================
interface PinterestShowcaseBackgroundProps {
  images: any[];
}

export const PinterestShowcaseBackground = ({ images }: PinterestShowcaseBackgroundProps) => {
  if (!images || images.length === 0) return null;

  const getChunk = (offset: number) => {
    return images.map((_, i) => images[(i + offset) % images.length]);
  };

  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.masonryGrid}>
        <ScrollingColumn speed={45000}>
          <FadingMasonryCard imageList={getChunk(0)} height={350} delay={1000} />
          <FadingMasonryCard imageList={getChunk(7)} height={200} delay={3000} />
          <FadingMasonryCard imageList={getChunk(1)} height={180} delay={4000} />
        </ScrollingColumn>

        <ScrollingColumn speed={28000}>
          <FadingMasonryCard imageList={getChunk(2)} height={220} delay={3500} />
          <FadingMasonryCard imageList={getChunk(5)} height={350} delay={1500} />
          <FadingMasonryCard imageList={getChunk(4)} height={360} delay={4500} />
        </ScrollingColumn>

        <ScrollingColumn speed={38000}>
          <FadingMasonryCard imageList={getChunk(6)} height={380} delay={4700} />
          <FadingMasonryCard imageList={getChunk(9)} height={210} delay={3700} />
          <FadingMasonryCard imageList={getChunk(7)} height={340} delay={1700} />
        </ScrollingColumn>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  masonryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  columnContainer: {
    width: COLUMN_WIDTH,
    height: SCREEN_HEIGHT * 1.5,
  },
  column: {
    width: '100%',
    gap: GAP,
  },
  cardWrapper: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});