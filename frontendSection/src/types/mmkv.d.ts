declare module 'react-native-mmkv' {
  const MMKV: {
    new (config?: { id?: string }): {
      getString(key: string): string | undefined;
      set(key: string, value: string): void;
      delete(key: string): void;
    };
  };
  export { MMKV };
}
