import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  createAnimatedComponent,
} from 'react-native-reanimated';
import { styles } from './styles';
import CustomButton from '@src/components/CustomButton';
import { fonts } from '@src/config/fonts';
import Toast from '@src/components/Toast';
import  useLandingPageViewModel  from '@src/viewModels/auth/useLandingPageViewModel';

const AnimatedImageBackground = createAnimatedComponent(ImageBackground);

interface LandingPageProps {
  navigation: any;
}

const LandingPage = ({ navigation }: LandingPageProps) => {
  const {
    currentImageIndex,
    images,
    loading,
    toast,
    titleStyle,
    buttonStyle,
    bgAnimatedStyle,
    handleLogin,
    handleRegister,
    hideToast,
    handleGitHubLogin,
  } = useLandingPageViewModel({ navigation });

  return (
    <View style={styles.backgroundImage}>
      <AnimatedImageBackground
        source={images[currentImageIndex]}
        style={[StyleSheet.absoluteFill, bgAnimatedStyle]}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.container}>
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onHide={hideToast}
        />
        <View style={styles.innerContainer}>
          <Animated.Text style={[styles.title, titleStyle]}>
            ComicVerse
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, titleStyle]}>
            Enter ComicVerse – your ultimate hub for comics and movies! Shop
            exclusive merch and watch your favorite stories in one place.
            {'\n\n'}
            Enter the World of Heroes
          </Animated.Text>
        </View>
        <Animated.View style={[styles.socialButtonContainer, buttonStyle]}>
          <CustomButton
            title="Google"
            icon={require('@src/assets/icons/googleLogo.png')}
            onPress={handleLogin}
            buttonStyle={styles.socialLoginButton}
            textStyle={styles.socialButtonTextRegister}
          />

          <CustomButton
            title="Facebook"
            icon={require('@src/assets/icons/facebookLogo.png')}
            onPress={handleRegister}
            buttonStyle={styles.socialLoginButton}
            textStyle={styles.socialButtonTextRegister}
          />

          <CustomButton
            title="Github"
            icon={require('@src/assets/icons/githubLogo.png')}
            iconTintColor="#FFFFFF"
            onPress={handleGitHubLogin}
            loading={loading}
            buttonStyle={styles.socialLoginButton}
            textStyle={styles.socialButtonTextRegister}
          />
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <CustomButton
            title="Login"
            onPress={handleLogin}
            buttonStyle={styles.loginButton}
            textStyle={styles.buttonText}
            font={fonts.nunitoSemiBold}
          />

          <CustomButton
            title="Register"
            onPress={handleRegister}
            buttonStyle={styles.registerButton}
            textStyle={styles.buttonTextRegister}
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

export default LandingPage;
