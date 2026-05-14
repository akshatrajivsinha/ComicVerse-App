import { useState, useEffect } from 'react';
import { useColors } from '@src/utils/colors';
import {
  getCategories,
  getShowList,
  getHeroVideo,
  getMyStories,
  getUpcomingMovies,
  Category,
  Show,
  HeroVideo,
  Story,
  UpcomingMovie,
} from '@src/utils/api';

export const useHomeScreenViewModel = () => {
  const themeColors = useColors();

  const [categories, setCategories] = useState<Category[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [heroVideo, setHeroVideo] = useState<HeroVideo | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [banners, setBanners] = useState<UpcomingMovie[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showsLoading, setShowsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [showsError, setShowsError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchShows();
    fetchHeroVideo();
    fetchStories();
    fetchBanners();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const result = await getCategories();

      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.error || 'Failed to fetch categories');
      }
    } catch {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchShows = async () => {
    try {
      setShowsLoading(true);

      const result = await getShowList();

      if (result.success) {
        setShows(result.data);
      } else {
        setShowsError(result.error || 'Failed to fetch shows');
      }
    } catch {
      setShowsError('Something went wrong while fetching shows');
    } finally {
      setShowsLoading(false);
    }
  };

  const fetchHeroVideo = async () => {
    try {
      const result = await getHeroVideo();
      if (result.success && result.data) {
        setHeroVideo(result.data);
      }
    } catch {
    }
  };

  const fetchStories = async () => {
    try {
      const result = await getMyStories();
      if (result.success && result.data) {
        setStories(result.data);
      }
    } catch {
    }
  };

  const fetchBanners = async () => {
    try {
      const result = await getUpcomingMovies();
      if (result.success && result.data) {
        setBanners(result.data);
      }
    } catch {
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchCategories(),
      fetchShows(),
      fetchHeroVideo(),
      fetchStories(),
      fetchBanners(),
    ]);
    setRefreshing(false);
  };

  return {
    themeColors,
    categories,
    shows,
    heroVideo,
    stories,
    banners,
    loading,
    showsLoading,
    error,
    showsError,
    fetchCategories,
    fetchShows,
    refreshing,
    onRefresh,
  };
};
