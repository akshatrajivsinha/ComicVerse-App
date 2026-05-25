import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Animated, Alert, FlatList, StyleSheet, Keyboard } from 'react-native';
// @ts-ignore
import MapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
// @ts-ignore
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import CustomText from '@src/components/atom/CustomText';

interface DirectionComponentProps {
  mapToken: string;
  userLocation: [number, number] | null;
  currentAddress: string;
  cameraRef: React.RefObject<any>;
  routeWidth: Animated.AnimatedInterpolation<string | number>;
  routeOpacity: Animated.AnimatedInterpolation<string | number>;
  onRouteCalculated: (
    coordinates: [number, number][], 
    duration: string,
    origin: [number, number],
    destination: [number, number]
  ) => void;
  dynamicStyles: any;
}

export const DirectionComponent: React.FC<DirectionComponentProps> = ({
  mapToken,
  userLocation,
  currentAddress,
  cameraRef,
  routeWidth,
  routeOpacity,
  onRouteCalculated,
  dynamicStyles,
}) => {
  const [fromQuery, setFromQuery] = useState(currentAddress || '');
  const [toQuery, setToQuery] = useState('');

  const [fromResults, setFromResults] = useState<any[]>([]);
  const [toResults, setToResults] = useState<any[]>([]);
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null);

  const geocodingClient = MapboxGeocoding({ accessToken: mapToken });
  const directionsClient = MapboxDirections({ accessToken: mapToken });

  useEffect(() => {
    if (currentAddress && !fromQuery) {
      setFromQuery(currentAddress);
    }
  }, [currentAddress, fromQuery]);

  const fetchSuggestions = async (queryText: string, inputType: 'from' | 'to') => {
    if (!queryText.trim() || queryText.length < 3) {
      if (inputType === 'from') setFromResults([]);
      else setToResults([]);
      return;
    }

    try {
      const response = await geocodingClient
        .forwardGeocode({
          query: queryText,
          limit: 4,
        })
        .send();

      const features = response.body?.features ?? [];
      if (inputType === 'from') setFromResults(features);
      else setToResults(features);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleTextChange = (text: string, inputType: 'from' | 'to') => {
    if (inputType === 'from') {
      setFromQuery(text);
    } else {
      setToQuery(text);
    }
    setActiveInput(inputType);

    const delayDebounce = setTimeout(() => {
      fetchSuggestions(text, inputType);
    }, 400);

    return () => clearTimeout(delayDebounce);
  };

  const handleSelectSuggestion = (feature: any, inputType: 'from' | 'to') => {
    if (inputType === 'from') {
      setFromQuery(feature.place_name);
      setFromResults([]);
    } else {
      setToQuery(feature.place_name);
      setToResults([]);
    }
    setActiveInput(null);
  };

  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    if (!address.trim()) return null;
    try {
      const response = await geocodingClient
        .forwardGeocode({ query: address, limit: 1 })
        .send();
      const feature = response.body?.features?.[0];
      return feature ? feature.geometry.coordinates : null;
    } catch (error) {
      console.error('Geocoding API error:', address, error);
      return null;
    }
  };

  const handleCalculateRoute = async () => {
    Keyboard.dismiss();
    setFromResults([]);
    setToResults([]);
    setActiveInput(null);

    let startCoords = userLocation;
    let endCoords = null;

    if (fromQuery !== currentAddress) {
      const coords = await geocodeAddress(fromQuery);
      if (!coords) {
        Alert.alert('Location Error', 'Could not find the starting address.');
        return;
      }
      startCoords = coords;
    }

    if (!toQuery.trim()) {
      Alert.alert('Missing Input', 'Please enter a destination address.');
      return;
    }

    const coords = await geocodeAddress(toQuery);
    if (!coords) {
      Alert.alert('Location Error', 'Could not find the destination address.');
      return;
    }
    endCoords = coords;

    if (!startCoords || !endCoords) return;

    try {
      const response = await directionsClient
        .getDirections({
          profile: 'driving-traffic',
          waypoints: [{ coordinates: startCoords }, { coordinates: endCoords }],
          geometries: 'geojson',
          overview: 'full',
        })
        .send();

      const route = response.body?.routes?.[0];

      if (route) {
        const durationMins = Math.round(route.duration / 60);
        let formattedDuration = `${durationMins} mins`;
        
        if (durationMins >= 60) {
          const hours = Math.floor(durationMins / 60);
          const mins = durationMins % 60;
          formattedDuration = `${hours} hr ${mins} min`;
        }

        onRouteCalculated(route.geometry.coordinates, formattedDuration, startCoords, endCoords);
        cameraRef.current?.fitBounds(startCoords, endCoords, [50, 50, 50, 50], 1000);
      } else {
        Alert.alert('Route Error', 'No route driving paths found.');
      }
    } catch (error) {
      console.error('SDK Route Error:', error);
      Alert.alert('Error', 'Failed to fetch direction paths.');
    }
  };

  const renderSuggestionList = (data: any[], type: 'from' | 'to') => {
    if (data.length === 0 || activeInput !== type) return null;

    return (
      <View style={localStyles.suggestionsContainer}>
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={data}
          keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={localStyles.suggestionItem}
              onPress={() => handleSelectSuggestion(item, type)}
              activeOpacity={0.8}
            >
              <View style={localStyles.bulletDot} />
              <View style={{ flex: 1 }}>
                <CustomText style={localStyles.suggestionTitle} numberOfLines={1}>
                  {item.text || 'Location'}
                </CustomText>
                <CustomText style={localStyles.suggestionSub} numberOfLines={1}>
                  {item.place_name}
                </CustomText>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={localStyles.separator} />}
        />
      </View>
    );
  };

  return (
    <Animated.View style={[dynamicStyles.animatedRouteContainer, { width: routeWidth, opacity: routeOpacity, zIndex: 999 }]}>
      <View style={dynamicStyles.routeFieldsCard}>
        
        <View style={{ zIndex: activeInput === 'from' ? 10 : 1 }}>
          <TextInput
            style={dynamicStyles.routeInputWritable}
            value={fromQuery}
            onChangeText={(text) => handleTextChange(text, 'from')}
            onFocus={() => setActiveInput('from')}
            placeholder="From: enter origin address"
            placeholderTextColor="#999"
          />
          {renderSuggestionList(fromResults, 'from')}
        </View>

        <View style={{ zIndex: activeInput === 'to' ? 10 : 1 }}>
          <TextInput
            style={dynamicStyles.routeInputWritable}
            value={toQuery}
            onChangeText={(text) => handleTextChange(text, 'to')}
            onFocus={() => setActiveInput('to')}
            placeholder="To: enter destination address"
            placeholderTextColor="#999"
          />
          {renderSuggestionList(toResults, 'to')}
        </View>

        <TouchableOpacity style={dynamicStyles.routeSubmitBtn} onPress={handleCalculateRoute}>
          <CustomText style={dynamicStyles.routeSubmitBtnText}>Get Directions</CustomText>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const localStyles = StyleSheet.create({
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    maxHeight: 160,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginRight: 10,
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
  },
  suggestionSub: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#F2F2F2',
  },
});