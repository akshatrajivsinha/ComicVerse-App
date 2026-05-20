import React from 'react';
import { View, Animated, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useColors } from '@src/utils/colors';
import { styles } from '@src/pages/tabs/HomeTab/Show/styles';
import BackButton from '@src/components/atom/BackButton';
import { useShowDetailViewModel } from '@src/viewModels/tabs/useShowDetailViewModal';
import BannersFlatList from '@src/components/organism/BannersFlatList';
import ShowsFlatList from '@src/components/organism/ShowsFlatList';
import { createStyles } from '@src/pages/tabs/HomeTab/Home/styles';
import ShowDetailSkeleton from '@src/pages/tabs/HomeTab/Show/components/ShowDetailSkeleton';
import VideoPlayerCard from '@src/components/molecule/VideoPlayerCard';

const ShowDetail = () => {
  const { showDetail, goBack, upcomingMovies, loading } = useShowDetailViewModel();
  const { t } = useTranslation();

  const themeColors = useColors();
  const dynamicStyles = styles(themeColors);
  const homeStyles = createStyles(themeColors);


  if (loading && !showDetail) {
    return <ShowDetailSkeleton />;
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView
        bounces
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <View style={dynamicStyles.heroContainer}>
          
          <BackButton onPress={goBack} />
           <VideoPlayerCard
              videoUri={require('@src/assets/videos/avengerEndgame.mp4') || showDetail?.videoUri}
              aspectRatio="16/9"
              height={189}
              poster={showDetail?.poster || ""}
              categoryImage={showDetail?.categoryImage || ""}
              categoryTitle={showDetail?.title || ""}
              isMuted={true}
              autoPlay={false}
              controlsMode="custom"
            />

      
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShowDetail;