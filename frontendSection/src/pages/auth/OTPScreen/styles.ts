import { StyleSheet } from 'react-native';
import { colors } from '@src/utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  innerContainer: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSlate,
    marginBottom: 40,
    marginTop: 8,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInputContainer: {
    width: 70,
    height: 70,
    backgroundColor: colors.backgroundCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    flex: 1,
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    height: 58,
    borderRadius: 14,
    backgroundColor: colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryBlue,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  resendLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    color: colors.primaryBlue,
    fontSize: 14,
    fontWeight: '500',
  },
});
