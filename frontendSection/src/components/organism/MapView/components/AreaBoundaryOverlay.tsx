import React from 'react';
import Mapbox from '@rnmapbox/maps';

interface AreaBoundaryOverlayProps {
  coordinates: [number, number][];
  visible?: boolean;
  fillColor?: string;
  strokeColor?: string;
}

const AreaBoundaryOverlay: React.FC<AreaBoundaryOverlayProps> = ({
  coordinates,
  visible = true,
  fillColor = '#FF9500',
  strokeColor = '#FF9500',
}) => {
  if (!visible || !coordinates || coordinates.length === 0) return null;

  const firstPoint = coordinates[0];
  const lastPoint = coordinates[coordinates.length - 1];
  const closedCoordinates = [...coordinates];

  if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
    closedCoordinates.push(firstPoint);
  }

  const geoJsonStructure: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [closedCoordinates] },
    properties: {},
  };

  const layerStyles = {
    fill: { fillColor, fillOpacity: 0.2, fillAntialias: true },
    line: {
      lineWidth: 2,
      lineColor: strokeColor,
      lineOpacity: 0.85,
      lineDasharray: [2, 2],
    },
  };

  return (
    <Mapbox.ShapeSource id="customAreaBoundarySource" shape={geoJsonStructure}>
      <Mapbox.FillLayer id="customAreaBoundaryFill" style={layerStyles.fill} />
      <Mapbox.LineLayer id="customAreaBoundaryLine" style={layerStyles.line} />
    </Mapbox.ShapeSource>
  );
};

export default React.memo(AreaBoundaryOverlay);
