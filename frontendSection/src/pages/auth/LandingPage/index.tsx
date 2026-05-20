import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import { fonts } from '@src/config/fonts';
import Toast from '@src/components/atom/Toast';
import { useColors } from '@src/utils/colors';
import CustomButton from '@src/components/atom/CustomButton';
import { createStyles } from '@src/pages/auth/LandingPage/styles';
import useLandingPageViewModel from '@src/viewModels/auth/useLandingPageViewModel';
import { isIos } from '@src/utils/platformCheck';
import { LinkedInLoginModal } from '@src/config/linkedInAuth';
import { PinterestShowcaseBackground } from '@src/components/organism/PinterestShowcaseBackground';

interface LandingPageProps {
  navigation: any;
}

const LandingPage = ({ navigation }: LandingPageProps) => {
  const {
    images,
    loading,
    toast,
    linkedInModalRef,
    titleStyle,
    buttonStyle,
    handleLogin,
    handleRegister,
    hideToast,
    handleGoogleLogin,
    handleGitHubLogin,
    handleLinkedInLogin,
    handleLinkedInSuccess,
    handleLinkedInError,
  } = useLandingPageViewModel({ navigation });

  const themeColors = useColors();
  const dynamicStyles = createStyles(themeColors);

  return (
    <View
      style={[
        dynamicStyles.backgroundImage,
        { backgroundColor: themeColors.backgroundDark },
      ]}
    >
      <PinterestShowcaseBackground images={images} />

      <SafeAreaView style={dynamicStyles.container}>
        

        <LinearGradient
          colors={[
            'rgba(10, 10, 14, 0.0)',
            'rgba(10, 10, 14, 0.6)',
            'rgba(10, 10, 14, 0.85)',
          ]}
          style={StyleSheet.absoluteFill}
        />

        <View style={dynamicStyles.innerContainer}>
          <Animated.Text style={[dynamicStyles.title, titleStyle]}>
            ComicVerse
          </Animated.Text>
          <Animated.Text style={[dynamicStyles.subtitle, titleStyle]}>
            Enter ComicVerse – your ultimate hub for comics and movies! Shop
            exclusive merch and watch your favorite stories in one place.
            {'\n\n'}
            Enter the World of Heroes
          </Animated.Text>
        </View>

        <Animated.View
          style={[dynamicStyles.socialButtonContainer, buttonStyle]}
        >
          <CustomButton
            title="Google"
            icon={require('@src/assets/icons/googleLogo.png')}
            onPress={handleGoogleLogin}
            disabled={loading}
            buttonStyle={dynamicStyles.socialLoginButton}
            textStyle={dynamicStyles.socialButtonTextRegister}
          />

          <CustomButton
            title="Facebook"
            icon={require('@src/assets/icons/facebookLogo.png')}
            onPress={handleRegister}
            buttonStyle={dynamicStyles.socialLoginButton}
            textStyle={dynamicStyles.socialButtonTextRegister}
          />

          <CustomButton
            title="Github"
            icon={require('@src/assets/icons/githubLogo.png')}
            iconTintColor="#FFFFFF"
            onPress={handleGitHubLogin}
            disabled={loading}
            buttonStyle={dynamicStyles.socialLoginButton}
            textStyle={dynamicStyles.socialButtonTextRegister}
          />
        </Animated.View>

        <Animated.View
          style={[dynamicStyles.containerSocialLoginButton, buttonStyle]}
        >
          <CustomButton
            title={isIos ? 'LinkedIn' : 'Continue with LinkedIn'}
            icon={require('@src/assets/icons/linkedinLogo.png')}
            onPress={handleLinkedInLogin}
            disabled={loading}
            buttonStyle={dynamicStyles.socialLoginButton2}
            textStyle={dynamicStyles.socialButtonText}
            customButtonContent={{ flexDirection: 'row', gap: 12 }}
          />
          {isIos && (
            <CustomButton
              title="Apple"
              icon={require('@src/assets/icons/appleLogo.png')}
              onPress={handleRegister}
              buttonStyle={dynamicStyles.socialLoginButton2}
              textStyle={dynamicStyles.socialButtonText}
              customButtonContent={{ flexDirection: 'row', gap: 12 }}
            />
          )}
        </Animated.View>

        <Animated.View style={[dynamicStyles.buttonContainer, buttonStyle]}>
          <CustomButton
            title="Login"
            onPress={handleLogin}
            buttonStyle={dynamicStyles.loginButton}
            textStyle={dynamicStyles.buttonText}
            font={fonts.nunitoSemiBold}
          />
          
          <CustomButton
            title="Register"
            onPress={handleRegister}
            buttonStyle={dynamicStyles.registerButton}
            textStyle={dynamicStyles.buttonTextRegister}
          />
        </Animated.View>
      </SafeAreaView>

      <LinkedInLoginModal
        ref={linkedInModalRef}
        onSuccess={handleLinkedInSuccess}
        onError={handleLinkedInError}
      />

      {loading && (
        <View style={dynamicStyles.fullScreenLoader}>
          <ActivityIndicator size="large" color={themeColors.text} />
        </View>
      )}
      <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onHide={hideToast}
        />
    </View>
  );
};

export default LandingPage;
