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
import {
  googleSignInStatusCodes,
  loginWithGoogle,
} from '@src/config/googleAuth';
import { screenNames } from '@src/navigation/screenName';

interface UseLandingPageViewModelProps {
  navigation: any;
}

const useLandingPageViewModel = ({
  navigation,
}: UseLandingPageViewModelProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingProvider, setLoadingProvider] = useState<
    'google' | 'github' | null
  >(null);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const bgOpacity = useSharedValue(1);
  const setAuthToken = useAuthStore(state => state.setAuthToken);

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
    navigation.navigate(screenNames.LOGIN);
  };

  const handleRegister = () => {
    navigation.navigate(screenNames.REGISTER);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleGitHubLogin = async () => {
    if (loadingProvider) return;

    setLoadingProvider('github');

    try {
      const githubAuth = await loginWithGitHub();

      if (!githubAuth?.accessToken) {
        throw new Error('GitHub access token not found');
      }

      const credential = auth.GithubAuthProvider.credential(
        githubAuth.accessToken,
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
        showToast('Account exists with another sign-in method', 'error');
      } else {
        showToast(error.message || 'GitHub login failed', 'error');
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleGoogleLogin = async () => {
    if (loadingProvider) return;

    setLoadingProvider('google');

    try {
      const googleAuth = await loginWithGoogle();
      const credential = auth.GoogleAuthProvider.credential(googleAuth.idToken);
      const userCredential = await auth().signInWithCredential(credential);
      const idToken = await userCredential.user.getIdToken();

      setAuthToken(idToken);

      showToast('Google login successful', 'success');
    } catch (error: any) {
      console.error('Google login error:', error);

      if (error.code === googleSignInStatusCodes.SIGN_IN_CANCELLED) {
        showToast('Login cancelled', 'error');
      } else if (error.code === googleSignInStatusCodes.IN_PROGRESS) {
        showToast('Google login already in progress', 'error');
      } else if (
        error.code === googleSignInStatusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        showToast('Google Play Services is not available', 'error');
      } else if (
        error.code === 'auth/account-exists-with-different-credential'
      ) {
        showToast('Account exists with another sign-in method', 'error');
      } else {
        showToast(error.message || 'Google login failed', 'error');
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  return {
    currentImageIndex,
    images,
    loading: loadingProvider !== null,
    toast,
    titleStyle,
    buttonStyle,
    bgAnimatedStyle,
    handleLogin,
    handleRegister,
    showToast,
    hideToast,
    handleGoogleLogin,
    handleGitHubLogin,
  };
};

export default useLandingPageViewModel;
