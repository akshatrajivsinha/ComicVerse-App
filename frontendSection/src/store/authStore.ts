import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { AuthStorage } from '@src/utils/mmkv';

interface AuthState {
  authToken: string | null;
  hasHydrated: boolean;
  setAuthToken: (token: string | null) => void;
  clearAuthToken: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  immer(
    persist(
      (set) => ({
        authToken: null,
        hasHydrated: false,

        setAuthToken: (token) =>
          set((state) => {
            state.authToken = token;
          }),

        clearAuthToken: () =>
          set((state) => {
            state.authToken = null;
          }),

        setHasHydrated: (hydrated) =>
          set((state) => {
            state.hasHydrated = hydrated;
          }),
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => AuthStorage),

        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },

        partialize: (state) => ({
          authToken: state.authToken,
        }),
      }
    )
  )
);