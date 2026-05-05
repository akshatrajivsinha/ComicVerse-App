import { useState } from 'react';
import { useColors } from '@src/utils/colors';

export const useShowsScreenViewModel = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const themeColors = useColors();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Handle category filtering logic
  };

  const handleShowPress = (showId: string) => {
    // Handle show navigation
  };

  return {
    selectedCategory,
    setSelectedCategory,
    handleCategoryChange,
    handleShowPress,
    themeColors,
  };
};
