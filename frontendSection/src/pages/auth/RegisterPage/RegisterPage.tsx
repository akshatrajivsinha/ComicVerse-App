import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { colors } from '@src/utils/colors';

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
            REGISTER
          </Animated.Text>

          <Animated.Text style={[styles.subtitle, titleStyle]}>
            {loginType === 'phone'
              ? 'Register with your mobile number'
              : 'Register with your email'}
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
