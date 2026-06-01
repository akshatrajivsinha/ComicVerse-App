import React, { memo, useMemo } from 'react';
import Mapbox, {
  FillLayerStyle,
  LineLayerStyle,
} from '@rnmapbox/maps';

type Coordinate = [number, number];

type DrawablePolylineProps = {
  coordinates: Coordinate[];
  sourceId?: string;
  lineLayerId?: string;
  fillLayerId?: string;
  lineColor?: string;
  lineWidth?: number;
  fillColor?: string;
  fillOpacity?: number;
};

// Closes the polygon loop safely
const closeRing = (coordinates: Coordinate[]): Coordinate[] => {
  if (coordinates.length < 3) {
    return coordinates;
  }
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];

  if (first[0] === last[0] && first[1] === last[1]) {
    return coordinates;
  }
  return [...coordinates, first];
};

// Applies Chaikin-like algorithm to smooth user-drawn jagged lines
const smoothLineCoordinates = (coordinates: Coordinate[]): Coordinate[] => {
  if (coordinates.length < 3) {
    return coordinates;
  }

  let smoothedCoordinates = coordinates;

  for (let iteration = 0; iteration < 2; iteration += 1) {
    const nextCoordinates: Coordinate[] = [smoothedCoordinates[0]];

    for (let index = 0; index < smoothedCoordinates.length - 1; index += 1) {
      const current = smoothedCoordinates[index];
      const next = smoothedCoordinates[index + 1];

      nextCoordinates.push([
        current[0] * 0.75 + next[0] * 0.25,
        current[1] * 0.75 + next[1] * 0.25,
      ]);
      nextCoordinates.push([
        current[0] * 0.25 + next[0] * 0.75,
        current[1] * 0.25 + next[1] * 0.75,
      ]);
    }

    nextCoordinates.push(smoothedCoordinates[smoothedCoordinates.length - 1]);
    smoothedCoordinates = nextCoordinates;
  }

  return smoothedCoordinates;
};

const DrawablePolyline = ({
  coordinates,
  sourceId = 'drawn-area-source',
  lineLayerId = 'drawn-area-line',
  fillLayerId = 'drawn-area-fill',
  lineColor = '#EF4444',
  lineWidth = 4,
  fillColor = '#F97316',
  fillOpacity = 0.2,
}: DrawablePolylineProps) => {
  
  // Memoize both line and area coordinate calculations internally
  const { smoothedLine, smoothedArea } = useMemo(() => {
    const smoothedLine = smoothLineCoordinates(coordinates);
    const smoothedArea = closeRing(smoothedLine);
    return { smoothedLine, smoothedArea };
  }, [coordinates]);

  const shape = useMemo<GeoJSON.FeatureCollection>(() => {
    const features: GeoJSON.Feature[] = [];

    if (coordinates.length >= 2) {
      features.push({
        type: 'Feature',
        properties: { type: 'draw-line' },
        geometry: {
          type: 'LineString',
          coordinates: smoothedLine,
        },
      });
    }

    if (coordinates.length >= 3) {
      features.push({
        type: 'Feature',
        properties: { type: 'draw-area' },
        geometry: {
          type: 'Polygon',
          coordinates: [smoothedArea],
        },
      });
    }

    return {
      type: 'FeatureCollection',
      features,
    };
  }, [coordinates, smoothedLine, smoothedArea]);

  const lineStyle = useMemo<LineLayerStyle>(
    () => ({
      lineColor,
      lineWidth,
      lineJoin: 'round',
      lineCap: 'round',
    }),
    [lineColor, lineWidth],
  );

  const fillStyle = useMemo<FillLayerStyle>(
    () => ({
      fillColor,
      fillOpacity,
    }),
    [fillColor, fillOpacity],
  );

  if (!coordinates.length) {
    return null;
  }

  return (
    <Mapbox.ShapeSource id={sourceId} shape={shape}>
      <Mapbox.FillLayer
        id={fillLayerId}
        filter={['==', ['get', 'type'], 'draw-area']}
        style={fillStyle}
      />
      <Mapbox.LineLayer
        id={lineLayerId}
        filter={['==', ['get', 'type'], 'draw-line']}
        style={lineStyle}
      />
    </Mapbox.ShapeSource>
  );
};

export default memo(DrawablePolyline);