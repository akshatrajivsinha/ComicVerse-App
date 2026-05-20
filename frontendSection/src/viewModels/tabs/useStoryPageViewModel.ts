import { useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MainStackParamList } from '@src/navigation/types';
import {
  getStoryDetialBySlug,
  getUpcomingMovies,
  Story,
  UpcomingMovie,
} from '@src/utils/api';

type StoryPageRouteProp = RouteProp<MainStackParamList, 'StoryPage'>;
type StoryPageNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'StoryPage'
>;

export const useStoryPageViewModel = () => {
  const navigation = useNavigation<StoryPageNavigationProp>();
  const route = useRoute<StoryPageRouteProp>();
  const storySlug = route.params?.slug;
  const [story, setStory] = useState<Story | null>(route.params?.story ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingMovies, setUpcomingMovies] = useState<UpcomingMovie[]>([]);

  useEffect(() => {
    fetchStoryDetail();
    fetchUpcomingMovies();
  });

  const fetchStoryDetail = async () => {
    if (!storySlug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getStoryDetialBySlug(storySlug);
      if (result.success && result.data) {
        setStory(result.data);
      } else {
        setError(result.error || 'Failed to fetch story details');
      }
    } catch {
      setError('Something went wrong while fetching story details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingMovies = async () => {
    try {
      const result = await getUpcomingMovies();
      if (result.success && result.data) {
        setUpcomingMovies(result.data);
      }
    } catch {
      console.error('Failed to fetch upcoming movies');
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return {
    story,
    loading,
    error,
    goBack,
    upcomingMovies,
  };
};
