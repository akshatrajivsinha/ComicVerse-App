import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import CustomText from '@src/components/atom/CustomText';
import { BackButtonIcon } from '@src/assets/icons';
import { LocationSearchModalProps } from '../types';

const SuggestionSeparator = () => <View style={styles.separator} />;

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  visible,
  searchQuery,
  searchResults,
  isSearching,
  setSearchQuery,
  onClose,
  onSelectLocation,
  onSearchSubmit,
}) => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!visible) return;
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(focusTimer);
  }, [visible]);

  const handleSelectLocation = (item: any) => {
    Keyboard.dismiss();
    onClose();
    onSelectLocation(item);
  };

  const showNoResultsView =
    searchQuery.trim().length > 0 && searchResults.length === 0 && !isSearching;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.backButton}>
            <Image source={BackButtonIcon} style={styles.backIcon} />
          </Pressable>
          <CustomText style={styles.headerTitle}>Search Location</CustomText>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search location"
              placeholderTextColor="#6B7280"
              returnKeyType="search"
              onSubmitEditing={onSearchSubmit}
              autoCorrect={false}
              autoCapitalize="words"
              selectionColor="#202060"
            />
            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
                hitSlop={15}
              >
                <CustomText style={styles.clearButtonText}>×</CustomText>
              </Pressable>
            )}
          </View>

          {showNoResultsView ? (
            <View style={styles.noResultsContainer}>
              <View style={styles.graphicWrapper}>
                <View style={styles.cardGraphic}>
                  <View style={styles.cardLineLong} />
                  <View style={styles.cardLineShort} />
                </View>
                <View style={styles.lensGraphic} />
              </View>
              <CustomText style={styles.noResultsTitle}>
                No Location Found
              </CustomText>
              <CustomText style={styles.noResultsSubtitle}>
                Try searching with a different city, ZIP code, or area name.
              </CustomText>
            </View>
          ) : isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#3B4AA3" size="large" />
              <CustomText style={styles.loadingText}>
                Searching locations...
              </CustomText>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelectLocation(item)}
                  style={styles.suggestionRow}
                >
                  <CustomText numberOfLines={2} style={styles.suggestionText}>
                    {item.place_name || item.text || 'Unknown Location'}
                  </CustomText>
                </Pressable>
              )}
              ItemSeparatorComponent={SuggestionSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsContent}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardView: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: { width: 44, height: 44, justifyContent: 'center' },
  backIcon: { width: 18, height: 18 },
  headerTitle: {
    flex: 1,
    color: '#111111',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: { width: 44 },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  inputContainer: { width: '100%', justifyContent: 'center' },
  input: {
    height: 58,
    borderWidth: 1,
    borderColor: '#020202ff',
    borderRadius: 14,
    paddingLeft: 16,
    paddingRight: 44,
    color: '#111827',
    fontSize: 18,
  },
  clearButton: { position: 'absolute', right: 20 },
  clearButtonText: { fontSize: 22, color: '#4B5563', fontWeight: '500' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 14, color: '#4B5563', fontSize: 16 },
  resultsContent: { paddingTop: 14, paddingBottom: 28 },
  suggestionRow: { minHeight: 66, justifyContent: 'center' },
  suggestionText: { color: '#1F2937', fontSize: 17, lineHeight: 23 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#DADADA' },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    bottom: 40,
  },
  graphicWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardGraphic: {
    width: 70,
    height: 90,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  cardLineLong: {
    width: '85%',
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  cardLineShort: {
    width: '50%',
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  lensGraphic: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 5,
    borderColor: '#93C5FD',
    backgroundColor: 'rgba(219, 234, 254, 0.4)',
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  noResultsSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
});
