import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.medimitra.app",
  appName: "medimitra",
  webDir: "public",
  server: {
    url: "https://development-medimitra.udayan.fyi/",
  },
};

export default config;
