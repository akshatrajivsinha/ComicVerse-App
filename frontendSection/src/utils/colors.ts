import { useThemeStore } from '@src/store/themeStore';
import { themes } from '@src/config/theme';

export const colors = {
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
  
  // Status bar colors
  statusBarDark: '#000000',
  statusBarLight: '#FFFFFF',
  
  // Background colors
  background: '#000000',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#0F172A',
  backgroundCard: '#1E293B',
  backgroundLightGray: '#eaeef4ff',
  
  // Text colors
  text: '#FFFFFF',
  textDark: '#29292cd6',
  textGray: '#999',
  textSlate: '#94A3B8',
  textSlateDark: '#64748B',
  
  // Common colors
  primary: '#007AFF',
  primaryBlue: '#3B82F6',
  secondary: '#5856D6',
  secondaryPurple: '#6344efff',
  success: '#34C759',
  successGreen: '#10B981',
  warning: '#FF9500',
  error: '#FF3B30',
  errorRed: '#EF4444',
  teal: '#1a5252d6',
  
  // Border colors
  border: '#334155',
  
  // Shadow colors
  shadow: '#000000',
  
  // Skeleton colors
  skeleton: '#4e6e96ff',
};

export const useColors = () => {
  const theme = useThemeStore((state) => state.theme);
  return themes[theme];
};
