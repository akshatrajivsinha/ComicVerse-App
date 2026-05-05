import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LanguageStorage } from '@src/utils/mmkv';

export type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const { theme } = get();
        set({ theme: theme === 'dark' ? 'light' : 'dark' });
      },
      setTheme: (theme: Theme) => {
        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => LanguageStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);
