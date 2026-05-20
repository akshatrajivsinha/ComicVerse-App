import React from 'react';
import {
  View,
  TextInput,
  Pressable,
  ImageBackground,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from '@src/utils/colors';
import CustomText from '@src/components/atom/CustomText';
import { fonts } from '@src/config/fonts';
import BackButton from '@src/components/atom/BackButton';
import Toast from '@src/components/atom/Toast';
import CustomButton from '@src/components/atom/CustomButton';
import { styles } from './styles';
import { useRegisterPageViewModel } from '@src/viewModels/auth/useRegisterPageViewModel';
import Footer from '@src/components/atom/Footer';

interface RegisterPageProps {
  navigation: any;
}

const RegisterPage = ({ navigation }: RegisterPageProps) => {
  const {
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
  } = useRegisterPageViewModel({ navigation });

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('@src/assets/images/comicBookCover_2.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.85)',
            'rgba(0,0,0,0.8)',
            'rgba(0,0,0,0.7)',
          ]}
          locations={[0, 0.5, 1]}
          style={{ flex: 1 }}
        >
          <Toast
            visible={toast.visible}
            message={toast.message}
            type={toast.type}
            onHide={hideToast}
          />

          <View style={{ flex: 1 }}>
            <BackButton onPress={() => navigation.goBack()} />

            <View style={styles.innerContainer}>
              <Animated.Text style={[styles.title, titleStyle]}>
                <CustomText font={fonts.bebasNeue}>REGISTER</CustomText>
              </Animated.Text>

              <Animated.Text style={[styles.subtitle, titleStyle]}>
                <CustomText font={fonts.nunitoMedium}>
                  {loginType === 'phone'
                    ? 'Register with your mobile number'
                    : 'Register with your email'}
                </CustomText>
              </Animated.Text>

              <View style={styles.toggleContainer}>
                <Animated.View
                  style={[styles.toggleIndicator, toggleIndicatorStyle]}
                />

                <Pressable
                  onPress={toggleLoginType}
                  style={styles.toggleButton}
                >
                  <CustomText
                    font={fonts.nunitoSemiBold}
                    style={[
                      styles.toggleButtonText,
                      loginType === 'phone'
                        ? styles.toggleButtonTextActive
                        : styles.toggleButtonTextInactive,
                    ]}
                  >
                    Phone
                  </CustomText>
                </Pressable>

                <Pressable
                  onPress={toggleLoginType}
                  style={styles.toggleButton}
                >
                  <CustomText
                    font={fonts.nunitoSemiBold}
                    style={[
                      styles.toggleButtonText,
                      loginType === 'email'
                        ? styles.toggleButtonTextActive
                        : styles.toggleButtonTextInactive,
                    ]}
                  >
                    Email
                  </CustomText>
                </Pressable>
              </View>

              <Animated.View
                style={[styles.inputContainer, inputStyle]}
              >
                {loginType === 'phone' && (
                  <CustomText
                    font={fonts.nunitoMedium}
                    style={styles.prefix}
                  >
                    +91  |
                  </CustomText>
                )}

                <TextInput
                  placeholder={
                    loginType === 'phone'
                      ? 'Enter phone number'
                      : 'Enter email'
                  }
                  keyboardType={
                    loginType === 'phone'
                      ? 'number-pad'
                      : 'email-address'
                  }
                  maxLength={loginType === 'phone' ? 10 : undefined}
                  style={styles.input}
                  placeholderTextColor={colors.textGray}
                  value={loginType === 'phone' ? phoneNumber : email}
                  onChangeText={
                    loginType === 'phone'
                      ? setPhoneNumber
                      : setEmail
                  }
                />
              </Animated.View>

              {loginType === 'email' && (
                <>
                  <Animated.View
                    style={[styles.inputContainer, inputStyle]}
                  >
                    <TextInput
                      placeholder="Enter password"
                      secureTextEntry
                      style={styles.input}
                      placeholderTextColor={colors.textGray}
                      value={password}
                      onChangeText={setPassword}
                    />
                  </Animated.View>

                  <Animated.View
                    style={[styles.inputContainer, inputStyle]}
                  >
                    <TextInput
                      placeholder="Confirm password"
                      secureTextEntry
                      style={styles.input}
                      placeholderTextColor={colors.textGray}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                  </Animated.View>
                </>
              )}

              <Animated.View style={buttonStyle}>
                <CustomButton
                  title="Register"
                  onPress={handleRegister}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                  loading={loading}
                  buttonStyle={styles.button}
                  textStyle={styles.buttonText}
                />
              </Animated.View>
            </View>

          </View>
            <Footer textStyle={styles.footerTitle}/>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default RegisterPage;