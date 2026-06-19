import React, { memo, useMemo } from 'react';
import Mapbox, { LineLayerStyle, CircleLayerStyle } from '@rnmapbox/maps';
import { Coordinate, DrawablePolylineProps } from '../types';

const closeRing = (coordinates: Coordinate[]): Coordinate[] => {
  if (coordinates.length < 3) return coordinates;
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  return first[0] === last[0] && first[1] === last[1]
    ? coordinates
    : [...coordinates, first];
};

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

const DrawablePolyline = ({
  coordinates,
  sourceId = 'drawn-area-source',
  lineLayerId = 'drawn-area-line',
  vertexLayerId = 'drawn-area-vertices',
  lineColor = '#566febff',
  lineWidth = 4,
  showVertexHandles = true,
  visibleVertexIndexes,
  isDrawingActive = false,
}: DrawablePolylineProps) => {
  const renderedLine = useMemo(() => {
    return isDrawingActive ? coordinates : closeRing(coordinates);
  }, [coordinates, isDrawingActive]);

  const shape = useMemo<GeoJSON.FeatureCollection>(() => {
    const features: GeoJSON.Feature[] = [];
    const effectiveVisibleVertexIndexes =
      visibleVertexIndexes === undefined
        ? getVisibleVertexIndexes(coordinates)
        : new Set(visibleVertexIndexes);

    if (coordinates.length >= 2) {
      features.push({
        type: 'Feature',
        id: `${sourceId}-line`,
        properties: { type: 'draw-line' },
        geometry: { type: 'LineString', coordinates: renderedLine },
      });
    }

    if (coordinates.length >= 3 && !isDrawingActive) {
      features.push({
        type: 'Feature',
        id: `${sourceId}-area`,
        properties: { type: 'draw-area' },
        geometry: { type: 'Polygon', coordinates: [renderedLine] },
      });
    }

    if (showVertexHandles) {
      coordinates.forEach((coordinate, index) => {
        if (effectiveVisibleVertexIndexes.has(index)) {
          features.push({
            type: 'Feature',
            id: `${sourceId}-vertex-${index}`,
            properties: { type: 'draw-vertex', vertexIndex: index },
            geometry: { type: 'Point', coordinates: coordinate },
          });
        }
      });
    }

    return { type: 'FeatureCollection', features };
  }, [
    coordinates,
    showVertexHandles,
    sourceId,
    renderedLine,
    visibleVertexIndexes,
    isDrawingActive,
  ]);

  const lineStyle = useMemo<LineLayerStyle>(
    () => ({
      lineColor,
      lineWidth,
      lineJoin: 'round',
      lineCap: 'round',
    }),
    [lineColor, lineWidth],
  );

  const vertexStyle = useMemo<CircleLayerStyle>(
    () => ({
      circleRadius: 6,
      circleColor: '#FFFFFF',
      circleStrokeColor: lineColor,
      circleStrokeWidth: 2,
      circlePitchAlignment: 'map',
    }),
    [lineColor],
  );

  if (!coordinates.length) return null;

  return (
    <Mapbox.ShapeSource id={sourceId} shape={shape}>
      <Mapbox.LineLayer
        id={lineLayerId}
        filter={['==', ['get', 'type'], 'draw-line']}
        style={lineStyle}
      />
      <Mapbox.CircleLayer
        id={vertexLayerId}
        filter={['==', ['get', 'type'], 'draw-vertex']}
        style={vertexStyle}
      />
    </Mapbox.ShapeSource>
  );
};

export default memo(DrawablePolyline);
