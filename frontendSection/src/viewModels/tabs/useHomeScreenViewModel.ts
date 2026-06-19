import { useState, useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Config from 'react-native-config';
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

// @ts-ignore
import MapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const geocodingClient = MapboxGeocoding({
  accessToken: Config.MAP_TOKEN ?? '',
});

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
  const [currentAddress, setCurrentAddress] = useState('Fetching current address...');
  const [addressLoading, setAddressLoading] = useState(false);

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

  // useEffect(() => {
  //   const fetchLocation = async () => {
  //     setAddressLoading(true);

  //     if (Platform.OS === 'android') {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       );
  //       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //         Alert.alert(
  //           'Permission Denied',
  //           'Location permissions are required to center the map.',
  //         );
  //         setCurrentAddress('Location permission required');
  //         setAddressLoading(false);
  //         return;
  //       }
  //     } else if (Platform.OS === 'ios') {
  //       Geolocation.requestAuthorization();
  //     }

  //     Geolocation.getCurrentPosition(
  //       async position => {
  //         const { longitude, latitude } = position.coords;
  //         const coords: [number, number] = [longitude, latitude];

  //         try {
  //           const response = await geocodingClient
  //             .reverseGeocode({ query: coords, limit: 1 })
  //             .send();
  //           const feature = response.body?.features?.[0];
  //           setCurrentAddress(feature?.place_name || 'Current Location');
  //         } catch (locationGeocodeError) {
  //           console.log(
  //             'Current location geocode error',
  //             locationGeocodeError,
  //           );
  //           setCurrentAddress('Current Location');
  //         } finally {
  //           setAddressLoading(false);
  //         }
  //       },
  //       locationError => {
  //         console.log(
  //           'High accuracy fetch failed, trying cellular/wifi towers fallback...',
  //           locationError,
  //         );

  //         Geolocation.getCurrentPosition(
  //           async fallbackPosition => {
  //             const { longitude, latitude } = fallbackPosition.coords;
  //             const coords: [number, number] = [longitude, latitude];

  //             try {
  //               const response = await geocodingClient
  //                 .reverseGeocode({ query: coords, limit: 1 })
  //                 .send();
  //               const feature = response.body?.features?.[0];
  //               setCurrentAddress(feature?.place_name || 'Current Location');
  //             } catch (fallbackGeocodeError) {
  //               console.log('Fallback geocode error', fallbackGeocodeError);
  //               setCurrentAddress('Current Location');
  //             } finally {
  //               setAddressLoading(false);
  //             }
  //           },
  //           _fallbackError => {
  //             Alert.alert(
  //               'Location Error',
  //               'Device timeout. Please check your GPS signal settings.',
  //             );
  //             setCurrentAddress('Unable to fetch current address');
  //             setAddressLoading(false);
  //           },
  //           {
  //             enableHighAccuracy: false,
  //             timeout: 20000,
  //             maximumAge: 3600000,
  //           },
  //         );
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         timeout: 10000,
  //         maximumAge: 10000,
  //       },
  //     );
  //   };

  //   fetchLocation();
  // }, []);

  return {
    themeColors,
    categories,
    shows,
    heroVideo,
    stories,
    banners,
    currentAddress,
    addressLoading,
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
