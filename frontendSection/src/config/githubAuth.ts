import { authorize } from 'react-native-app-auth';
import Config from 'react-native-config';

// GitHub OAuth Configuration
// You need to replace these values with your GitHub OAuth App credentials
const githubConfig = {
  clientId: Config.GITHUB_CLIENT_ID || '',
  clientSecret: Config.GITHUB_CLIENT_SECRET || '',
  redirectUrl: Config.GITHUB_REDIRECT_URI || '',
  scopes: ['read:user', 'user:email'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: 'https://github.com/settings/connections/applications/YOUR_GITHUB_CLIENT_ID',
  },
};

export const loginWithGitHub = async () => {
  try {
    const result = await authorize(githubConfig);
    console.log("Result from GitHub OAuth:", result);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      idToken: result.idToken,
    };
  } catch (error) {
    console.error('GitHub login error:', error);
    throw error;
  }
};

export default githubConfig;
