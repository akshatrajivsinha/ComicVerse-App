import React from 'react';
import Mapbox from '@rnmapbox/maps';
import { colors } from '@src/utils/colors';
import { CustomMapMarkersProps } from '../types';

export const CustomMapMarkers: React.FC<CustomMapMarkersProps> = ({
  locations,
  onMarkerPress,
}) => {
  const featureCollection: GeoJSON.FeatureCollection<GeoJSON.Point> = {
    type: 'FeatureCollection',
    features: locations.map(loc => ({
      type: 'Feature',
      id: Number(loc.id) || loc.id,
      geometry: {
        type: 'Point',
        coordinates: [loc.longitude, loc.latitude],
      },
      properties: {
        id: loc.id,
        price: loc.price || '',
      },
    })),
  };

  const handleShapePress = (event: any) => {
    const feature = event.features?.[0];

    if (!feature) {
      return;
    }

    if (!feature.properties?.cluster) {
      onMarkerPress?.(feature.properties);
    }
  };

  return (
    <Mapbox.ShapeSource
      id="clustered-source"
      shape={featureCollection}
      cluster
      clusterRadius={50}
      clusterMaxZoomLevel={14}
      onPress={handleShapePress}
    >
      <Mapbox.CircleLayer
        id="cluster-circle-layer"
        filter={['has', 'point_count']}
        style={styles.clusterCircle}
      />

      <Mapbox.SymbolLayer
        id="cluster-count-layer"
        filter={['has', 'point_count']}
        style={styles.clusterCount as any}
      />

      <Mapbox.CircleLayer
        id="single-marker-dot-blue"
        filter={['!', ['has', 'point_count']]}
        style={styles.singleMarkerDotBlue}
      />

      <Mapbox.CircleLayer
        id="single-marker-dot-shadow"
        filter={['!', ['has', 'point_count']]}
        style={styles.singleMarkerDotShadow}
      />

      <Mapbox.SymbolLayer
        id="single-marker-price-pill"
        filter={['!', ['has', 'point_count']]}
        style={styles.singleMarkerPricePill as any}
      />
    </Mapbox.ShapeSource>
  );
};

export const styles = {
  clusterCircle: {
    circleRadius: 18,
    circleColor: colors.primary || '#3B4AA3',
    circleStrokeWidth: 2,
    circleStrokeColor: '#FFFFFF',
  },

  clusterCount: {
    textField: ['get', 'point_count'],
    textSize: 12,
    textColor: '#FFFFFF',
    textAllowOverlap: true,
    textIgnorePlacement: true,
  },

  singleMarkerDotBlue: {
    circleRadius: 8,
    circleColor: '#1A61FF',
    circleStrokeWidth: 3,
    circleStrokeColor: '#FFFFFF',
  },

  singleMarkerDotShadow: {
    circleRadius: 11,
    circleColor: '#FFFFFF',
    circleOpacity: 0.15,
  },

  singleMarkerPricePill: {
    textField: ['get', 'price'],
    textSize: 15,
    textColor: '#1E293B',
    textFont: ['Arial Unicode MS Regular'],
    textAnchor: 'bottom',
    textOffset: [0, -0.8],
    textAllowOverlap: true,
    textIgnorePlacement: true,
  },
};
