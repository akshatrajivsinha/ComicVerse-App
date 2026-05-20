import React from 'react';
import { FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import StoryPageCard from '@src/components/molecule/StoryPageCard';
import StoriesSkeleton from '@src/pages/tabs/HomeTab/Home/components/StoriesSkeleton';
import CustomText from '@src/components/atom/CustomText';
import { fonts } from '@src/config/fonts';
import { screenNames } from '@src/navigation/screenName';
import { MainStackParamList } from '@src/navigation/types';

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

type StoryPageNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'StoryPage'
>;

const StoriesFlatList = ({
  stories,
  loading,
  showCardText,
  divider,
  storyCardContainer,
  storyListContainer,
  backgroundView,
  title,
}: StoriesFlatListProps) => {
  const navigation = useNavigation<StoryPageNavigationProp>();

  const handleStoryPress = (item: any) => {
    navigation.navigate(screenNames.STORY_PAGE, {
      slug: item.slug,
    });
  };

  return (
    <View style={backgroundView}>
      {stories.length === 0 && loading ? (
        <StoriesSkeleton />
      ) : (
        <>
          <CustomText font={fonts.nunitoExtraBold} style={showCardText}>
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
                onPress={() => handleStoryPress(item)}
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
