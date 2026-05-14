import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@src/components/atom/Header';
import CustomText from '@src/components/atom/CustomText';
import { fonts } from '@src/config/fonts';
import { useSearchScreenViewModel } from '@src/viewModels/tabs/useSearchScreenViewModel';
import { createStyles } from './styles';

const SearchScreen = () => {
  const { themeColors } = useSearchScreenViewModel();
  const dynamicStyles = createStyles(themeColors);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header title="Search" fontSize={18} />
      <View style={dynamicStyles.innerContainer}>
        <CustomText font={fonts.nunitoMedium} style={dynamicStyles.subtitle}>Find your favorite comics and movies</CustomText>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
