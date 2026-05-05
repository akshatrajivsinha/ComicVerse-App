import { useState } from 'react';
import { useColors } from '@src/utils/colors';

export const useSearchScreenViewModel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const themeColors = useColors();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Handle search logic
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleClearSearch,
    themeColors,
  };
};
