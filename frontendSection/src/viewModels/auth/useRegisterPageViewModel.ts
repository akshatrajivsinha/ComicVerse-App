import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface UseRegisterPageViewModelProps {
  navigation: any;
}

export const useRegisterPageViewModel = ({
  navigation,
}: UseRegisterPageViewModelProps) => {
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
  const inputScale = useSharedValue(1);

  // Toggle animation
  const toggleTranslateX = useSharedValue(0);

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

    // Reset button animation when switching tabs
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

  const onPressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const toggleLoginType = () => {
    setLoginType(prev => (prev === 'phone' ? 'email' : 'phone'));
    setPhoneNumber('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleRegister = async () => {
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
          { phone: `91${phoneNumber}`, type: 'register' },
        );

        if (response.data?.success) {
          showToast('OTP Send Successfully', 'success');

          setTimeout(() => {
            navigation.navigate('OTP', { phoneNumber: `91${phoneNumber}` });
          }, 2000);
        }
      } catch (error: any) {
        if (error.response) {
          const message = error.response.data?.error || 'Something went wrong';

          showToast(message, 'error');
        } else {
          showToast('Failed to register. Please try again.', 'error');
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
        showToast('Password must be at least 6 characters', 'error');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          'https://requestonetimepassword-cm5h7rlbta-uc.a.run.app',
          { email, password, type: 'register' },
        );

        if (response.data?.success) {
          showToast('Registration successful', 'success');
          navigation.navigate('OTP', { email });
        } else {
          showToast(response.data?.error || 'Registration failed', 'error');
        }
        setLoading(false);
      } catch {
        showToast('Failed to register. Please try again.', 'error');
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
    confirmPassword,
    setConfirmPassword,
    toggleLoginType,
    titleStyle,
    inputStyle,
    buttonStyle,
    toggleIndicatorStyle,
    onPressIn,
    onPressOut,
    handleRegister,
    toast,
    hideToast,
  };
};
