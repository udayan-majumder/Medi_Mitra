import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.medimitra.app",
  appName: "medimitra",
  webDir: "public",
  server: {
    url: "http://192.168.1.3:3000/",
  },
};

export default config;
