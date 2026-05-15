import React from 'react';
import { View } from 'react-native';
import LinkedInModal, {
  type ErrorType,
  type LinkedInModalRef,
  type LinkedInToken,
} from '@gcou/react-native-linkedin';
import Config from 'react-native-config';

const linkedInConfig = {
  clientID: Config.LINKEDIN_CLIENT_ID ?? '',
  clientSecret: Config.LINKEDIN_CLIENT_SECRET ?? '',
  redirectUri: Config.LINKEDIN_REDIRECT_URI ?? '',
};

export const isLinkedInConfigured = () =>
  Boolean(linkedInConfig.clientID && linkedInConfig.redirectUri);

interface LinkedInLoginModalProps {
  onSuccess: (token: LinkedInToken) => void;
  onError: (error: ErrorType) => void;
}

export const LinkedInLoginModal = React.forwardRef<
  LinkedInModalRef,
  LinkedInLoginModalProps
>(({ onSuccess, onError }, ref) => (
  <LinkedInModal
    ref={ref}
    clientID={linkedInConfig.clientID}
    clientSecret={linkedInConfig.clientSecret}
    redirectUri={linkedInConfig.redirectUri}
    permissions={['openid', 'profile', 'email']}
    shouldGetAccessToken
    onSuccess={onSuccess}
    onError={onError}
    renderButton={<View />}
    isDisabled={!isLinkedInConfigured()}
  />
));

export type { ErrorType as LinkedInError, LinkedInModalRef, LinkedInToken };
