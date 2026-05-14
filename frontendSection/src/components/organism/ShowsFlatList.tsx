import React from 'react';
import { FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ShowCards from '@src/components/molecule/ShowCards';
import ShowsSkeleton from '@src/pages/tabs/HomeTab/Home/components/ShowsSkeleton';
import CustomText from '@src/components/atom/CustomText';
import { fonts } from '@src/config/fonts';
import { screenNames } from '@src/navigation/screenName';
import { MainStackParamList } from '@src/navigation/types';

interface ShowsFlatListProps {
  shows: any[];
  showsLoading: boolean;
  showCardText: any;
  divider: any;
  containerStyle: any;
  categoryFlatList: any;
  title: string;
}

type ShowDetailNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'ShowDetail'
>;

const ShowsFlatList = ({
  shows,
  showsLoading,
  showCardText,
  divider,
  containerStyle,
  categoryFlatList,
  title,
}: ShowsFlatListProps) => {
  const navigation = useNavigation<ShowDetailNavigationProp>();

  const handleShowPress = (item: any) => {
    navigation.navigate(screenNames.SHOW_DETAIL, {
      slug: item.slug,
    });
  };

  return (
    <View>
      {shows.length === 0 && showsLoading ? (
        <ShowsSkeleton />
      ) : (
        <>
          <CustomText font={fonts.nunitoExtraBold} style={showCardText}>
            {title}
          </CustomText>
          <View style={divider} />
          <FlatList
            data={shows}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.slug}
            renderItem={({ item }) => (
              <ShowCards
                poster={item?.image ?? item?.heroImage ?? ''}
                title={item?.title ?? ''}
                containerStyle={containerStyle}
                onPress={() => handleShowPress(item)}
              />
            )}
            contentContainerStyle={categoryFlatList}
            snapToInterval={260}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum={true}
          />
        </>
      )}
    </View>
  );
};

export default ShowsFlatList;
