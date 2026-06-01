// index.tsx
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Mapbox from '@rnmapbox/maps';

// Components & Infrastructure
import CustomText from '@src/components/atom/CustomText';
import BackButton from '@src/components/atom/BackButton';
import { SearchBar } from './components/SearchBar';
import { MapMarkers } from './components/MapMarkers';
import { SearchedPlacesList } from './components/SearchedPlacesList';
import DrawablePolyline from './components/DrawablePolyline';
import AreaBoundaryOverlay from './components/AreaBoundaryOverlay';

import { TargetIcon } from '@src/assets/icons';
import { createStyles } from './styles';
import { colors, useColors } from '@src/utils/colors';
import { EXTERNAL_AREA_DATA } from './constants';
import { useMapController } from './useMapController';

const MapViewComponent = () => {
  const themeColors = useColors();
  const dynamicStyles = createStyles(themeColors);

  // Consume our extracted functionality layer
  const {
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
  } = useMapController();

  return (
    <View style={dynamicStyles.page}>
      <View style={dynamicStyles.container2}>
        {/* MAP EMBED LAYER */}
        <Mapbox.MapView
          ref={mapRef}
          style={dynamicStyles.map}
          onPress={handleMapPress}
        >
          <Mapbox.Camera ref={cameraRef} />

          <AreaBoundaryOverlay
            coordinates={EXTERNAL_AREA_DATA}
            fillColor="#133de6ff"
            strokeColor="#133de6b0"
          />

          {/* {searchedPlaces.map(
            place =>
              place.geometry && (
                <Mapbox.ShapeSource
                  key={`shape-${place.id}`}
                  id={`source-${place.id}`}
                  shape={place.geometry}
                >
                  <Mapbox.FillLayer
                    id={`fill-${place.id}`}
                    style={{
                      fillColor: '#007AFF',
                      fillOpacity: 0.15,
                      fillAntialias: true,
                    }}
                  />
                  <Mapbox.LineLayer
                    id={`line-${place.id}`}
                    style={{
                      lineWidth: 3,
                      lineColor: '#007AFF',
                      lineOpacity: 0.85,
                      lineDasharray: [4, 3],
                    }}
                  />
                </Mapbox.ShapeSource>
              ),
          )} */}

          <MapMarkers
            places={searchedPlaces}
            userLocation={userLocation}
            currentAddress={currentAddress}
          />
          <DrawablePolyline coordinates={drawnAreaCoordinates} />
        </Mapbox.MapView>

        {/* TOUCH INTERCEPTOR LAYER */}
        <View
          pointerEvents={isDrawingArea ? 'auto' : 'none'}
          style={dynamicStyles.drawTouchOverlay}
          {...drawPanResponder.panHandlers}
        />

        {/* FLOATING HEADER HEADER ELEMENTS */}
        <View style={dynamicStyles.topControlsRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={dynamicStyles.permanentSearchWrapper}>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchSubmit={() => executeSearch(searchQuery)}
              searchResults={searchResults}
              onSelectLocation={handleSelectLocation}
              showClearButton={
                searchedPlaces.length > 0 || drawnAreaCoordinates.length > 0
              }
              onClearMap={handleClearMap}
            />
          </View>
        </View>

        {/* RECENT HISTORIES LAYER */}
        <SearchedPlacesList
          places={searchedPlaces}
          onRemovePlace={id =>
            setSearchedPlaces(prev => prev.filter(p => p.id !== id))
          }
          onSelectPlace={place =>
            cameraRef.current?.setCamera({
              centerCoordinate: place.coordinates,
              zoomLevel: 12,
              animationDuration: 1000,
            })
          }
        />

        {/* FLOATING ACTION UTILITY STACK */}
        <View style={dynamicStyles.bottomControlsStack}>
          <TouchableOpacity
            style={dynamicStyles.recenterButton}
            onPress={() => fitWorkspaceInViewport()}
            activeOpacity={0.8}
          >
            <Image
              source={TargetIcon}
              tintColor={colors.text}
              style={dynamicStyles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              dynamicStyles.drawAreaButton,
              isDrawingArea && dynamicStyles.drawAreaButtonActive,
            ]}
            onPress={() => setIsDrawingArea(!isDrawingArea)}
            activeOpacity={0.8}
          >
            <CustomText style={dynamicStyles.drawAreaButtonText}>
              {isDrawingArea ? 'Stop' : 'Draw'}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MapViewComponent;
