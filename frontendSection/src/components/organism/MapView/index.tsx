import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// @ts-ignore
import MapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import Mapbox from '@rnmapbox/maps';
import Config from 'react-native-config';
import Geolocation from '@react-native-community/geolocation';

import CustomText from '@src/components/atom/CustomText';
import { SearchBar } from './components/SearchBar';
import { MapMarkers } from './components/MapMarkers';
import { MapPolyline } from './components/MapPolyline';
import { DirectionComponent } from './components/DirectionComponent';
import { NearbyPOIsComponent } from './components/NearbyPOIsComponent';
import {
  OptionIcon,
  ResetIcon,
  SearchIcon,
  TargetIcon,
  TrafficSignIcon,
} from '@src/assets/icons';
import { createStyles } from './styles';
import { colors, useColors } from '@src/utils/colors';
import BackButton from '@src/components/atom/BackButton';

const MAP_TOKEN = Config.MAP_TOKEN ?? '';
Mapbox.setAccessToken(MAP_TOKEN);
const geocodingClient = MapboxGeocoding({
  accessToken: MAP_TOKEN,
});

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MarkerType {
  id: string;
  coordinates: [number, number];
  title: string;
}
const MapViewComponent = () => {
  const themeColors = useColors();
  const dynamicStyles = createStyles(themeColors);
  const navigation = useNavigation<any>();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  const [selectedLocation, setSelectedLocation] = useState<MarkerType | null>(
    null,
  );

  const [isPoiModalVisible, setIsPoiModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    [],
  );
  const [routeOrigin, setRouteOrigin] = useState<[number, number] | null>(null);
  const [routeDestination, setRouteDestination] = useState<
    [number, number] | null
  >(null);
  const [nearbyMarkers, setNearbyMarkers] = useState<MarkerType[]>([]);

  const cameraRef = useRef<Mapbox.Camera>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [routeDuration, setRouteDuration] = useState<string | null>(null);
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const routeSlideAnim = useRef(new Animated.Value(0)).current;

  const clearPOIsRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Location permissions are required to center the map.',
          );
          return;
        }
      } else if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
      }
      Geolocation.getCurrentPosition(
        async position => {
          const { longitude, latitude } = position.coords;
          const coords: [number, number] = [longitude, latitude];

          setUserLocation(coords);

          setTimeout(() => {
            cameraRef.current?.flyTo(coords, 1000);
          }, 100);

          try {
            const response = await geocodingClient
              .reverseGeocode({ query: coords, limit: 1 })
              .send();
            const feature = response.body?.features?.[0];
            setCurrentAddress(feature?.place_name || 'Current Location');
          } catch (error) {
            console.log('Current location geocode error', error);
          }
        },
        error => {
          console.log(
            'High accuracy fetch failed, trying cellular/wifi towers fallback...',
            error,
          );

          Geolocation.getCurrentPosition(
            async fallbackPosition => {
              const { longitude, latitude } = fallbackPosition.coords;
              const coords: [number, number] = [longitude, latitude];

              setUserLocation(coords);
              setTimeout(() => {
                cameraRef.current?.flyTo(coords, 1000);
              }, 100);

              try {
                const response = await geocodingClient
                  .reverseGeocode({ query: coords, limit: 1 })
                  .send();
                const feature = response.body?.features?.[0];
                setCurrentAddress(feature?.place_name || 'Current Location');
              } catch (e) {
                console.log('Fallback geocode error', e);
              }
            },
            _fallbackError =>
              Alert.alert(
                'Location Error',
                'Device timeout. Please check your GPS signal settings.',
              ),
            {
              enableHighAccuracy: false,
              timeout: 20000,
              maximumAge: 3600000,
            },
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 10000,
        },
      );
    };

    fetchLocation();
  }, []);

  const toggleSearch = () => {
    if (isRouteOpen) toggleRoutePanel();
    const toValue = isSearchOpen ? 0 : 1;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsSearchOpen(!isSearchOpen);
  };

  const toggleRoutePanel = () => {
    if (isSearchOpen) toggleSearch();
    const toValue = isRouteOpen ? 0 : 1;
    Animated.timing(routeSlideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsRouteOpen(!isRouteOpen);
  };

  const handleRecenter = () => {
    if (userLocation) {
      cameraRef.current?.setCamera({
        centerCoordinate: userLocation,
        zoomLevel: 14,
        animationDuration: 1000,
      });

      setTimeout(() => {
        cameraRef.current?.flyTo(userLocation, 1000);
      }, 50);
    } else {
      Alert.alert(
        'Location unavailable',
        'Still fetching your current position...',
      );
    }
  };

  const handleClearMap = () => {
    setSelectedLocation(null);
    setSelectedAddress('');
    setSearchQuery('');
    setSearchResults([]);
    setRouteCoordinates([]);
    setRouteDuration(null);
    setRouteOrigin(null);
    setRouteDestination(null);

    if (clearPOIsRef.current) clearPOIsRef.current();

    if (isSearchOpen) toggleSearch();
    if (isRouteOpen) toggleRoutePanel();

    if (userLocation) {
      cameraRef.current?.setCamera({
        centerCoordinate: userLocation,
        zoomLevel: 14,
        animationDuration: 0,
      });

      setTimeout(() => {
        cameraRef.current?.flyTo(userLocation, 800);
      }, 50);
    }
  };

  const executeSearch = async (queryText: string) => {
    if (!queryText.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await geocodingClient
        .forwardGeocode({
          query: queryText,
          limit: 5,
        })
        .send();
      setSearchResults(response.body?.features ?? []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      executeSearch(searchQuery);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectLocation = (feature: any) => {
    const coords = feature.geometry.coordinates;

    setSelectedLocation({
      id: feature.id || Date.now().toString(),
      coordinates: coords,
      title: feature.place_name.split(',')[0],
    });

    setSelectedAddress(feature.place_name);
    cameraRef.current?.flyTo(coords, 800);
    setSearchResults([]);
    setSearchQuery('');
    toggleSearch();
  };

  const handleMapPress = async (event: any) => {
    const { coordinates } = event.geometry;

    try {
      const response = await geocodingClient
        .reverseGeocode({
          query: coordinates,
          limit: 1,
        })
        .send();

      const feature = response.body?.features?.[0];
      const title = feature ? feature.text : 'Selected Point';

      setSelectedAddress(feature?.place_name || 'Unknown Location');

      setSelectedLocation({
        id: Date.now().toString(),
        coordinates,
        title,
      });

      cameraRef.current?.flyTo(coordinates, 800);
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const markersToRender: MarkerType[] = [];

  if (routeOrigin && routeDestination) {
    markersToRender.push({
      id: 'route-beginning-marker',
      coordinates: routeOrigin,
      title: 'Beginning Point',
    });
    markersToRender.push({
      id: 'route-destination-marker',
      coordinates: routeDestination,
      title: 'Destination Point',
    });
  } else {
    if (userLocation) {
      markersToRender.push({
        id: 'user-current-loc',
        coordinates: userLocation,
        title: 'My Location',
      });
    }
    if (selectedLocation) {
      markersToRender.push(selectedLocation);
    }
  }

  if (nearbyMarkers.length > 0) {
    markersToRender.push(...nearbyMarkers);
  }

  const searchWidth = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH - 120],
  });

  const searchOpacity = slideAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  const routeWidth = routeSlideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH - 130],
  });

  const routeOpacity = routeSlideAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={dynamicStyles.page}>
      <View style={dynamicStyles.container2}>
        <Mapbox.MapView style={dynamicStyles.map} onPress={handleMapPress}>
          <Mapbox.Camera
            ref={cameraRef}
            zoomLevel={14}
            centerCoordinate={userLocation ?? [0, 0]}
          />
          <MapMarkers markers={markersToRender} />
          <MapPolyline coordinates={routeCoordinates} />
        </Mapbox.MapView>

        <View style={dynamicStyles.floatingBackButton}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        <View style={dynamicStyles.floatingControlsRow}>
          <Animated.View
            style={[
              dynamicStyles.animatedSearchContainer,
              {
                width: searchWidth,
                opacity: searchOpacity,
              },
            ]}
          >
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchSubmit={() => executeSearch(searchQuery)}
              searchResults={searchResults}
              onSelectLocation={handleSelectLocation}
              showClearButton={!!selectedLocation}
              onClearMap={handleClearMap}
            />
          </Animated.View>

          <DirectionComponent
            mapToken={MAP_TOKEN}
            userLocation={userLocation}
            currentAddress={currentAddress}
            cameraRef={cameraRef}
            routeWidth={routeWidth}
            routeOpacity={routeOpacity}
            dynamicStyles={dynamicStyles}
            onRouteCalculated={(coords, duration, origin, destination) => {
              setRouteCoordinates(coords);
              setRouteDuration(duration);
              setRouteOrigin(origin);
              setRouteDestination(destination);
            }}
          />

          <View style={dynamicStyles.buttonToggleStack}>
            <TouchableOpacity
              style={dynamicStyles.searchToggleButton}
              onPress={toggleSearch}
              activeOpacity={0.8}
            >
              <Image
                source={SearchIcon}
                tintColor={colors.text}
                style={dynamicStyles.searchIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={dynamicStyles.searchToggleButton}
              onPress={toggleRoutePanel}
              activeOpacity={0.8}
            >
              <Image
                source={TrafficSignIcon}
                tintColor={colors.text}
                style={dynamicStyles.searchIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={dynamicStyles.recenterButton}
              onPress={handleRecenter}
              activeOpacity={0.8}
            >
              <Image
                source={TargetIcon}
                tintColor={colors.text}
                style={dynamicStyles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={dynamicStyles.bottomActionsContainer}>
          {!!selectedLocation && (
            <TouchableOpacity
              style={dynamicStyles.clearMapButton}
              onPress={handleClearMap}
              activeOpacity={0.8}
            >
              <Image
                source={ResetIcon}
                tintColor={colors.text}
                style={dynamicStyles.icon}
              />
            </TouchableOpacity>
          )}
          {userLocation && !routeCoordinates.length && (
            <TouchableOpacity
              style={dynamicStyles.searchToggleButton}
              onPress={() => setIsPoiModalVisible(true)}
              activeOpacity={0.8}
            >
              <Image
                source={OptionIcon}
                tintColor={colors.text}
                style={dynamicStyles.searchIcon}
              />
            </TouchableOpacity>
          )}
        </View>

        <NearbyPOIsComponent
          mapToken={MAP_TOKEN}
          userLocation={userLocation}
          cameraRef={cameraRef}
          routeActive={!!routeCoordinates.length}
          hasActiveCard={!!(routeDuration || selectedAddress || currentAddress)}
          dynamicStyles={dynamicStyles}
          onPOIsUpdated={pois => setNearbyMarkers(pois)}
          registerClearRef={clearFn => (clearPOIsRef.current = clearFn)}
          isVisible={isPoiModalVisible}
          onClose={() => setIsPoiModalVisible(false)}
        />

        {!!(selectedAddress || currentAddress || routeDuration) && (
          <View style={dynamicStyles.locationCard}>
            {/* <Image
              source={TargetIcon}
              tintColor={colors.text}
              style={dynamicStyles.locationIcon}
            /> */}

            <View style={{ flex: 1 }}>
              {!!routeDuration ? (
                <View style={dynamicStyles.durationBadgeContainer}>
                  <CustomText style={dynamicStyles.durationTextTitle}>
                    Estimated Time:
                  </CustomText>
                  <CustomText style={dynamicStyles.durationTimeVal}>
                    {routeDuration}
                  </CustomText>
                </View>
              ) : (
                <>
                  {!!currentAddress && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 8,
                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: '#1ebe53ff',
                          height: 20,
                          width: 20,
                          borderRadius: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <View
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 6,
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                      </View>
                      <View>
                        <CustomText style={dynamicStyles.locationTitle}>
                          Current Location
                        </CustomText>

                        <CustomText style={dynamicStyles.locationAddress}>
                          {currentAddress}
                        </CustomText>
                      </View>
                    </View>
                  )}

                  {!!selectedAddress && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 8,
                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: '#FF3B30',
                          height: 20,
                          width: 20,
                          borderRadius: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <View
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 6,
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                      </View>

                      <View>
                        <CustomText style={dynamicStyles.locationTitle}>
                          Selected Location
                        </CustomText>

                        <CustomText style={dynamicStyles.locationAddress}>
                          {selectedAddress}
                        </CustomText>
                      </View>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default MapViewComponent;
