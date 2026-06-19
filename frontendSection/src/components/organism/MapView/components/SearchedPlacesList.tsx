import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '@src/components/atom/CustomText';
import { MapMarkerIcon } from '@src/assets/icons';
import { SearchedPlacesListProps } from '../types';

export const SearchedPlacesList: React.FC<SearchedPlacesListProps> = ({
  places,
  onRemovePlace,
  onSelectPlace,
  onAddMorePress,
  onSubmitPress,
  onHeightChange,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const prevLengthRef = useRef(places.length);

  useEffect(() => {
    if (places.length < prevLengthRef.current) {
      scrollViewRef.current?.scrollTo({
        x: places.length > 0 ? places.length * 100 : 0,
        animated: true,
      });
    }
    prevLengthRef.current = places.length;
  }, [places.length]);

  return (
    <View
      style={styles.bottomSheetCard}
      onLayout={e => onHeightChange?.(e.nativeEvent.layout.height)}
    >
      <View style={styles.paginationContainer}>
        <View style={styles.progressBarTrack} />
      </View>

      {places.length === 0 ? (
        <View style={styles.bottomSheetContent}>
          <CustomText style={styles.bottomSheetTitle}>
            No preferred locations added
          </CustomText>
          <CustomText style={styles.bottomSheetSubtitle}>
            You haven't selected any preferred location yet.
          </CustomText>
        </View>
      ) : (
        <View style={styles.activeContentContainer}>
          <View style={styles.titleRow}>
            <Image
              source={MapMarkerIcon}
              style={styles.markerIcon}
              resizeMode="contain"
            />
            <CustomText style={styles.sectionTitle}>
              Selected Locations
            </CustomText>
          </View>

          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            <TouchableOpacity
              style={styles.addMorePill}
              onPress={onAddMorePress}
              activeOpacity={0.7}
            >
              <CustomText style={styles.addMorePlus}>+</CustomText>
              <CustomText style={styles.addMoreText}>Add more</CustomText>
            </TouchableOpacity>

            {places.map(place => (
              <View key={place.id} style={styles.locationPill}>
                <TouchableOpacity
                  onPress={() => onSelectPlace(place)}
                  activeOpacity={0.7}
                >
                  <CustomText numberOfLines={1} style={styles.locationPillText}>
                    {place.placeName}
                  </CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onRemovePlace(place.id)}
                  style={styles.removeCircleButton}
                  hitSlop={10}
                >
                  <View style={styles.removeCircleInner}>
                    <CustomText style={styles.removeCrossText}>×</CustomText>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={onSubmitPress}
            activeOpacity={0.85}
            style={styles.submitButtonWrapper}
          >
            <LinearGradient
              colors={['#59C3E6', '#3B4AA3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitGradient}
            >
              <CustomText style={styles.submitButtonText}>Submit</CustomText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheetCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 20,
    paddingBottom: 24,
    zIndex: 100,
  },
  paginationContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  progressBarTrack: {
    width: 84,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
  },
  bottomSheetContent: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  bottomSheetSubtitle: { fontSize: 14, color: '#718096', textAlign: 'center' },
  activeContentContainer: { width: '100%' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  markerIcon: { width: 22, height: 22, marginRight: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#000000' },
  listContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24,
    gap: 10,
  },
  addMorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 38,
  },
  addMorePlus: { fontSize: 20, color: '#64748B', marginRight: 6, bottom: 2 },
  addMoreText: { fontSize: 15, color: '#0F172A', fontWeight: '500' },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 38,
  },
  locationPillText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
    marginRight: 6,
  },
  removeCircleButton: { justifyContent: 'center', alignItems: 'center' },
  removeCircleInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeCrossText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  submitButtonWrapper: { marginTop: 12, paddingHorizontal: 24, width: '100%' },
  submitGradient: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
});
