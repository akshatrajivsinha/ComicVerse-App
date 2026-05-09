import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

const storage = new MMKV({
  id: 'auth-storage',
});

const languageStorage = new MMKV({
  id: 'language-storage',
});

export const AuthStorage: StateStorage = {
  getItem: (name: string) => {
      const value = storage.getString(name);
      return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

export const LanguageStorage: StateStorage = {
  getItem: (name: string) => {
      const value = languageStorage.getString(name);
      return value ?? null;
  },
  setItem: (name: string, value: string) => {
    languageStorage.set(name, value);
  },
  removeItem: (name: string) => {
    languageStorage.delete(name);
  },
};