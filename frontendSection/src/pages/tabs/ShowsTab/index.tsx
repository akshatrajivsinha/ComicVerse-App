import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@src/components/atom/Header';
import { fonts } from '@src/config/fonts';
import CustomText from '@src/components/atom/CustomText';
import { useShowsScreenViewModel } from '@src/viewModels/tabs/useShowsScreenViewModel';
import { createStyles } from './styles';

const ShowsScreen = () => {
  const { themeColors } = useShowsScreenViewModel();
  const dynamicStyles = createStyles(themeColors);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header title="Shows" fontSize={18} />
      <View style={dynamicStyles.innerContainer}>
        <CustomText font={fonts.nunitoMedium} style={dynamicStyles.subtitle}>Browse trending shows and series</CustomText>
      </View>
    </SafeAreaView>
  );
};

export default ShowsScreen;
