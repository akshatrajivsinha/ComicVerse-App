import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Image } from 'react-native';

import { SearchIcon } from '@src/assets/icons';
import { colors } from '@src/utils/colors';
import { SearchBarProps } from '../types';

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.searchBox}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Open location search"
      >
        <Image
          source={SearchIcon}
          tintColor={colors.black}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter City or Zip Code"
          placeholderTextColor="#999"
          value={searchQuery}
          editable={false}
          pointerEvents="none"
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'flex-end',
  },
  searchBox: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: { height: 16, width: 16, marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    paddingVertical: 0,
  },
});
