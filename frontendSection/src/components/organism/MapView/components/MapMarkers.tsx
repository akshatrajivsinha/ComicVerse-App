import React from 'react';
import { View, StyleSheet } from 'react-native';
import Mapbox from '@rnmapbox/maps';

interface MarkerType {
  id: string;
  coordinates: [number, number];
  title: string;
}

interface MapMarkersProps {
  markers: MarkerType[];
}

export const MapMarkers: React.FC<MapMarkersProps> = ({ markers }) => {
  return (
    <>
      {markers.map(marker => {
        const isUser = marker.id === 'user-current-loc' || marker.id === 'route-beginning-marker';
        const isPOI = marker.id.toString().startsWith('poi-');
        let markerColor = '#FF3B30';
        if (isUser) {
          markerColor = '#1ebe53ff';
        } else if (isPOI) {
          markerColor = '#FF9500';
        }

        return (
          <Mapbox.PointAnnotation
            key={marker.id}
            id={marker.id}
            coordinate={marker.coordinates}
            anchor={{ x: 0.5, y: 0.5 }} 
          >
              <View style={styles.outerShadyCircle}>
                <View style={[styles.innerCoreCircle, { backgroundColor: markerColor }]}>
                  <View style={styles.centerDot} />
              </View>
            </View>

            <Mapbox.Callout title={marker.title} />
          </Mapbox.PointAnnotation>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  outerShadyCircle: {
    width: 24,
    height: 24,
    borderRadius: 17,
    backgroundColor: 'rgba(69, 67, 67, 0.52)', // Ambient shaded boundary ring
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
    borderRadius: 13,
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