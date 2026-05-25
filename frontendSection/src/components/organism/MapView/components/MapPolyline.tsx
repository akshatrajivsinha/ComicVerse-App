import React from 'react';
import Mapbox from '@rnmapbox/maps';

interface MapPolylineProps {
  coordinates: [number, number][];
}

export const MapPolyline: React.FC<MapPolylineProps> = ({
  coordinates,
}) => {
  if (coordinates.length < 2) return null;

  return (
    <Mapbox.ShapeSource
      id="routeSource"
      shape={{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates,
        },
      }}
    >
      <Mapbox.LineLayer
        id="routeLayer"
        style={lineLayerStyle as any}
      />
    </Mapbox.ShapeSource>
  );
};

const lineLayerStyle = {
  lineColor: '#007AFF',
  lineWidth: 5,
  lineCap: 'round',
  lineJoin: 'round',
};