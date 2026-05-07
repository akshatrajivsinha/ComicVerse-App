import { useState, useEffect } from 'react';
import { useColors } from '@src/utils/colors';
import { getCategories, Category } from '@src/utils/api';

export const useHomeScreenViewModel = () => {
  const themeColors = useColors();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const result = await getCategories();
      result.success ? setCategories(result.data) : setError(result.error || 'Failed to fetch categories');
      setLoading(false);
    };
    fetchCategories();
  }, []);

  return { themeColors, categories, loading, error };
};
