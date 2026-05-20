import { useEffect, useRef, useState } from 'react';

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
import axios from 'axios'; // Imported Axios for backend synchronization
import { loginWithGitHub } from '@src/config/githubAuth';
import {
  googleSignInStatusCodes,
  loginWithGoogle,
} from '@src/config/googleAuth';
import {
  isLinkedInConfigured,
  type LinkedInError,
  type LinkedInModalRef,
  type LinkedInToken,
} from '@src/config/linkedInAuth';
import { screenNames } from '@src/navigation/screenName';

interface UseLandingPageViewModelProps {
  navigation: any;
}

const useLandingPageViewModel = ({
  navigation,
}: UseLandingPageViewModelProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingProvider, setLoadingProvider] = useState<
    'google' | 'github' | 'linkedin' | null
  >(null);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const bgOpacity = useSharedValue(1);
  const linkedInModalRef = useRef<LinkedInModalRef>(null);
  const setAuthToken = useAuthStore(state => state.setAuthToken);

  const images = [
    require('@src/assets/images/AvengerEndgamePoster.jpg'),
    require('@src/assets/images/BlackAdam.webp'),
    require('@src/assets/images/CaptainMarvelProfile.webp'),
    require('@src/assets/images/Naruto.jpg'),
    require('@src/assets/images/IronMan.jpg'),
    require('@src/assets/images/starWarLastJedi.webp'),
    require('@src/assets/images/CaptainAmerica.jpg'),
    require('@src/assets/images/BatmanProfile.jpg'),
    require('@src/assets/images/KaliPoster.webp'),
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
  }, [currentImageIndex, bgOpacity, images.length]); // Added missing dependencies to stop infinite loops

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
  }, [opacity, titleY, buttonY]); // Added missing dependencies

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

  const syncUserWithBackend = async (
    token: string, 
    provider: 'google' | 'github' | 'linkedin',
    userProfile?: { email: string | null; displayName: string | null; uid?: string }
  ) => {
    console.log("userProfile",userProfile);
    try {
      // Update this URL string to match your newly deployed Cloud Function route
      const BACKEND_SOCIAL_AUTH_URL = 'https://createuserbysociallogins-cm5h7rlbta-uc.a.run.app';
      
      const response = await axios.post(BACKEND_SOCIAL_AUTH_URL, {
        email: userProfile?.email,
        name: userProfile?.displayName,
        uid: userProfile?.uid,
        provider: provider,
        authToken: token
      });

      if (response.data?.success) {
        setAuthToken(token);
        showToast(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful`, 'success');
      } else {
        throw new Error(response.data?.error || 'Database sync rejected.');
      }
    } catch (error: any) {
      console.error(`Backend sync failure for ${provider}:`, error);
      showToast('Account verified, but database synchronization failed.', 'error');
    }
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

      // Pass Firebase Auth context values down to your custom database
      await syncUserWithBackend(idToken, 'github', {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        uid: userCredential.user.uid,
      });

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

      // Pass Firebase Auth context values down to your custom database
      await syncUserWithBackend(idToken, 'google', {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        uid: userCredential.user.uid,
      });

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

  const handleLinkedInLogin = () => {
    if (loadingProvider) return;

    if (!isLinkedInConfigured()) {
      showToast('LinkedIn login is not configured', 'error');
      return;
    }

    linkedInModalRef.current?.open();
  };

const handleLinkedInSuccess = async (token: LinkedInToken) => {
    setLoadingProvider('linkedin');

    try {
      const linkedInToken = token.access_token ?? token.authentication_code;

      if (!linkedInToken) {
        throw new Error('LinkedIn access token not found');
      }

      // 1. Fetch User Profile Data from LinkedIn's UserInfo Endpoint
      // (If your LinkedIn package already provides token.user, you can skip this fetch)
      const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${linkedInToken}`,
        },
      });

      const { email, name, sub } = response.data; // 'sub' is LinkedIn's unique user ID

      if (!email) {
        throw new Error('Could not retrieve email from LinkedIn profile.');
      }

      // 2. Synchronize with your backend database with the proper fields filled out!
      await syncUserWithBackend(linkedInToken, 'linkedin', {
        email: email,
        displayName: name || '',
        uid: `linkedin_${sub}`, // Generate a unique UID string for your backend database key
      });

    } catch (error: any) {
      console.error('LinkedIn login error:', error);
      showToast(error.message || 'LinkedIn login failed', 'error');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleLinkedInError = (error: LinkedInError) => {
    setLoadingProvider(null);
    console.error('LinkedIn login error:', error);
    showToast(error.message || 'LinkedIn login failed', 'error');
  };

  return {
    currentImageIndex,
    images,
    loading: loadingProvider !== null,
    toast,
    linkedInModalRef,
    titleStyle,
    buttonStyle,
    bgAnimatedStyle,
    handleLogin,
    handleRegister,
    showToast,
    hideToast,
    handleGoogleLogin,
    handleGitHubLogin,
    handleLinkedInLogin,
    handleLinkedInSuccess,
    handleLinkedInError,
  };
};

export default useLandingPageViewModel;