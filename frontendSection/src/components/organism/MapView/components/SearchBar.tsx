import React from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
} from 'react-native';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: () => void;
  searchResults: any[];
  onSelectLocation: (feature: any) => void;
  showClearButton: boolean;
  onClearMap: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  searchResults,
  onSelectLocation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <View style={styles.searchIcon} />

        <TextInput
          style={styles.input}
          placeholder="Search location..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={onSearchSubmit}
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
            activeOpacity={0.7}
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={searchResults}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.resultItem}
                onPress={() => [onSelectLocation(item), Keyboard.dismiss()]}
              >
                <View style={styles.locationDot} />

                <View style={styles.resultTextContainer}>
                  <Text numberOfLines={1} style={styles.resultTitle}>
                    {item.text || 'Unknown Location'}
                  </Text>

                  <Text numberOfLines={2} style={styles.resultSubtitle}>
                    {item.place_name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '93%',
    alignSelf: 'flex-end',
  },

  searchBox: {
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 4,
  },

  searchIcon: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 10,
    marginRight: 10,
    position: 'relative',
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    paddingVertical: 0,
  },

  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  clearText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },

  resultsContainer: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    maxHeight: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },

  resultItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginTop: 6,
    marginRight: 12,
  },

  resultTextContainer: {
    flex: 1,
  },

  resultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 3,
  },

  resultSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },

  separator: {
    height: 1,
    backgroundColor: '#F2F2F2',
    marginLeft: 36,
  },
});
