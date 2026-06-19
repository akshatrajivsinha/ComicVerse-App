import React from 'react';
import { View, StyleSheet } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { MapMarkersProps } from '../types';

export const MapMarkers: React.FC<MapMarkersProps> = ({
  places,
  userLocation,
  currentAddress,
}) => {
  return (
    <>
      {userLocation && (
        <Mapbox.PointAnnotation
          id="user-current-loc"
          coordinate={userLocation}
          anchor={MAPBOX_ANCHOR}
        >
          <View style={styles.outerShadyCircle}>
            <View style={[styles.innerCoreCircle, styles.userLocationBg]}>
              <View style={styles.centerDot} />
            </View>
          </View>
          <Mapbox.Callout title={currentAddress || 'My Current Location'} />
        </Mapbox.PointAnnotation>
      )}

      {places.map(place => (
        <React.Fragment key={place.id}>
          {place.geometry && (
            <Mapbox.ShapeSource
              id={`source-boundary-${place.id}`}
              shape={place.geometry}
            >
              <Mapbox.FillLayer
                id={`fill-layer-${place.id}`}
                style={layerStyles.boundaryFill}
              />
              <Mapbox.LineLayer
                id={`line-layer-${place.id}`}
                style={layerStyles.boundaryLine}
              />
            </Mapbox.ShapeSource>
          )}

          <Mapbox.PointAnnotation
            id={`annotation-${place.id}`}
            coordinate={place.coordinates}
            anchor={MAPBOX_ANCHOR}
          >
            <View style={styles.outerShadyCircle}>
              <View style={[styles.innerCoreCircle, styles.searchedPlaceBg]}>
                <View style={styles.centerDot} />
              </View>
            </View>
            <Mapbox.Callout title={place.placeName} />
          </Mapbox.PointAnnotation>
        </React.Fragment>
      ))}
    </>
  );
};

const MAPBOX_ANCHOR = { x: 0.5, y: 0.5 };

const layerStyles = {
  boundaryFill: {
    fillColor: '#464748ff',
    fillOpacity: 0.2,
    fillAntialias: true,
  },
  boundaryLine: {
    lineWidth: 3,
    lineColor: '#566febff',
    lineDasharray: [1, 0],
  },
};

const styles = StyleSheet.create({
  outerShadyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(69, 67, 67, 0.52)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 4,
  },
  innerCoreCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userLocationBg: {
    backgroundColor: '#1ebe53ff',
  },
  searchedPlaceBg: {
    backgroundColor: '#FF3B30',
  },
  centerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
});
