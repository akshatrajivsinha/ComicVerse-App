import React, { useRef } from 'react';
import { View, Animated } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';

import { useColors } from '@src/utils/colors';
import { styles } from '@src/pages/tabs/HomeTab/StoryPage/styles';
import BackButton from '@src/components/atom/BackButton';
import BannersFlatList from '@src/components/organism/BannersFlatList';
import { createStyles } from '@src/pages/tabs/HomeTab/Home/styles';
import ShowDetailSkeleton from '@src/pages/tabs/HomeTab/Show/components/ShowDetailSkeleton';
import { useStoryPageViewModel } from '@src/viewModels/tabs/useStoryPageViewModel';

const StoryPage = () => {
  const { story, goBack, upcomingMovies } = useStoryPageViewModel();

  const { t } = useTranslation();

  const themeColors = useColors();

  const dynamicStyles = styles(themeColors);
  const homeStyles = createStyles(themeColors);

  const scrollY = useRef(new Animated.Value(0)).current;

  const imageScale = scrollY.interpolate({
    inputRange: [-200, 0],
    outputRange: [1.4, 1],
    extrapolate: 'clamp',
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, -80],
    extrapolate: 'clamp',
  });

  if (!story) {
    return <ShowDetailSkeleton />;
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Animated.ScrollView
        bounces
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          {
            useNativeDriver: true,
          },
        )}
      >
        <View style={dynamicStyles.heroContainer}>
          <Animated.Image
            source={{
              uri: story.imageUri,
            }}
            style={[
              dynamicStyles.heroImage,
              {
                transform: [
                  {
                    scale: imageScale,
                  },
                  {
                    translateY: imageTranslate,
                  },
                ],
              },
            ]}
          />

          <LinearGradient
            colors={[
              'transparent',
              'rgba(0,0,0,0.4)',
              'rgba(0,0,0,0.95)',
            ]}
            style={dynamicStyles.gradient}
          />

          <BackButton onPress={goBack} />

          <View style={dynamicStyles.heroContent}>
            <Animated.Text style={dynamicStyles.title}>
              {story.title}
            </Animated.Text>

            <Animated.Text style={dynamicStyles.infoText}>
              {story.releaseYear} • {story.language} •{' '}
              {story.category}
            </Animated.Text>

            <Animated.Text
              numberOfLines={1}
              style={dynamicStyles.authorText}
            >
              By {story.author}
            </Animated.Text>

            <View style={dynamicStyles.metaRow}>
              {story?.genre?.map(
                (item: string, index: number) => (
                  <View
                    key={index}
                    style={dynamicStyles.metaBadge}
                  >
                    <Animated.Text
                      style={dynamicStyles.metaText}
                    >
                      {item}
                    </Animated.Text>
                  </View>
                ),
              )}

              {!!story?.rating && (
                <View style={dynamicStyles.metaBadge}>
                  <Animated.Text
                    style={dynamicStyles.metaText}
                  >
                    ⭐ {story.rating}
                  </Animated.Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={dynamicStyles.contentContainer}>
          <Animated.Text style={dynamicStyles.sectionTitle}>
            About Story
          </Animated.Text>

          <Animated.Text style={dynamicStyles.description}>
            {story.description || story.title}
          </Animated.Text>
        </View>

        <BannersFlatList
          banners={upcomingMovies}
          loading={false}
          showCardText={homeStyles.showCardText}
          divider={homeStyles.divider}
          bannerCardContainer={
            homeStyles.bannerCardContainer
          }
          bannerListContainer={
            homeStyles.bannerListContainer
          }
          title={t('home.upcomingMovies')}
        />

        <View style={dynamicStyles.bottomSpace} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default StoryPage;