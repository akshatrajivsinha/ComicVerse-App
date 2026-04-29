import { StyleSheet } from 'react-native';
import { colors } from '@src/utils/colors';

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
    // paddingTop: 50,
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
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSlate,
    marginBottom: 40,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingBottom: 16,
    gap: 16,
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
    fontWeight: '700',
  },
  buttonTextRegister: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
