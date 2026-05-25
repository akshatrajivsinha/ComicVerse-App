import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@src/components/atom/Header';
import { useSearchScreenViewModel } from '@src/viewModels/tabs/useSearchScreenViewModel';
import { createStyles } from './styles';

const SearchScreen = () => {
  const { themeColors } = useSearchScreenViewModel();
  const dynamicStyles = createStyles(themeColors);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header title="Search" fontSize={18} />
    </SafeAreaView>
  );
};

export default SearchScreen;
