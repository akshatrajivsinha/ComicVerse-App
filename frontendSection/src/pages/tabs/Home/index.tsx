import React from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@src/components/Header';
import CircularImageCard from '@src/components/cardsComponent/CircularImageCard';
import VideoPlayerCard from '@src/components/cardsComponent/VideoPlayerCard';
import { createStyles } from './styles';
import { useHomeScreenViewModel } from '@src/viewModels/tabs/useHomeScreenViewModel';

const HomeScreen = () => {
  const { themeColors, categories } = useHomeScreenViewModel();
  const dynamicStyles = createStyles(themeColors);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header title="ComicVerse" fontSize={18} />
      <View style={dynamicStyles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <CircularImageCard
              imageUri={item.image}
              size={70}
              containerStyles={dynamicStyles.categoryFlatList}
            />
          )}
          contentContainerStyle={dynamicStyles.categoryFlatList}
        />
      </View>
      <View style={dynamicStyles.videoContainer}>
        <VideoPlayerCard
          videoUri={require('@src/assets/videos/avengerEndgame.mp4')}
          aspectRatio="16/9"
          height={189}
          categoryImage="https://lumiere-a.akamaihd.net/v1/images/au_portrait_grid_marvel_logo_2025_mobile_1ad65200.png?region=0%2C0%2C1024%2C640"
          categoryTitle="Marvel Studios: Avengers - Official Trailer"
          isMuted={true}
          autoPlay={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
