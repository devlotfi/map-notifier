declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_MAPTILER_API_KEY: string;
    }
  }
}

export {};
