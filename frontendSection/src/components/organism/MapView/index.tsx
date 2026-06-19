import React, { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import Mapbox from '@rnmapbox/maps';
import LinearGradient from 'react-native-linear-gradient';

import CustomText from '@src/components/atom/CustomText';
import { SearchBar } from './components/SearchBar';
import { MapMarkers } from './components/MapMarkers';
import { SearchedPlacesList } from './components/SearchedPlacesList';
import DrawablePolyline from './components/DrawablePolyline';
import AreaBoundaryOverlay from './components/AreaBoundaryOverlay';
import { LocationSearchModal } from './components/LocationSearchModal';
import { LocationPermissionModal } from './components/LocationPermissionModal';
import { BackButtonIcon, TapIcon, TargetIcon } from '@src/assets/icons';
import { createStyles } from './styles';
import { colors } from '@src/utils/colors';
import {
  DRAW_ACTION_GAP,
  EXTERNAL_AREA_DATA,
  standardLocationsArray,
} from './constants';
import { useMapController } from './useMapController';
import { Coordinate, SearchedPlace } from './types';
import { CustomMapMarkers } from './components/CustomMapMarkers';

const MAX_PRECISION = 5;
const MAX_COORDINATES = 30;

const getPerpendicularDistance = (
  point: Coordinate,
  lineStart: Coordinate,
  lineEnd: Coordinate,
): number => {
  const [x, y] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;

  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
  }

  const numerator = Math.abs(
    dy * x - dx * y + x2 * y1 - y2 * x1,
  );

  const denominator = Math.sqrt(dx * dx + dy * dy);

  return numerator / denominator;
};

const douglasPeucker = (
  coordinates: Coordinate[],
  tolerance: number,
): Coordinate[] => {
  if (coordinates.length <= 2) {
    return coordinates;
  }

  let maxDistance = 0;
  let maxIndex = 0;

  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];

  for (let i = 1; i < coordinates.length - 1; i++) {
    const distance = getPerpendicularDistance(
      coordinates[i],
      first,
      last,
    );

    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }

  if (maxDistance > tolerance) {
    const left = douglasPeucker(
      coordinates.slice(0, maxIndex + 1),
      tolerance,
    );

    const right = douglasPeucker(
      coordinates.slice(maxIndex),
      tolerance,
    );

    return [...left.slice(0, -1), ...right];
  }

  return [first, last];
};

// const MAX_PRECISION = 5;
// const MAX_COORDINATES = 300;

export const simplifyAreaCoordinates = (
  coordinates: Coordinate[],
): Coordinate[] => {
  if (coordinates.length <= MAX_COORDINATES) {
    return coordinates;
  }

  let tolerance = 0.00001;
  let simplified = coordinates;

  while (simplified.length > MAX_COORDINATES) {
    tolerance *= 1.5;
    simplified = douglasPeucker(coordinates, tolerance);
  }

  return simplified.map(
    ([lng, lat]) =>
      [
        Number(lng.toFixed(MAX_PRECISION)),
        Number(lat.toFixed(MAX_PRECISION)),
      ] as Coordinate,
  );
};

// const AREA_COORDINATE_SKIP_FACTOR = 5;

const collectGeometryCoordinates = (
  geometry: SearchedPlace['geometry'],
) => {
  let rawCoordinates: Coordinate[] = [];

  if (geometry?.type === 'Polygon') {
    rawCoordinates = geometry.coordinates?.[0] ?? [];
  } else if (geometry?.type === 'MultiPolygon') {
    rawCoordinates = geometry.coordinates?.[0]?.[0] ?? [];
  }

  if (rawCoordinates.length === 0) {
    return [];
  }

  return simplifyAreaCoordinates(rawCoordinates);
};

const MapViewComponent = () => {
  const dynamicStyles = createStyles();
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const {
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
    searchedPlacesListHeight,
    setSearchedPlacesListHeight,
    drawActionsHeight,
    handleDrawActionsLayout,
    handleClearDrawnArea,
    handleCloseDrawMode,
    handleApplyDrawnArea,
  } = useMapController();

  const activeBottomSheetHeight = isDrawingArea
    ? drawActionsHeight
    : searchedPlacesListHeight;
  const floatingButtonsBottom = activeBottomSheetHeight + DRAW_ACTION_GAP;

  const handleSubmitSelectedAreas = () => {
    const selectedAreaCoordinates = searchedPlaces.map(place => ({
      id: place.id,
      name: place.placeName,
      center: place.coordinates,
      area: collectGeometryCoordinates(place.geometry),
    }));

    console.log('Selected area latitude/longitude:', selectedAreaCoordinates);
  };

  return (
    <View style={dynamicStyles.page}>
      <View style={dynamicStyles.container2}>
        <Mapbox.MapView ref={mapRef} style={dynamicStyles.map}>
          <Mapbox.Camera ref={cameraRef} />

          <CustomMapMarkers
            locations={standardLocationsArray}
            onMarkerPress={loc =>
              console.log('Single Marker Price clicked:', loc.price)
            }
          />
          <AreaBoundaryOverlay
            coordinates={EXTERNAL_AREA_DATA}
            fillColor="#133de6ff"
            strokeColor="#133de6b0"
          />

          <MapMarkers
            places={searchedPlaces}
            userLocation={userLocation}
            currentAddress={currentAddress}
          />
          {drawnAreaCoordinateGroups.map((areaCoordinates, index) => (
            <DrawablePolyline
              key={`drawn-area-${index}`}
              coordinates={areaCoordinates}
              sourceId={`drawn-area-source-${index}`}
              lineLayerId={`drawn-area-line-${index}`}
              fillLayerId={`drawn-area-fill-${index}`}
              vertexLayerId={`drawn-area-vertices-${index}`}
              isDrawingActive={false}
            />
          ))}
          <DrawablePolyline
            coordinates={currentDrawnAreaCoordinates}
            sourceId="current-drawn-area-source"
            lineLayerId="current-drawn-area-line"
            fillLayerId="current-drawn-area-fill"
            vertexLayerId="current-drawn-area-vertices"
            isDrawingActive={isTrackingGesture}
          />
        </Mapbox.MapView>

        <View
          pointerEvents={isDrawingArea ? 'auto' : 'none'}
          style={dynamicStyles.drawTouchOverlay}
          {...drawPanResponder.panHandlers}
        />

        {isDrawingArea ? (
          <View style={dynamicStyles.drawHeader}>
            <TouchableOpacity
              style={dynamicStyles.drawBackButton}
              onPress={handleCloseDrawMode}
              activeOpacity={0.8}
            >
              <Image
                source={BackButtonIcon}
                style={dynamicStyles.drawBackIcon}
              />
            </TouchableOpacity>
            <CustomText style={dynamicStyles.drawHeaderTitle}>Draw</CustomText>
            <View style={dynamicStyles.drawHeaderSpacer} />
          </View>
        ) : (
          <View style={dynamicStyles.topControlsRow}>
            <View style={dynamicStyles.searchBarContainer}>
              <SearchBar
                searchQuery={searchQuery}
                onPress={() => setIsSearchModalVisible(true)}
              />
            </View>
          </View>
        )}

        <LocationSearchModal
          visible={isSearchModalVisible}
          searchQuery={searchQuery}
          searchResults={searchResults}
          isSearching={isSearchingLocation}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={() => executeSearch(searchQuery)}
          onSelectLocation={handleSelectLocation}
          onClose={() => setIsSearchModalVisible(false)}
        />

        <LocationPermissionModal
          visible={isLocationPermissionModalVisible}
          isLoading={isRequestingLocationPermission}
          onAllowAccess={requestLocationAccess}
        />

        {isDrawingArea ? (
          <View
            style={dynamicStyles.drawActionSheet}
            onLayout={handleDrawActionsLayout}
          >
            <TouchableOpacity
              style={dynamicStyles.drawClearButton}
              onPress={handleClearDrawnArea}
              activeOpacity={0.8}
            >
              <CustomText style={dynamicStyles.drawClearButtonText}>
                Clear
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                dynamicStyles.drawApplyButton,
                drawnAreaCoordinateGroups.length === 0 &&
                  dynamicStyles.drawApplyButtonDisabled,
              ]}
              onPress={handleApplyDrawnArea}
              activeOpacity={0.85}
              disabled={drawnAreaCoordinateGroups.length === 0}
            >
              <LinearGradient
                colors={
                  drawnAreaCoordinateGroups.length === 0
                    ? ['#AAB2D8', '#AAB2D8']
                    : ['#59C3E6', '#3B4AA3']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={dynamicStyles.drawApplyGradient}
              >
                <CustomText style={dynamicStyles.drawApplyButtonText}>
                  Apply
                </CustomText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <SearchedPlacesList
            places={searchedPlaces}
            onRemovePlace={id =>
              setSearchedPlaces(prev => prev.filter(p => p.id !== id))
            }
            onSelectPlace={place =>
              cameraRef.current?.setCamera({
                centerCoordinate: place.coordinates,
                zoomLevel: 5.3,
                animationDuration: 1000,
              })
            }
            onHeightChange={setSearchedPlacesListHeight}
            onSubmitPress={handleSubmitSelectedAreas}
          />
        )}
        {!isDrawingArea && (
          <View
            style={[
              dynamicStyles.floatingUtilityButtons,
              { bottom: floatingButtonsBottom },
            ]}
          >
            <TouchableOpacity
              style={dynamicStyles.drawAreaButton}
              onPress={() => setIsDrawingArea(true)}
              activeOpacity={0.8}
            >
              <Image
                source={TapIcon}
                tintColor={colors.black}
                style={dynamicStyles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={dynamicStyles.recenterButton}
              onPress={() => fitWorkspaceInViewport()}
              activeOpacity={0.8}
            >
              <Image
                source={TargetIcon}
                tintColor={colors.black}
                style={dynamicStyles.icon}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default MapViewComponent;
