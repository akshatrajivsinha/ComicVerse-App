import React from 'react';
import { FlatList, View } from 'react-native';
import BannerCard from '@src/components/molecule/BannerCard';
import BannersSkeleton from '@src/pages/tabs/HomeTab/Home/components/BannersSkeleton';
import CustomText from '@src/components/atom/CustomText';
import { fonts } from '@src/config/fonts';

interface BannersFlatListProps {
  banners: any[];
  loading: boolean;
  showCardText: any;
  divider: any;
  bannerCardContainer: any;
  bannerListContainer: any;
  title: string;
}

const BannersFlatList = ({ banners, loading, showCardText, divider, bannerCardContainer, bannerListContainer, title }: BannersFlatListProps) => {
  return (
    <View>
      {banners.length === 0 && loading ? (
        <BannersSkeleton />
      ) : (
        <>
          <CustomText
            font={fonts.nunitoExtraBold}
            style={showCardText}
          >
            {title}
          </CustomText>
          <View style={divider} />
          <FlatList
            data={banners}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={({ item }) => (
              <BannerCard
                imageUri={item.imageUri || ''}
                title={item.title || ''}
                releaseDate={item.releaseDate || ''}
                rating={item.rating || ''}
                containerStyles={bannerCardContainer}
              />
            )}
            contentContainerStyle={bannerListContainer}
            snapToInterval={350}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum={true}
          />
        </>
      )}
    </View>
  );
};

export default BannersFlatList;
