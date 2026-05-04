import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  createAnimatedComponent,
  runOnJS,
} from 'react-native-reanimated';
import { styles } from './styles';
import CustomButton from '@src/components/CustomButton';
import { fonts } from '@src/config/fonts';

const AnimatedImageBackground = createAnimatedComponent(ImageBackground);

interface LandingPageProps {
  navigation: any;
}

const LandingPage = ({ navigation }: LandingPageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const bgOpacity = useSharedValue(1);

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

  return (
    <View style={styles.backgroundImage}>
      <AnimatedImageBackground
        source={images[currentImageIndex]}
        style={[StyleSheet.absoluteFill, bgAnimatedStyle]}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.container}>
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
            onPress={handleRegister}
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
