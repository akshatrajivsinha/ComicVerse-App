import React, { useRef } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';

import { useColors } from '@src/utils/colors';
import { styles } from '@src/pages/tabs/HomeTab/Show/styles';
import BackButton from '@src/components/atom/BackButton';
import { useShowDetailViewModel } from '@src/viewModels/tabs/useShowDetailViewModal';
import BannersFlatList from '@src/components/organism/BannersFlatList';
import ShowsFlatList from '@src/components/organism/ShowsFlatList';
import { createStyles } from '@src/pages/tabs/HomeTab/Home/styles';
import ShowDetailSkeleton from '@src/pages/tabs/HomeTab/Show/components/ShowDetailSkeleton';

const ShowDetail = () => {
  const { showDetail, goBack, upcomingMovies, loading } = useShowDetailViewModel();
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

  if (loading && !showDetail) {
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
              uri: showDetail?.heroImage,
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
            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.95)']}
            style={dynamicStyles.gradient}
          />

          <BackButton onPress={goBack} />

          <View style={dynamicStyles.heroContent}>
            <Animated.Text style={dynamicStyles.title}>
              {showDetail?.title}
            </Animated.Text>

            <View style={dynamicStyles.metaRow}>
              <View style={dynamicStyles.metaBadge}>
                <Animated.Text style={dynamicStyles.metaText}>
                  8.7
                </Animated.Text>
              </View>

              <View style={dynamicStyles.metaBadge}>
                <Animated.Text style={dynamicStyles.metaText}>
                  Sci-Fi
                </Animated.Text>
              </View>

              <View style={dynamicStyles.metaBadge}>
                <Animated.Text style={dynamicStyles.metaText}>
                  Adventure
                </Animated.Text>
              </View>
            </View>

            <TouchableOpacity style={dynamicStyles.playButton}>
              <Animated.Text style={dynamicStyles.playButtonText}>
                Watch Now
              </Animated.Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={dynamicStyles.contentContainer}>
          <Animated.Text style={dynamicStyles.sectionTitle}>
            About Movie
          </Animated.Text>

          <Animated.Text style={dynamicStyles.description}>
            {showDetail?.description}
          </Animated.Text>
        </View>

        <ShowsFlatList
          shows={showDetail?.relatedSuggestions || []}
          showsLoading={false}
          showCardText={homeStyles.showCardText}
          divider={homeStyles.divider}
          containerStyle={homeStyles.containerStyle}
          categoryFlatList={homeStyles.categoryFlatList}
          title="Related Suggestions"
        />

        <BannersFlatList
          banners={upcomingMovies}
          loading={false}
          showCardText={homeStyles.showCardText}
          divider={homeStyles.divider}
          bannerCardContainer={homeStyles.bannerCardContainer}
          bannerListContainer={homeStyles.bannerListContainer}
          title={t('home.upcomingMovies')}
        />

        <View style={{ height: 60 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default ShowDetail;