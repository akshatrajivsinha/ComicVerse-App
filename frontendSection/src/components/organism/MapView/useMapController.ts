import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Platform,
  PermissionsAndroid,
  Alert,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Mapbox from '@rnmapbox/maps';

import {
  Coordinate,
  SearchedPlace,
} from '@src/components/organism/MapView/types';
import { geocodingClient, getDistanceBetweenScreenPoints } from './constants';

const closeCoordinatesRing = (coordinates: Coordinate[]): Coordinate[] => {
  if (coordinates.length < 3) return coordinates;
  const firstCoordinate = coordinates[0];
  const lastCoordinate = coordinates[coordinates.length - 1];

  if (
    firstCoordinate[0] === lastCoordinate[0] &&
    firstCoordinate[1] === lastCoordinate[1]
  ) {
    return coordinates;
  }
  return [...coordinates, firstCoordinate];
};

const getCoordinatesCenter = (coordinates: Coordinate[]): Coordinate => {
  const lngTotal = coordinates.reduce((total, coord) => total + coord[0], 0);
  const latTotal = coordinates.reduce((total, coord) => total + coord[1], 0);
  return [lngTotal / coordinates.length, latTotal / coordinates.length];
};

type ActiveVertexDrag = {
  areaIndex: number | 'current';
  coordinateIndex: number;
} | null;

type DragVisibleVertexIndexes = {
  areaIndex: number | 'current';
  indexes: number[];
} | null;

const DRAW_VERTEX_TOUCH_RADIUS = 24;
const DRAW_POINT_MIN_DISTANCE = 18;
const VISIBLE_VERTEX_HANDLE_DISTANCE_METERS = 18;

const getDistanceBetweenCoordinates = (
  firstCoordinate: Coordinate,
  secondCoordinate: Coordinate,
) => {
  const earthRadiusInMeters = 6371000;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const firstLatitude = toRadians(firstCoordinate[1]);
  const secondLatitude = toRadians(secondCoordinate[1]);
  const latitudeDelta = toRadians(secondCoordinate[1] - firstCoordinate[1]);
  const longitudeDelta = toRadians(secondCoordinate[0] - firstCoordinate[0]);

  const haversineValue =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  return (
    earthRadiusInMeters *
    2 *
    Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue))
  );
};

const getVisibleVertexIndexes = (coordinates: Coordinate[]) => {
  if (coordinates.length === 0) return new Set<number>();

  const visibleIndexes = new Set<number>([0]);
  let distanceSinceLastVisibleHandle = 0;

  for (let index = 1; index < coordinates.length; index += 1) {
    distanceSinceLastVisibleHandle += getDistanceBetweenCoordinates(
      coordinates[index - 1],
      coordinates[index],
    );

    if (
      distanceSinceLastVisibleHandle >= VISIBLE_VERTEX_HANDLE_DISTANCE_METERS
    ) {
      visibleIndexes.add(index);
      distanceSinceLastVisibleHandle = 0;
    }
  }

  visibleIndexes.add(coordinates.length - 1);
  return visibleIndexes;
};

export const useMapController = () => {
  const mapRef = useRef<Mapbox.MapView>(null);
  const cameraRef = useRef<Mapbox.Camera>(null);
  const lastDrawScreenPointRef = useRef<{ x: number; y: number } | null>(null);
  const isConvertingTouchRef = useRef(false);
  const isResolvingDrawStartRef = useRef(false);
  const activeVertexDragRef = useRef<ActiveVertexDrag>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [searchedPlaces, setSearchedPlaces] = useState<SearchedPlace[]>([]);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [isTrackingGesture, setIsTrackingGesture] = useState(false);
  const [
    isLocationPermissionModalVisible,
    setIsLocationPermissionModalVisible,
  ] = useState(false);
  const [isRequestingLocationPermission, setIsRequestingLocationPermission] =
    useState(false);
  const [isDrawingArea, setIsDrawingArea] = useState(false);
  const [currentDrawnAreaCoordinates, setCurrentDrawnAreaCoordinates] =
    useState<Coordinate[]>([]);
  const [drawnAreaCoordinateGroups, setDrawnAreaCoordinateGroups] = useState<
    Coordinate[][]
  >([]);
  const [, setDragVisibleVertexIndexes] =
    useState<DragVisibleVertexIndexes>(null);

  const [searchedPlacesListHeight, setSearchedPlacesListHeight] = useState(0);
  const [drawActionsHeight, setDrawActionsHeight] = useState(0);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  const currentDrawnAreaCoordinatesRef = useRef<Coordinate[]>([]);
  const drawnAreaCoordinateGroupsRef = useRef<Coordinate[][]>([]);

  useEffect(() => {
    currentDrawnAreaCoordinatesRef.current = currentDrawnAreaCoordinates;
  }, [currentDrawnAreaCoordinates]);
  useEffect(() => {
    drawnAreaCoordinateGroupsRef.current = drawnAreaCoordinateGroups;
  }, [drawnAreaCoordinateGroups]);

  const clampTouchPointToMap = useCallback(
    (x: number, y: number) => ({
      x: mapSize.width > 0 ? Math.min(Math.max(x, 0), mapSize.width) : x,
      y: mapSize.height > 0 ? Math.min(Math.max(y, 0), mapSize.height) : y,
    }),
    [mapSize],
  );

  const fitWorkspaceInViewport = useCallback(
    (
      updatedPlaces = searchedPlaces,
      activeDrawnCoords = [
        ...drawnAreaCoordinateGroups.flat(),
        ...currentDrawnAreaCoordinates,
      ],
    ) => {
      if (isDrawingArea || activeVertexDragRef.current) return;

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
    [
      isDrawingArea,
      searchedPlaces,
      drawnAreaCoordinateGroups,
      currentDrawnAreaCoordinates,
    ],
  );

  useEffect(() => {
    fitWorkspaceInViewport();
  }, [
    searchedPlaces,
    drawnAreaCoordinateGroups,
    currentDrawnAreaCoordinates,
    fitWorkspaceInViewport,
  ]);

  const updateCurrentLocation = useCallback(async (coords: Coordinate) => {
    setUserLocation(coords);
    cameraRef.current?.setCamera({
      centerCoordinate: coords,
      zoomLevel: 17,
      animationDuration: 1000,
    });

    try {
      const response = await geocodingClient
        .reverseGeocode({ query: coords, limit: 1 })
        .send();
      setCurrentAddress(
        response.body?.features?.[0]?.place_name || 'Current Location',
      );
    } catch {
      setCurrentAddress('Current Location');
    }
  }, []);

  const fetchLocation = useCallback(async () => {
    setIsRequestingLocationPermission(true);

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission Denied',
          'Location permissions are required to center the map.',
        );
        setCurrentAddress('Location permission required');
        setIsLocationPermissionModalVisible(true);
        setIsRequestingLocationPermission(false);
        return;
      }
    } else if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
    }

    Geolocation.getCurrentPosition(
      async position => {
        const { longitude, latitude } = position.coords;
        try {
          await updateCurrentLocation([longitude, latitude]);
          setIsLocationPermissionModalVisible(false);
        } finally {
          setIsRequestingLocationPermission(false);
        }
      },
      () => {
        Geolocation.getCurrentPosition(
          async fallbackPosition => {
            const { longitude, latitude } = fallbackPosition.coords;
            try {
              await updateCurrentLocation([longitude, latitude]);
              setIsLocationPermissionModalVisible(false);
            } finally {
              setIsRequestingLocationPermission(false);
            }
          },
          () => {
            Alert.alert(
              'Location Error',
              'Device timeout. Please check your GPS signal settings.',
            );
            setCurrentAddress('Unable to fetch current address');
            setIsLocationPermissionModalVisible(true);
            setIsRequestingLocationPermission(false);
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 3600000 },
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 },
    );
  }, [updateCurrentLocation]);

  const requestLocationAccess = useCallback(async () => {
    try {
      await fetchLocation();
    } catch {
      setIsLocationPermissionModalVisible(true);
      setIsRequestingLocationPermission(false);
    }
  }, [fetchLocation]);

  useEffect(() => {
    const prepareLocation = async () => {
      if (Platform.OS === 'android') {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (hasPermission) {
          fetchLocation();
          return;
        }
      }
      setIsLocationPermissionModalVisible(true);
    };
    prepareLocation();
  }, [fetchLocation]);

  const executeSearch = async (queryText: string) => {
    if (!queryText.trim()) {
      setSearchResults([]);
      setIsSearchingLocation(false);
      return;
    }
    setIsSearchingLocation(true);
    try {
      const response = await geocodingClient
        .forwardGeocode({
          query: queryText,
          limit: 10,
          types: ['postcode', 'place', 'locality', 'region', 'address'],
        })
        .send();
      setSearchResults(response.body?.features ?? []);
    } finally {
      setIsSearchingLocation(false);
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

  const appendCoordinateFromTouch = useCallback(
    async (x: number, y: number) => {
      if (!mapRef.current || isConvertingTouchRef.current) return;
      const screenPoint = { x, y };
      const mapPoint = clampTouchPointToMap(x, y);

      if (
        lastDrawScreenPointRef.current &&
        getDistanceBetweenScreenPoints(
          lastDrawScreenPointRef.current,
          screenPoint,
        ) < DRAW_POINT_MIN_DISTANCE
      )
        return;
      isConvertingTouchRef.current = true;

      try {
        const coordinate = await mapRef.current.getCoordinateFromView([
          mapPoint.x,
          mapPoint.y,
        ]);
        if (Array.isArray(coordinate) && coordinate.length >= 2) {
          setCurrentDrawnAreaCoordinates(prev => [
            ...prev,
            [coordinate[0], coordinate[1]] as Coordinate,
          ]);
        }
        lastDrawScreenPointRef.current = screenPoint;
      } finally {
        isConvertingTouchRef.current = false;
      }
    },
    [clampTouchPointToMap],
  );

  const getNearestDrawableVertex = useCallback(
    async (x: number, y: number): Promise<ActiveVertexDrag> => {
      if (!mapRef.current) return null;

      let nearestVertex: ActiveVertexDrag = null;
      let nearestDistance = DRAW_VERTEX_TOUCH_RADIUS;

      const drawableAreas = [
        ...drawnAreaCoordinateGroupsRef.current.map((coordinates, index) => ({
          areaIndex: index,
          coordinates,
        })),
        {
          areaIndex: 'current' as const,
          coordinates: currentDrawnAreaCoordinatesRef.current,
        },
      ];

      for (const area of drawableAreas) {
        const visibleVertexIndexes = getVisibleVertexIndexes(area.coordinates);

        for (
          let coordinateIndex = 0;
          coordinateIndex < area.coordinates.length;
          coordinateIndex += 1
        ) {
          if (!visibleVertexIndexes.has(coordinateIndex)) continue;

          const coordinate = area.coordinates[coordinateIndex];
          const vertexPoint = await mapRef.current.getPointInView(coordinate);

          if (!Array.isArray(vertexPoint) || vertexPoint.length < 2) continue;

          const distance = getDistanceBetweenScreenPoints(
            { x, y },
            { x: vertexPoint[0], y: vertexPoint[1] },
          );

          if (distance <= nearestDistance) {
            nearestDistance = distance;
            nearestVertex = { areaIndex: area.areaIndex, coordinateIndex };
          }
        }
      }
      return nearestVertex;
    },
    [],
  );

  const updateDraggedVertexFromTouch = useCallback(
    async (x: number, y: number) => {
      if (!mapRef.current || isConvertingTouchRef.current) return;
      const activeVertex = activeVertexDragRef.current;
      if (!activeVertex) return;

      isConvertingTouchRef.current = true;

      try {
        const mapPoint = clampTouchPointToMap(x, y);
        const coordinate = await mapRef.current.getCoordinateFromView([
          mapPoint.x,
          mapPoint.y,
        ]);
        if (!Array.isArray(coordinate) || coordinate.length < 2) return;

        const nextCoordinate: Coordinate = [coordinate[0], coordinate[1]];

        if (activeVertex.areaIndex === 'current') {
          setCurrentDrawnAreaCoordinates(prev =>
            prev.map((item, index) =>
              index === activeVertex.coordinateIndex ? nextCoordinate : item,
            ),
          );
          return;
        }

        setDrawnAreaCoordinateGroups(prev =>
          prev.map((areaCoordinates, areaIndex) =>
            areaIndex === activeVertex.areaIndex
              ? areaCoordinates.map((item, coordinateIndex) =>
                  coordinateIndex === activeVertex.coordinateIndex
                    ? nextCoordinate
                    : item,
                )
              : areaCoordinates,
          ),
        );
      } finally {
        isConvertingTouchRef.current = false;
      }
    },
    [clampTouchPointToMap],
  );

  const handleDrawGestureStart = useCallback(
    async (x: number, y: number) => {
      isResolvingDrawStartRef.current = true;
      try {
        const nearestVertex = await getNearestDrawableVertex(x, y);
        if (nearestVertex) {
          const areaCoordinates =
            nearestVertex.areaIndex === 'current'
              ? currentDrawnAreaCoordinatesRef.current
              : drawnAreaCoordinateGroupsRef.current[nearestVertex.areaIndex] ??
                [];
          const visibleIndexes = getVisibleVertexIndexes(areaCoordinates);
          visibleIndexes.add(nearestVertex.coordinateIndex);

          activeVertexDragRef.current = nearestVertex;
          setDragVisibleVertexIndexes({
            areaIndex: nearestVertex.areaIndex,
            indexes: Array.from(visibleIndexes),
          });
          await updateDraggedVertexFromTouch(x, y);
          return;
        }
        await appendCoordinateFromTouch(x, y);
      } finally {
        isResolvingDrawStartRef.current = false;
      }
    },
    [
      appendCoordinateFromTouch,
      getNearestDrawableVertex,
      updateDraggedVertexFromTouch,
    ],
  );

const drawPanResponder = useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => isDrawingArea,
      onStartShouldSetPanResponderCapture: () => isDrawingArea,
      onMoveShouldSetPanResponder: () => isDrawingArea,
      onMoveShouldSetPanResponderCapture: () => isDrawingArea,
      onPanResponderGrant: e => {
        setIsTrackingGesture(true);
        handleDrawGestureStart(e.nativeEvent.pageX, e.nativeEvent.pageY);
      },
      onPanResponderMove: e => {
        if (isResolvingDrawStartRef.current) return;
        if (activeVertexDragRef.current) {
          updateDraggedVertexFromTouch(e.nativeEvent.pageX, e.nativeEvent.pageY);
          return;
        }
        appendCoordinateFromTouch(e.nativeEvent.pageX, e.nativeEvent.pageY);
      },
      onPanResponderRelease: () => {
        setIsTrackingGesture(false);
        if (activeVertexDragRef.current) {
          activeVertexDragRef.current = null;
          setDragVisibleVertexIndexes(null);
          lastDrawScreenPointRef.current = null;
          fitWorkspaceInViewport(searchedPlaces, [...drawnAreaCoordinateGroupsRef.current.flat(), ...currentDrawnAreaCoordinatesRef.current]);
          return;
        }

        const completedArea = currentDrawnAreaCoordinatesRef.current;
        if (completedArea.length >= 3) {
          setDrawnAreaCoordinateGroups(prev => [...prev, completedArea]);
          setCurrentDrawnAreaCoordinates([]);
        }
        lastDrawScreenPointRef.current = null;
        fitWorkspaceInViewport(searchedPlaces, [...drawnAreaCoordinateGroupsRef.current.flat(), ...completedArea]);
      },
      onPanResponderTerminate: () => {
        setIsTrackingGesture(false);
        activeVertexDragRef.current = null;
        setDragVisibleVertexIndexes(null);
        setCurrentDrawnAreaCoordinates([]);
        lastDrawScreenPointRef.current = null;
      },
    }), [appendCoordinateFromTouch, handleDrawGestureStart, isDrawingArea, searchedPlaces, fitWorkspaceInViewport, updateDraggedVertexFromTouch]);

  const handleMapLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setMapSize({ width, height });
  };

  const handleDrawActionsLayout = (event: LayoutChangeEvent) => {
    setDrawActionsHeight(event.nativeEvent.layout.height);
  };

  const handleClearDrawnArea = () => {
    setCurrentDrawnAreaCoordinates([]);
    setDrawnAreaCoordinateGroups([]);
    setDragVisibleVertexIndexes(null);
  };

  const handleCloseDrawMode = () => {
    setCurrentDrawnAreaCoordinates([]);
    setDrawnAreaCoordinateGroups([]);
    setDragVisibleVertexIndexes(null);
    setIsDrawingArea(false);
  };

  const handleApplyDrawnArea = () => {
    if (drawnAreaCoordinateGroups.length === 0) return;

    const existingDrawnAreas = searchedPlaces.filter(place =>
      place.id.startsWith('drawn-area-'),
    ).length;
    const drawnAreas: SearchedPlace[] = drawnAreaCoordinateGroups.map(
      (areaCoordinates, index) => {
        const areaNumber = existingDrawnAreas + index + 1;
        return {
          id: `drawn-area-${Date.now()}-${index}`,
          coordinates: getCoordinatesCenter(areaCoordinates),
          placeName: `Custom Boundaries ${areaNumber}`,
          displayName: `Custom drawn area ${areaNumber}`,
          geometry: {
            type: 'Polygon',
            coordinates: [closeCoordinatesRing(areaCoordinates)],
          },
        };
      },
    );

    setSearchedPlaces(prev => [...prev, ...drawnAreas]);
    setCurrentDrawnAreaCoordinates([]);
    setDrawnAreaCoordinateGroups([]);
    setDragVisibleVertexIndexes(null);
    setIsDrawingArea(false);
  };

  return {
    mapRef,
    cameraRef,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearchingLocation,
    searchedPlaces,
    setSearchedPlaces,
    userLocation,
    currentAddress,
    isLocationPermissionModalVisible,
    isRequestingLocationPermission,
    requestLocationAccess,
    isDrawingArea,
    setIsDrawingArea,
    currentDrawnAreaCoordinates,
    drawnAreaCoordinateGroups,
    isTrackingGesture,
    drawPanResponder,
    executeSearch,
    handleSelectLocation,
    fitWorkspaceInViewport,
    handleMapLayout,
    searchedPlacesListHeight,
    setSearchedPlacesListHeight,
    drawActionsHeight,
    handleDrawActionsLayout,
    handleClearDrawnArea,
    handleCloseDrawMode,
    handleApplyDrawnArea,
  };
};
