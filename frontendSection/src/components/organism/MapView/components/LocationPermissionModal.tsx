import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '@src/components/atom/CustomText';
import { LocationPermissionModalProps } from '../types';

export const LocationPermissionModal: React.FC<
  LocationPermissionModalProps
> = ({ visible, isLoading = false, onAllowAccess }) => {
  return (
    <Modal visible={visible} animationType="fade" presentationStyle="fullScreen">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.illustration}>
            <View style={styles.blob} />
            <View style={styles.dottedPathLeft} />
            <View style={styles.dottedPathRight} />
            <View style={[styles.building, styles.buildingSmall]} />
            <View style={[styles.building, styles.buildingMedium]} />
            <View style={[styles.building, styles.buildingTall]} />
            <View style={styles.pin}>
              <View style={styles.pinHole} />
            </View>
            <View style={styles.personHead} />
            <View style={styles.personBody} />
            <View style={styles.personLegLeft} />
            <View style={styles.personLegRight} />
            <View style={styles.groundLine} />
          </View>

          <CustomText style={styles.title}>
            Allow app to access your location
          </CustomText>
          <CustomText style={styles.subtitle}>
            This helps you view nearby properties.
          </CustomText>

          <Pressable
            style={styles.buttonOuter}
            onPress={onAllowAccess}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isLoading ? ['#AAB2D8', '#AAB2D8'] : ['#59C3E6', '#3B4AA3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <View style={styles.loadingContent}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <CustomText style={styles.buttonText}>Please wait...</CustomText>
                </View>
              ) : (
                <CustomText style={styles.buttonText}>Allow Access</CustomText>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    justifyContent: 'center',
  },
  illustration: {
    height: 240,
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  blob: {
    position: 'absolute',
    bottom: 28,
    width: 205,
    height: 190,
    borderRadius: 62,
    backgroundColor: '#EDF2FF',
    transform: [{ rotate: '-8deg' }],
  },
  dottedPathLeft: {
    position: 'absolute',
    left: 34,
    bottom: 112,
    width: 68,
    height: 38,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#C7D6F4',
    borderRadius: 28,
    transform: [{ rotate: '15deg' }],
  },
  dottedPathRight: {
    position: 'absolute',
    right: 28,
    bottom: 88,
    width: 102,
    height: 78,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#C7D6F4',
    borderRadius: 48,
    transform: [{ rotate: '-18deg' }],
  },
  building: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#DDE6F8',
    opacity: 0.8,
  },
  buildingSmall: {
    left: 92,
    width: 30,
    height: 72,
  },
  buildingMedium: {
    width: 58,
    height: 102,
  },
  buildingTall: {
    right: 88,
    width: 42,
    height: 88,
  },
  pin: {
    position: 'absolute',
    bottom: 84,
    width: 58,
    height: 82,
    borderTopLeftRadius: 29,
    borderTopRightRadius: 29,
    borderBottomLeftRadius: 29,
    backgroundColor: '#5682CB',
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinHole: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  personHead: {
    position: 'absolute',
    bottom: 96,
    left: '47%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1F2937',
  },
  personBody: {
    position: 'absolute',
    bottom: 57,
    left: '45%',
    width: 24,
    height: 43,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  personLegLeft: {
    position: 'absolute',
    bottom: 31,
    left: '46%',
    width: 7,
    height: 31,
    borderRadius: 4,
    backgroundColor: '#111827',
    transform: [{ rotate: '11deg' }],
  },
  personLegRight: {
    position: 'absolute',
    bottom: 31,
    left: '50%',
    width: 7,
    height: 31,
    borderRadius: 4,
    backgroundColor: '#111827',
    transform: [{ rotate: '-10deg' }],
  },
  groundLine: {
    width: '88%',
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  title: {
    color: '#0B0B0B',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 14,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 36,
  },
  buttonOuter: {
    height: 52,
    borderRadius: 9,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2D3D91',
    shadowColor: '#1D2B6F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
