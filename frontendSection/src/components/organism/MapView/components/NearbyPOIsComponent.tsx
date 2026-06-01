import React, { useState } from 'react';
import { View, TouchableOpacity, Alert, Modal, StyleSheet } from 'react-native';
import CustomText from '@src/components/atom/CustomText';

interface MarkerType {
  id: string;
  coordinates: [number, number];
  title: string;
}

interface NearbyPOIsComponentProps {
  mapToken: string;
  userLocation: [number, number] | null;
  cameraRef: React.RefObject<any>;
  routeActive: boolean;
  hasActiveCard: boolean;
  dynamicStyles: any;
  onPOIsUpdated: (pois: MarkerType[]) => void;
  registerClearRef?: (clearFn: () => void) => void;
  isVisible: boolean;
  onClose: () => void;
}

export const NearbyPOIsComponent: React.FC<NearbyPOIsComponentProps> = ({
  mapToken,
  userLocation,
  cameraRef,
  routeActive,
  dynamicStyles,
  onPOIsUpdated,
  registerClearRef,
  isVisible,
  onClose,
}) => {
  const [_, setLocalPOIs] = useState<MarkerType[]>([]);

  React.useEffect(() => {
    if (registerClearRef) {
      registerClearRef(() => {
        setLocalPOIs([]);
        onPOIsUpdated([]);
      });
    }
  }, [registerClearRef, onPOIsUpdated]);

  const fetchNearbyPOIs = async (
    category: 'hotel' | 'gas_station' | 'restaurant' | 'park',
  ) => {
    if (!userLocation) {
      Alert.alert(
        'Location unavailable',
        'Please wait until your current location is found.',
      );
      return;
    }

    onClose();

    let poiCategory = '';
    if (category === 'hotel') poiCategory = 'hotel';
    if (category === 'gas_station') poiCategory = 'gas_station';
    if (category === 'restaurant') poiCategory = 'restaurant';
    if (category === 'park') poiCategory = 'park';

    try {
      const url = `https://api.mapbox.com/search/searchbox/v1/category/${poiCategory}?proximity=${userLocation[0]},${userLocation[1]}&limit=10&access_token=${mapToken}`;

      const response = await fetch(url);
      const data = await response.json();

      const features = data.features ?? [];
      console.log("features", features);
      const pois: MarkerType[] = features.map((feature: any) => ({
        id: `poi-${
          feature.properties?.mapbox_id || Date.now()
        }-${Math.random()}`,
        coordinates: feature.geometry.coordinates,
        title: feature.properties?.name || 'Nearby Place',
      }));

      setLocalPOIs(pois);
      onPOIsUpdated(pois);

      if (pois.length > 0) {
        const allCoords = [userLocation, ...pois.map(p => p.coordinates)];
        const longitudes = allCoords.map(c => c[0]);
        const latitudes = allCoords.map(c => c[1]);

        const minLng = Math.min(...longitudes);
        const minLat = Math.min(...latitudes);
        const maxLng = Math.max(...longitudes);
        const maxLat = Math.max(...latitudes);

        cameraRef.current?.fitBounds(
          [minLng, minLat],
          [maxLng, maxLat],
          [80, 80, 80, 80],
          1200,
        );
      } else {
        Alert.alert('No results', `Could not find any nearby ${category}s.`);
      }
    } catch (error) {
      console.error('Searchbox Category API Error:', error);
      Alert.alert('Error', 'Failed to fetch nearby places.');
    }
  };

  if (!userLocation || routeActive) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContentCard}>
          <CustomText style={styles.modalTitle}>Search Nearby Places</CustomText>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                dynamicStyles.recenterButton,
                styles.optionButton,
                { backgroundColor: '#FF9500' },
              ]}
              onPress={() => fetchNearbyPOIs('hotel')}
            >
              <CustomText style={styles.optionText}>🏨 Hotels</CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                dynamicStyles.recenterButton,
                styles.optionButton,
                { backgroundColor: '#34C759' },
              ]}
              onPress={() => fetchNearbyPOIs('gas_station')}
            >
              <CustomText style={styles.optionText}>⛽ Petrol Pumps</CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                dynamicStyles.recenterButton,
                styles.optionButton,
                { backgroundColor: '#34C759' },
              ]}
              onPress={() => fetchNearbyPOIs('park')}
            >
              <CustomText style={styles.optionText}>🌳 Parks</CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                dynamicStyles.recenterButton,
                styles.optionButton,
                { backgroundColor: '#34C759' },
              ]}
              onPress={() => fetchNearbyPOIs('restaurant')}
            >
              <CustomText style={styles.optionText}>🍽️ Restaurants</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentCard: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 20,
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    width: '100%',
  },
  optionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});