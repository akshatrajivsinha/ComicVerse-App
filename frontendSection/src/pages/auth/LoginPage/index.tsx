import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { colors } from '@src/utils/colors';

import Footer from '@src/components/atom/Footer';
import Toast from '@src/components/atom/Toast';
import BackButton from '@src/components/atom/BackButton';
import CustomButton from '@src/components/atom/CustomButton';
import { styles } from './styles';
import { useLoginPageViewModel } from '@src/viewModels/auth/useLoginPageViewModel';

const LoginPage = ({ navigation }: { navigation: any }) => {
  const {
    loading,
    loginType,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    password,
    setPassword,
    toggleLoginType,
    titleStyle,
    inputStyle,
    buttonStyle,
    toggleIndicatorStyle,
    passwordFieldStyle,
    onPressIn,
    onPressOut,
    handleSendOTP,
    toast,
    hideToast,
  } = useLoginPageViewModel({ navigation });

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
            LOGIN
          </Animated.Text>

          <Animated.Text style={[styles.subtitle, titleStyle]}>
            {loginType === 'phone'
              ? 'Login with your mobile number'
              : 'Login with your email'}
          </Animated.Text>

          <View style={styles.toggleContainer}>
            <Animated.View
              style={[styles.toggleIndicator, toggleIndicatorStyle]}
            />
            <Pressable onPress={toggleLoginType} style={styles.toggleButton}>
              <Text
                style={[
                  styles.toggleButtonText,
                  loginType === 'phone'
                    ? styles.toggleButtonTextActive
                    : styles.toggleButtonTextInactive,
                ]}
              >
                Phone
              </Text>
            </Pressable>
            <Pressable onPress={toggleLoginType} style={styles.toggleButton}>
              <Text
                style={[
                  styles.toggleButtonText,
                  loginType === 'email'
                    ? styles.toggleButtonTextActive
                    : styles.toggleButtonTextInactive,
                ]}
              >
                Email
              </Text>
            </Pressable>
          </View>

          <Animated.View style={[styles.inputContainer, inputStyle]}>
            {loginType === 'phone' && <Text style={styles.prefix}>+91</Text>}
            <TextInput
              placeholder={
                loginType === 'phone'
                  ? 'Enter phone number'
                  : 'Enter email address'
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
            <Animated.View
              style={[styles.inputContainer, inputStyle, passwordFieldStyle]}
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
          )}

          <Animated.View style={buttonStyle}>
            <CustomButton
              title={loginType === 'phone' ? 'Send OTP' : 'Submit'}
              onPress={handleSendOTP}
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

export default LoginPage;
