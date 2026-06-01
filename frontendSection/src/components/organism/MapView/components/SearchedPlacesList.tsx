import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CustomText from '@src/components/atom/CustomText';
import { SearchedPlace } from '../constants';

interface SearchedPlacesListProps {
  places: SearchedPlace[];
  onRemovePlace: (id: string) => void;
  onSelectPlace: (place: SearchedPlace) => void;
}

export const SearchedPlacesList: React.FC<SearchedPlacesListProps> = ({
  places,
  onRemovePlace,
  onSelectPlace,
}) => {
    

  return (
    <View style={[styles.container, { backgroundColor: '#f8f8f9ff' }]}>
      <CustomText style={[styles.title, { color: 'black' }]}>
        Searched Areas ({places.length})
      </CustomText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {places.length === 0 ? (
          <CustomText style={styles.noSearchText}>No search yet</CustomText>
        ) : (
          places.map(place => (
            <View
              key={place.id}
              style={[
                styles.chip,
                {
                  backgroundColor: '#1E293B',
                  borderColor: '#334155',
                  paddingRight: 20,
                },
              ]}
            >
              <TouchableOpacity onPress={() => onSelectPlace(place)}>
                <CustomText numberOfLines={1} style={styles.chipText}>
                  {place.placeName}
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onRemovePlace(place.id)}
                style={styles.crossButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CustomText style={styles.crossText}>×</CustomText>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30, // Positioned safely above your bottom navigation controls
    left: 15,
    right: 15,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 14,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 90,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16, // Adds centered padding when showing the placeholder text
  },
  noSearchText: {
    fontSize: 14,
    color: '#64748B', // A clean, muted gray color
    fontWeight: '500',
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#010306ff',
  },
  listContent: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: 180,
  },
  chipText: {
    color: '#F8FAFC',
    fontSize: 13,
    marginRight: 8,
  },
  crossButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  crossText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 14,
  },
});
