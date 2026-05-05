import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@src/components/Header';
import { createStyles } from './styles';
import { useHomeScreenViewModel } from '@src/viewModels/tabs/useHomeScreenViewModel';

const HomeScreen = () => {
  const { themeColors } = useHomeScreenViewModel();
  const dynamicStyles = createStyles(themeColors);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header title="ComicVerse" fontSize={18} />
    </SafeAreaView>
  );
};

export default HomeScreen;
