import { useEffect, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { useColors } from '@src/utils/colors';

import { getShowDetailBySlug, getUpcomingMovies, UpcomingMovie } from '@src/utils/api';
import { ShowDetailNavigationProps } from '@src/navigation/types';

export interface RelatedSuggestion {
  id?: string;
  title?: string;
  image?: string;
  slug?: string;
}

export interface ShowCategory {
  image?: string;
  title?: string;
}

export interface ShowDetail {
  id?: string;
  slug: string;
  title?: string;
  heroImage: string;
  category?: ShowCategory;
  relatedSuggestions?: RelatedSuggestion[];
  description?: string;
  rating?: string;
  genre?: string;
  releaseDate?: string;
  [key: string]: any;
}

export type ShowDetailRouteParams = {
  ShowDetail: {
    slug: string;
  };
};

export const useShowDetailViewModel = () => {

  const themeColors = useColors();
  const navigation = useNavigation<ShowDetailNavigationProps>();
  const route = useRoute<RouteProp<ShowDetailRouteParams, 'ShowDetail'>>();
  const { slug } = route.params;
  const [showDetail, setShowDetail] = useState<ShowDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingMovies, setUpcomingMovies] = useState<UpcomingMovie[]>([]);

  useEffect(() => {
    fetchShowDetail();
    fetchUpcomingMovies();
  });

  const fetchShowDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getShowDetailBySlug(slug);

      if (result.success && result.data) {
        setShowDetail(result.data);
        setLoading(false);
      } else {
        setError(result.error || 'Failed to fetch show details');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong while fetching show details');
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
    (navigation as any).goBack();
  }

  return {
    themeColors,
    navigation,
    slug,
    showDetail,
    loading,
    error,
    upcomingMovies,
    fetchShowDetail,
    goBack
  };
};
