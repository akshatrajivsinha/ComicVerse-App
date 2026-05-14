import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import Header from '@src/components/atom/Header';
import VideoPlayerCard from '@src/components/molecule/VideoPlayerCard';
import { createStyles } from '@src/pages/tabs/HomeTab/Home/styles';
import { useHomeScreenViewModel } from '@src/viewModels/tabs/useHomeScreenViewModel';
import VideoPlayerSkeleton from '@src/pages/tabs/HomeTab/Home/components/VideoPlayerSkeleton';
import CategoriesFlatList from '@src/components/organism/CategoriesFlatList';
import ShowsFlatList from '@src/components/organism/ShowsFlatList';
import StoriesFlatList from '@src/components/organism/StoriesFlatList';
import BannersFlatList from '@src/components/organism/BannersFlatList';

const HomeScreen = () => {
  const { t } = useTranslation();
  const {
    themeColors,
    categories,
    shows,
    heroVideo,
    stories,
    banners,
    loading,
    showsLoading,
    refreshing,
    onRefresh,
  } = useHomeScreenViewModel();
  const dynamicStyles = createStyles(themeColors);

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top']}>
      <Header title={t('home.title')} fontSize={18} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={dynamicStyles.scrollViewContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <CategoriesFlatList
          categories={categories}
          loading={loading}
          categoryFlatList={dynamicStyles.categoryFlatList}
        />
        <View>
          {!heroVideo ? (
            <VideoPlayerSkeleton />
          ) : (
            <VideoPlayerCard
              videoUri={require('@src/assets/videos/avengerEndgame.mp4') || heroVideo?.videoUri}
              aspectRatio="16/9"
              height={189}
              poster={heroVideo?.poster || ""}
              categoryImage={heroVideo?.categoryImage || ""}
              categoryTitle={heroVideo?.categoryTitle || ""}
              isMuted={true}
              autoPlay={false}
              controlsMode="custom"
            />
          )}
        </View>

        <ShowsFlatList
          shows={shows}
          showsLoading={showsLoading}
          showCardText={dynamicStyles.showCardText}
          divider={dynamicStyles.divider}
          containerStyle={dynamicStyles.containerStyle}
          categoryFlatList={dynamicStyles.categoryFlatList}
          title={t('home.mustWatch')}
        />

        <StoriesFlatList
          stories={stories}
          loading={loading}
          showCardText={dynamicStyles.showCardText}
          divider={dynamicStyles.divider}
          storyCardContainer={dynamicStyles.storyCardContainer}
          storyListContainer={dynamicStyles.storyListContainer}
          backgroundView={dynamicStyles.backgroundView}
          title={t('home.articles')}
        />
        
        <BannersFlatList
          banners={banners}
          loading={loading}
          showCardText={dynamicStyles.showCardText}
          divider={dynamicStyles.divider}
          bannerCardContainer={dynamicStyles.bannerCardContainer}
          bannerListContainer={dynamicStyles.bannerListContainer}
          title={t('home.upcomingMovies')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
