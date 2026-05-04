import React, { useEffect } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@src/utils/colors';
import CustomText from '@src/components/CustomText';
import { fonts } from '@src/config/fonts';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  visible: boolean;
  onHide: () => void;
}

const Toast = ({ message, type = 'error', visible=false, onHide }: ToastProps) => {
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, 3000);

      return () => clearTimeout(timer);
    }
  });

  if (!visible) return null;

  return (
    <SafeAreaView edges={['top']} style={styles.toastContainer}>
      <Animated.View
        style={[
          styles.toast,
          type === 'success' ? styles.success : styles.error,
          { transform: [{ translateY }] },
        ]}
      >
        <CustomText font={fonts.nunitoBold} style={styles.message}>{message}</CustomText>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Toast;

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  toast: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  success: {
    backgroundColor: colors.successGreen,
  },
  error: {
    backgroundColor: colors.errorRed,
  },
  message: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
