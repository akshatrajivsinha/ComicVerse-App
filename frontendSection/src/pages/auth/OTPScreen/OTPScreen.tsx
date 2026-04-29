import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { colors } from '@src/utils/colors';

import BackButton from '@src/components/BackButton';
import Toast from '@src/components/Toast';
import { styles } from './styles';
import { useOTPScreenViewModel } from '@src/viewModels/auth/useOTPScreenViewModel';

interface OTPScreenProps {
  navigation: any;
  route: any;
}

const OTPScreen = ({ navigation, route }: OTPScreenProps) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
  ];

  const {
    loading,
    titleStyle,
    inputStyle,
    buttonStyle,
    onPressIn,
    onPressOut,
    handleVerifyOTP,
    toast,
    hideToast,
  } = useOTPScreenViewModel({ navigation, route });

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.innerContainer}>
        <Animated.Text style={[styles.title, titleStyle]}>
          VERIFY OTP
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, titleStyle]}>
          Enter the 4-digit code sent to your phone
        </Animated.Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <Animated.View
              key={index}
              style={[styles.otpInputContainer, inputStyle]}
            >
              <TextInput
                ref={inputRefs[index]}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={value => handleOtpChange(index, value)}
                onKeyPress={({ nativeEvent: { key } }) =>
                  handleOtpKeyPress(index, key)
                }
                textAlign="center"
                placeholderTextColor={colors.textGray}
              />
            </Animated.View>
          ))}
        </View>

        <Animated.View style={buttonStyle}>
          <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => handleVerifyOTP(otp.join(''))}
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator animating={loading} color={colors.text} />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </Pressable>
        </Animated.View>

        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.resendLink}
        >
          <Text style={styles.resendText}>Didn't receive code? Resend</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;
