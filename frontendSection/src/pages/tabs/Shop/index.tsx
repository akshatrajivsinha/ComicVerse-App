import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fonts } from '@src/config/fonts';
import Header from '@src/components/Header';
import CustomText from '@src/components/CustomText';
import { useShopScreenViewModel } from '@src/viewModels/tabs/useShopScreenViewModel';
import { createStyles } from './styles';

const ShopScreen = () => {
  const { themeColors } = useShopScreenViewModel();
  const dynamicStyles = createStyles(themeColors);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header title="Shop" fontSize={18} />
      <View style={dynamicStyles.innerContainer}>
        <CustomText font={fonts.nunitoMedium} style={dynamicStyles.subtitle}>Explore exclusive merchandise</CustomText>
      </View>
    </SafeAreaView>
  );
};

export default ShopScreen;
