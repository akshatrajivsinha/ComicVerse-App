import React from 'react';
import { View, StyleSheet } from 'react-native';
import Mapbox from '@rnmapbox/maps';

export interface SearchedPlace {
  id: string;
  coordinates: [number, number];
  placeName: string;
  geometry?: GeoJSON.Geometry;
}

interface MapMarkersProps {
  places: SearchedPlace[];
  userLocation: [number, number] | null;
  currentAddress: string;
}

export const MapMarkers: React.FC<MapMarkersProps> = ({
  places,
  userLocation,
  currentAddress,
}) => {
  return (
    <>
      {/* 1. User Current Location Pin */}
      {userLocation && (
        <Mapbox.PointAnnotation
          id="user-current-loc"
          coordinate={userLocation}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.outerShadyCircle}>
            <View
              style={[styles.innerCoreCircle, { backgroundColor: '#1ebe53ff' }]}
            >
              <View style={styles.centerDot} />
            </View>
          </View>
          <Mapbox.Callout title={currentAddress || 'My Current Location'} />
        </Mapbox.PointAnnotation>
      )}

      {/* 2. Historical Searched Location Pins & Layer Boundaries */}
      {places.map(place => (
        <React.Fragment key={place.id}>
          {/* Visual Boundary Layer Overlays */}
          {place.geometry && (
            <Mapbox.ShapeSource
              id={`source-boundary-${place.id}`}
              shape={place.geometry}
            >
              <Mapbox.FillLayer
                id={`fill-layer-${place.id}`}
                style={{
                  fillColor: '#464748ff',
                  fillOpacity: 0.2,
                  fillAntialias: true,
                }}
              />
              <Mapbox.LineLayer
                id={`line-layer-${place.id}`}
                style={{
                  lineWidth: 2,
                  lineColor: '#464748ff',
                  lineOpacity: 0.85,
                  lineDasharray: [2, 4],
                }}
              />
              {/* <Mapbox.CircleLayer
                id={`circle-layer-${place.id}`}
                style={{
                  circleRadius: 3.5,
                  circleColor: '#020202ff',
                  circleOpacity: 0.7,
                  lineDasharray: [2, 3],
                }}
              /> */}
            </Mapbox.ShapeSource>
          )}

          {/* Coordinate Marker Point */}
          <Mapbox.PointAnnotation
            id={`annotation-${place.id}`}
            coordinate={place.coordinates}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.outerShadyCircle}>
              <View
                style={[styles.innerCoreCircle, { backgroundColor: '#FF3B30' }]}
              >
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
  centerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
});
