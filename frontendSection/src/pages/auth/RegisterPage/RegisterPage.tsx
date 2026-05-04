import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { colors } from '@src/utils/colors';
import CustomText from '@src/components/CustomText';
import { fonts } from '@src/config/fonts';

import BackButton from '@src/components/BackButton';
import Toast from '@src/components/Toast';
import CustomButton from '@src/components/CustomButton';
import { styles } from './styles';
import { useRegisterPageViewModel } from '@src/viewModels/auth/useRegisterPageViewModel';
import Footer from '@src/components/Footer';

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
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
      <View>
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
            <Pressable onPress={toggleLoginType} style={styles.toggleButton}>
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
            <Pressable onPress={toggleLoginType} style={styles.toggleButton}>
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

          <Animated.View style={[styles.inputContainer, inputStyle]}>
            {loginType === 'phone' && <CustomText font={fonts.nunitoMedium} style={styles.prefix}>+91</CustomText>}
            <TextInput
              placeholder={
                loginType === 'phone' ? 'Enter phone number' : 'Enter email'
              }
              keyboardType={
                loginType === 'phone' ? 'number-pad' : 'email-address'
              }
              maxLength={loginType === 'phone' ? 10 : undefined}
              style={styles.input}
              placeholderTextColor={colors.textGray}
              value={loginType === 'phone' ? phoneNumber : email}
              onChangeText={loginType === 'phone' ? setPhoneNumber : setEmail}
            />
          </Animated.View>

          {loginType === 'email' && (
            <>
              <Animated.View style={[styles.inputContainer, inputStyle]}>
                <TextInput
                  placeholder="Enter password"
                  secureTextEntry
                  style={styles.input}
                  placeholderTextColor={colors.textGray}
                  value={password}
                  onChangeText={setPassword}
                />
              </Animated.View>

              <Animated.View style={[styles.inputContainer, inputStyle]}>
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
      <Footer />
    </SafeAreaView>
  );
};

export default RegisterPage;
