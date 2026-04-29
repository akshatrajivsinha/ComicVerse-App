import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface UseOTPScreenViewModelProps {
  navigation: any;
  route: any;
}

export const useOTPScreenViewModel = ({
  navigation,
  route,
}: UseOTPScreenViewModelProps) => {
  const { phoneNumber } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const titleY = useSharedValue(50);
  const inputY = useSharedValue(80);
  const buttonY = useSharedValue(100);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });

    titleY.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });

    inputY.value = withDelay(
      150,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) }),
    );

    buttonY.value = withDelay(
      150,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) }),
    );
  });

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleY.value }],
    opacity: opacity.value,
  }));

  const inputStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: inputY.value }],
    opacity: opacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const onPressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleVerifyOTP = async (otp: string) => {
    setLoading(true);
    if (otp.length !== 4) {
      showToast('Please enter a valid 4-digit OTP', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://verifyonetimepassword-cm5h7rlbta-uc.a.run.app',
        { code: otp, phone: phoneNumber },
      );

      if (response.status === 200) {
        showToast('OTP verified successfully', 'success');
        navigation.navigate('MainTabs');
      } else {
        showToast(response.data?.error || 'Invalid OTP', 'error');
      }
    } catch (error: any) {
      if (error.response) {
        const message = error.response.data?.error || 'Invalid OTP';

        showToast(message, 'error');
      } else {
        showToast('Failed to verify OTP. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    titleStyle,
    inputStyle,
    buttonStyle,
    onPressIn,
    onPressOut,
    handleVerifyOTP,
    toast,
    hideToast,
  };
};
