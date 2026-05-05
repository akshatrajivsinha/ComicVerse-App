import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';
import zh from '../locales/zh.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  fr: { translation: fr },
  es: { translation: es },
  zh: { translation: zh },
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
