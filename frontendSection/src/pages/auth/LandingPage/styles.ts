import { StyleSheet } from 'react-native';
import { colors } from '@src/utils/colors';
import { fonts } from '@src/config/fonts';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: colors.background
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.57)',
    paddingHorizontal: 12,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    fontFamily: fonts.nunitoExtraBold
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
    fontFamily: fonts.nunitoBold
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingBottom: 16,
    gap: 14,
  },
  socialButtonContainer: {
    flexDirection: 'row',
    paddingBottom: 16,
    gap: 6,
  },
  loginButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.backgroundLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryBlue,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  registerButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.secondaryPurple,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.errorRed,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: colors.secondaryPurple,
    fontSize: 16,
    fontWeight: '700'
  },
  buttonTextRegister: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  socialButtonTextRegister: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  socialLoginButton: {
    flex: 1,
    height: 75,
    borderRadius: 8,
    backgroundColor: colors.textDark
  },
});
