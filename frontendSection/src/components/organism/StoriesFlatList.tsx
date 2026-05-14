import React from 'react';
import { FlatList, View } from 'react-native';
import StoryPageCard from '@src/components/molecule/StoryPageCard';
import StoriesSkeleton from '@src/pages/tabs/HomeTab/Home/components/StoriesSkeleton';
import CustomText from '@src/components/atom/CustomText';
import { fonts } from '@src/config/fonts';

interface StoriesFlatListProps {
  stories: any[];
  loading: boolean;
  showCardText: any;
  divider: any;
  storyCardContainer: any;
  storyListContainer: any;
  backgroundView: any;
  title: string;
}

const StoriesFlatList = ({ stories, loading, showCardText, divider, storyCardContainer, storyListContainer, backgroundView, title }: StoriesFlatListProps) => {
  return (
    <View style={backgroundView}>
      {stories.length === 0 && loading ? (
        <StoriesSkeleton />
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
            data={stories}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={({ item }) => (
              <StoryPageCard
                imageUri={item.imageUri || ''}
                smallImageUri={item.smallImageUri || ''}
                category={item.category || ''}
                title={item.title || ''}
                containerStyles={storyCardContainer}
              />
            )}
            contentContainerStyle={storyListContainer}
          />
        </>
      )}
    </View>
  );
};

export default StoriesFlatList;
