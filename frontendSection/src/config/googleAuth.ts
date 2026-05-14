import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

const googleWebClientId =
  Config.GOOGLE_WEB_CLIENT_ID ||
  '234532193651-utigfip60l8k2eo23tnjdj8s0h0707ki.apps.googleusercontent.com';

const configureGoogleSignIn = () => {
  if (!googleWebClientId) {
    throw new Error('Missing GOOGLE_WEB_CLIENT_ID in .env');
  }

  GoogleSignin.configure({
    webClientId: googleWebClientId,
    scopes: ['email', 'profile'],
  });
};

export const loginWithGoogle = async () => {
  configureGoogleSignIn();

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const response = await GoogleSignin.signIn();

  if (response.type === 'cancelled') {
    const error = new Error('Google login cancelled') as Error & {
      code: string;
    };
    error.code = statusCodes.SIGN_IN_CANCELLED;
    throw error;
  }

  if (!response.data.idToken) {
    throw new Error('Google ID token not found');
  }

  return {
    idToken: response.data.idToken,
    user: response.data.user,
  };
};

export { statusCodes as googleSignInStatusCodes };
