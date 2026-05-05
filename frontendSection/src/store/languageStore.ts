import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import i18n from '@src/config/i18n';
import { LanguageStorage } from '@src/utils/mmkv';

export type Language = 'en' | 'hi' | 'fr' | 'es' | 'zh';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export const languageOptions: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
];

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  getLanguageName: (code: Language) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language: Language) => {
        i18n.changeLanguage(language);
        set({ language });
      },
      getLanguageName: (code: Language) => {
        const option = languageOptions.find(opt => opt.code === code);
        return option?.name || code;
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => LanguageStorage),
      partialize: (state) => ({
        language: state.language,
      }),
    }
  )
);
