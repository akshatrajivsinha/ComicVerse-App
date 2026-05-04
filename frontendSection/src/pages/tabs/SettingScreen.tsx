import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@src/utils/colors';
import Header from '@src/components/Header';
import { useAuthStore } from '@src/store/authStore';
import CustomText from '@src/components/CustomText';
import { fonts } from '@src/config/fonts';

const SettingScreen = () => {
  const { clearAuthToken } = useAuthStore();

  const handleLogout = () => {
    clearAuthToken();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" fontSize={20} />
      <View style={styles.innerContainer}>
        <CustomText font={fonts.nunitoMedium} style={styles.subtitle}>Customize your experience</CustomText>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <CustomText font={fonts.nunitoSemiBold} style={styles.logoutButtonText}>Logout</CustomText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSlate,
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingScreen;
