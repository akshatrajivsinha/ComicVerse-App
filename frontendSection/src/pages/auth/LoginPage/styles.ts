import { StyleSheet } from 'react-native';
import { colors } from '@src/utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    justifyContent:'space-between'
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
    marginBottom: 20,
    marginTop: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 4,
    position: 'relative',
  },
  toggleIndicator: {
    position: 'absolute',
    left: 4,
    width: '48%',
    height: '98%',
    top: 4,
    backgroundColor: colors.text,
    borderRadius: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 1,
  },
  toggleActive: {
    backgroundColor: colors.primaryBlue,
  },
  toggleInactive: {
    backgroundColor: 'transparent',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: colors.secondaryPurple,
  },
  toggleButtonTextInactive: {
    color: colors.textSlate,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 58,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.border,
  },
  prefix: {
    color: colors.text,
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  button: {
    height: 58,
    borderRadius: 14,
    backgroundColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryBlue,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: colors.secondaryPurple,
    fontSize: 17,
    fontWeight: '600',
  },
});
