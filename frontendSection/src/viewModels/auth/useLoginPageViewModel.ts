import { useEffect, useState } from 'react';

import axios from 'axios';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useAuthStore } from '@src/store/authStore';

interface UseLoginPageViewModelProps {
  navigation: any;
}

export const useLoginPageViewModel = ({navigation}: UseLoginPageViewModelProps) => {
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });
  const setAuthToken = useAuthStore((state) => state.setAuthToken);

  const titleY = useSharedValue(50);
  const inputY = useSharedValue(80);
  const buttonY = useSharedValue(100);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);
  const inputScale = useSharedValue(1);

  // Toggle animation
  const toggleTranslateX = useSharedValue(0);

  // Password field animation
  const passwordOpacity = useSharedValue(0);
  const passwordTranslateY = useSharedValue(20);

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

  useEffect(() => {
    toggleTranslateX.value = withTiming(loginType === 'email' ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });

    if (loginType === 'email') {
      passwordOpacity.value = withTiming(1, { duration: 300 });
      passwordTranslateY.value = withTiming(0, { duration: 300 });
    } else {
      passwordOpacity.value = withTiming(0, { duration: 300 });
      passwordTranslateY.value = withTiming(20, { duration: 300 });
    }

    buttonY.value = withTiming(
      loginType === 'email' ? 10 : -5,
      { duration: 150 },
      () => {
        buttonY.value = withDelay(
          50,
          withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) }),
        );
      },
    );
  });

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleY.value }],
    opacity: opacity.value,
  }));

  const inputStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: inputY.value }, { scale: inputScale.value }],
    opacity: opacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const toggleIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleTranslateX.value * 185 }],
  }));

  const passwordFieldStyle = useAnimatedStyle(() => ({
    opacity: passwordOpacity.value,
    transform: [{ translateY: passwordTranslateY.value }],
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

  const toggleLoginType = () => {
    setLoginType(prev => (prev === 'phone' ? 'email' : 'phone'));
    setPhoneNumber('');
    setEmail('');
    setPassword('');
  };

  const handleSendOTP = async () => {
    setLoading(true);
    if (loginType === 'phone') {
      if (phoneNumber.length !== 10) {
        showToast('Please enter a valid 10-digit phone number', 'error');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          'https://requestonetimepassword-cm5h7rlbta-uc.a.run.app',
          { phone: `91${phoneNumber}`, type: 'login' },
        );

        if (response.data?.success) {
          showToast('OTP sent successfully', 'success');
          navigation.navigate('OTPScreen', { phoneNumber: `91${phoneNumber}` });
        }
      } catch (error: any) {
        if (error.response) {
          const message =
            error.response.data?.error ||
            'Something went wrong. Please try again.';

          showToast(message, 'error');
        } else {
          showToast('Failed to send OTP. Please try again.', 'error');
        }
      } finally {
        setLoading(false);
      }
    } else {
      if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        setLoading(false);
        return;
      }

      if (!password || password.length < 6) {
        showToast('Please enter a valid password (min 6 characters)', 'error');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          'https://emailverification-cm5h7rlbta-uc.a.run.app',
          { email, password },
        );
        if (response.data?.success) {
          const token = response.data?.token;
          setAuthToken(token);
          showToast('Login successful', 'success');
        } else {
          showToast(response.data?.error, 'error');
        }
        setLoading(false);
      } catch {
        showToast('Failed to login. Please try again.', 'error');
        setLoading(false);
      }
    }
  };

  return {
    loading,
    loginType,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    password,
    setPassword,
    toggleLoginType,
    titleStyle,
    inputStyle,
    buttonStyle,
    toggleIndicatorStyle,
    passwordFieldStyle,
    onPressIn,
    onPressOut,
    handleSendOTP,
    toast,
    hideToast,
  };
};
