import React from 'react';
import Mapbox from '@rnmapbox/maps';
import { Coordinate } from '../constants';

interface AreaBoundaryOverlayProps {
  coordinates: Coordinate[];
  visible?: boolean;
  fillColor?: string;
  strokeColor?: string;
}

const AreaBoundaryOverlay: React.FC<AreaBoundaryOverlayProps> = ({
  coordinates,
  visible = true,
  fillColor = '#FF9500', // Default Orange Fill
  strokeColor = '#FF9500', // Default Orange Line
}) => {
  if (!visible || !coordinates || coordinates.length === 0) return null;

  // Ensure the polygon is explicitly closed (GeoJSON requirements)
  const firstPoint = coordinates[0];
  const lastPoint = coordinates[coordinates.length - 1];
  const closedCoordinates = [...coordinates];

  if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
    closedCoordinates.push(firstPoint);
  }

  const geoJsonStructure: any = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [closedCoordinates],
    },
    properties: {},
  };

  return (
    <Mapbox.ShapeSource id="customAreaBoundarySource" shape={geoJsonStructure}>
      <Mapbox.FillLayer
        id="customAreaBoundaryFill"
        style={{
          fillColor: fillColor,
          fillOpacity: 0.2,
          fillAntialias: true,
        }}
      />
      <Mapbox.LineLayer
        id="customAreaBoundaryLine"
        style={{
          lineWidth: 2,
          lineColor: strokeColor,
          lineOpacity: 0.85,
          lineDasharray: [2, 2], // Dashed border styling
        }}
      />
    </Mapbox.ShapeSource>
  );
};

export default React.memo(AreaBoundaryOverlay);
