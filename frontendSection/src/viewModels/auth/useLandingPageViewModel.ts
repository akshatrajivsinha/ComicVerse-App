import { useEffect, useState } from 'react';

import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useAuthStore } from '@src/store/authStore';
import auth from '@react-native-firebase/auth';
import { loginWithGitHub } from '@src/config/githubAuth';

interface UseLandingPageViewModelProps {
  navigation: any;
}

const useLandingPageViewModel = ({navigation}: UseLandingPageViewModelProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const bgOpacity = useSharedValue(1);
  const setAuthToken = useAuthStore((state) => state.setAuthToken);

  const images = [
    require('@src/assets/images/AvengerEndgamePoster.jpg'),
    require('@src/assets/images/CaptainMarvelProfile.webp'),
    require('@src/assets/images/BlackAdam.webp'),
    require('@src/assets/images/IronMan.jpg'),
    require('@src/assets/images/CaptainAmerica.jpg'),
    require('@src/assets/images/BatmanProfile.jpg'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % images.length;

      bgOpacity.value = withTiming(0.2, { duration: 500 }, finished => {
        if (finished) {
          runOnJS(setCurrentImageIndex)(nextIndex);
          bgOpacity.value = withTiming(1, { duration: 500 });
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  });

  const titleY = useSharedValue(50);
  const buttonY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });

    titleY.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });

    buttonY.value = withDelay(
      150,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) }),
    );
  });

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleY.value }],
    opacity: opacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonY.value }],
    opacity: opacity.value,
  }));

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleGitHubLogin = async () => {
  if (loading) return;

  setLoading(true);

  try {
    const githubAuth = await loginWithGitHub();

    if (!githubAuth?.accessToken) {
      throw new Error('GitHub access token not found');
    }

    const credential = auth.GithubAuthProvider.credential(
      githubAuth.accessToken
    );

    const userCredential = await auth().signInWithCredential(credential);

    const idToken = await userCredential.user.getIdToken();

    setAuthToken(idToken);

    showToast('GitHub login successful', 'success');
  } catch (error: any) {
    console.error('GitHub login error:', error);

    if (error.code === 'USER_CANCELLED') {
      showToast('Login cancelled', 'error');
    } else if (
      error.code === 'auth/account-exists-with-different-credential'
    ) {
      showToast(
        'Account exists with another sign-in method',
        'error'
      );
    } else {
      showToast(error.message || 'GitHub login failed', 'error');
    }
  } finally {
    setLoading(false);
  }
};

  return {
    currentImageIndex,
    images,
    loading,
    toast,
    titleStyle,
    buttonStyle,
    bgAnimatedStyle,
    handleLogin,
    handleRegister,
    showToast,
    hideToast,
    handleGitHubLogin
  };
};

export default useLandingPageViewModel