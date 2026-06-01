// useMapController.ts
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Platform,
  PermissionsAndroid,
  Alert,
  PanResponder,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import Mapbox from '@rnmapbox/maps';
import { Coordinate, SearchedPlace } from '@src/components/organism/MapView/constants';
import {
  geocodingClient,
  getDistanceBetweenScreenPoints,
} from './constants';

export const useMapController = () => {
  const navigation = useNavigation<any>();

  // Refs
  const mapRef = useRef<Mapbox.MapView>(null);
  const cameraRef = useRef<Mapbox.Camera>(null);
  const clearPOIsRef = useRef<(() => void) | null>(null);
  const lastDrawScreenPointRef = useRef<{ x: number; y: number } | null>(null);
  const isConvertingTouchRef = useRef(false);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchedPlaces, setSearchedPlaces] = useState<SearchedPlace[]>([]);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [isDrawingArea, setIsDrawingArea] = useState(false);
  const [drawnAreaCoordinates, setDrawnAreaCoordinates] = useState<Coordinate[]>([]);

  // Track drawn coordinates via ref to avoid PanResponder re-binding lag
  const drawnAreaCoordinatesRef = useRef<Coordinate[]>([]);
  useEffect(() => {
    drawnAreaCoordinatesRef.current = drawnAreaCoordinates;
  }, [drawnAreaCoordinates]);

  // Camera Workspace Bounds Logic
  const fitWorkspaceInViewport = useCallback(
    (
      updatedPlaces = searchedPlaces,
      activeDrawnCoords = drawnAreaCoordinates,
    ) => {
      const pointsToFit: Coordinate[] = []; 

      updatedPlaces.forEach(p => {
        pointsToFit.push(p.coordinates);
        if (p.geometry?.coordinates) {
          const flattenCoordinates = (coordsArray: any[]): void => {
            if (
              typeof coordsArray[0] === 'number' &&
              typeof coordsArray[1] === 'number'
            ) {
              pointsToFit.push([coordsArray[0], coordsArray[1]]);
            } else {
              coordsArray.forEach(c => flattenCoordinates(c));
            }
          };
          flattenCoordinates(p.geometry.coordinates);
        }
      });

      activeDrawnCoords.forEach(coord => pointsToFit.push(coord));
      
      if (pointsToFit.length === 0 && userLocation) {
        pointsToFit.push(userLocation);
      }

      if (pointsToFit.length === 0) return;

      const lngs = pointsToFit.map(p => p[0]);
      const lats = pointsToFit.map(p => p[1]);

      cameraRef.current?.fitBounds(
        [Math.max(...lngs), Math.max(...lats)],
        [Math.min(...lngs), Math.min(...lats)],
        [60, 60, 60, 60],
        1200,
      );
    },
    [searchedPlaces, drawnAreaCoordinates, userLocation],
  );

  // Adjust bounds when structural layers update
  useEffect(() => {
    fitWorkspaceInViewport();
  }, [searchedPlaces, drawnAreaCoordinates, fitWorkspaceInViewport]);

  // Device Location Permissions & Setup
  useEffect(() => {
    const fetchLocation = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Location permissions are required.',
          );
          return;
        }
      } else {
        Geolocation.requestAuthorization();
      }

      Geolocation.getCurrentPosition(
        async position => {
          const coords: Coordinate = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setUserLocation(coords);

          cameraRef.current?.setCamera({
            centerCoordinate: coords,
            zoomLevel: 12,
            animationDuration: 1000,
          });

          try {
            const response = await geocodingClient
              .reverseGeocode({ query: coords, limit: 1 })
              .send();
            setCurrentAddress(
              response.body?.features?.[0]?.place_name || 'Current Location',
            );
          } catch (e) {
            console.error('Reverse geocode failure', e);
          }
        },
        error => console.error('Location track error: ', error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 },
      );
    };
    fetchLocation();
  }, []);

  // Search Engine Execution
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
          types: ['postcode', 'place', 'locality', 'region', 'address'],
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
    const delayDebounceFn = setTimeout(() => executeSearch(searchQuery), 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Nominatim OpenStreetMap Boundary Fetcher
  const fetchGeometryBoundary = async (
    placeName: string,
  ): Promise<any | null> => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        placeName,
      )}&format=geojson&polygon_geojson=1&limit=1`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'ReactNativeMapApp/1.0' },
      });
      const data = await response.json();
      if (data?.features?.length > 0) {
        const geom = data.features[0].geometry;
        if (geom.type === 'Polygon' || geom.type === 'MultiPolygon')
          return geom;
      }
    } catch (e) {
      console.error('Error fetching Nominatim boundary:', e);
    }
    return null;
  };

  // Selection & Drop Pin Interactions
  const handleSelectLocation = async (feature: any) => {
    const centerCoords = feature.geometry.coordinates as Coordinate;
    const titleText = feature.place_name.split(',')[0];
    let geometryOverlay = null;

    if (
      feature.place_type?.some((type: string) =>
        ['postcode', 'place', 'locality', 'region', 'district'].includes(type),
      )
    ) {
      geometryOverlay = await fetchGeometryBoundary(feature.place_name);
    }

    if (geometryOverlay) {
      let rawCoordinates = [];

      if (geometryOverlay.type === 'Polygon') {
        rawCoordinates = geometryOverlay.coordinates[0];
      } else if (geometryOverlay.type === 'MultiPolygon') {
        rawCoordinates = geometryOverlay.coordinates[0][0];
      }

      const skipFactor = 5;

      const compressedCoordinates = rawCoordinates.filter(
        (_: any, index: number) => index % skipFactor === 0,
      );

      if (
        compressedCoordinates[compressedCoordinates.length - 1] !==
        rawCoordinates[rawCoordinates.length - 1]
      ) {
        compressedCoordinates.push(rawCoordinates[rawCoordinates.length - 1]);
      }

      console.log(
        `Original Points: ${rawCoordinates.length} | Compressed Points: ${compressedCoordinates.length}`,
      );

      console.log(JSON.stringify(compressedCoordinates));
    }

    const newPlace: SearchedPlace = {
      id: feature.id || Date.now().toString(),
      coordinates: centerCoords,
      placeName: titleText,
      displayName: feature.place_name,
      geometry: geometryOverlay,
    };

    setSearchedPlaces(prev =>
      prev.some(item => item.id === newPlace.id) ? prev : [...prev, newPlace],
    );
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleMapPress = async (event: any) => {
    const { coordinates } = event.geometry;
    if (isDrawingArea) {
      setDrawnAreaCoordinates(prev => {
        const updatedDraw = [...prev, coordinates];
        setTimeout(
          () => fitWorkspaceInViewport(searchedPlaces, updatedDraw),
          100,
        );
        return updatedDraw;
      });
      return;
    }

    try {
      const response = await geocodingClient
        .reverseGeocode({ query: coordinates, limit: 1 })
        .send();
      const feature = response.body?.features?.[0];
      setSearchedPlaces(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          coordinates,
          placeName: feature ? feature.text : 'Dropped Pin',
          displayName: feature?.place_name || 'Dropped Pin Point Location',
        },
      ]);
    } catch (error) {
      console.error('Geocoding mapping error:', error);
    }
  };

  const handleClearMap = () => {
    setSearchedPlaces([]);
    setDrawnAreaCoordinates([]);
    setSearchQuery('');
    setSearchResults([]);
    setIsDrawingArea(false);
    if (clearPOIsRef.current) clearPOIsRef.current();
    fitWorkspaceInViewport([], []);
  };

  // Pan Responder Touch Injection
  const appendCoordinateFromTouch = useCallback(
    async (x: number, y: number) => {
      if (!mapRef.current || isConvertingTouchRef.current) return;
      const screenPoint = { x, y };

      if (
        lastDrawScreenPointRef.current &&
        getDistanceBetweenScreenPoints(
          lastDrawScreenPointRef.current,
          screenPoint,
        ) < 6
      )
        return;
      isConvertingTouchRef.current = true;

      try {
        const coordinate = await mapRef.current.getCoordinateFromView([x, y]);
        if (Array.isArray(coordinate) && coordinate.length >= 2) {
          setDrawnAreaCoordinates(prev => [
            ...prev,
            [coordinate[0], coordinate[1]] as Coordinate,
          ]);
        }
        lastDrawScreenPointRef.current = screenPoint;
      } catch (e) {
        console.error('Touch parsing failure', e);
      } finally {
        isConvertingTouchRef.current = false;
      }
    },
    [],
  );

  const drawPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => isDrawingArea,
        onStartShouldSetPanResponderCapture: () => isDrawingArea,
        onMoveShouldSetPanResponder: () => isDrawingArea,
        onMoveShouldSetPanResponderCapture: () => isDrawingArea,
        onPanResponderGrant: e =>
          appendCoordinateFromTouch(
            e.nativeEvent.locationX,
            e.nativeEvent.locationY,
          ),
        onPanResponderMove: e =>
          appendCoordinateFromTouch(
            e.nativeEvent.locationX,
            e.nativeEvent.locationY,
          ),
        onPanResponderRelease: () => {
          lastDrawScreenPointRef.current = null;
          fitWorkspaceInViewport(
            searchedPlaces,
            drawnAreaCoordinatesRef.current,
          );
        },
        onPanResponderTerminate: () => {
          lastDrawScreenPointRef.current = null;
        },
      }),
    [
      appendCoordinateFromTouch,
      isDrawingArea,
      searchedPlaces,
      fitWorkspaceInViewport,
    ],
  );

  return {
    navigation,
    mapRef,
    cameraRef,
    searchQuery,
    setSearchQuery,
    searchResults,
    searchedPlaces,
    setSearchedPlaces,
    userLocation,
    currentAddress,
    isDrawingArea,
    setIsDrawingArea,
    drawnAreaCoordinates,
    drawPanResponder,
    executeSearch,
    handleSelectLocation,
    handleMapPress,
    handleClearMap,
    fitWorkspaceInViewport,
  };
};
