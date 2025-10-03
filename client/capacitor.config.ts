import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.medimitra.app",
  appName: "medimitra",
  webDir: "public",
  server: {
    url: "https://development-medimitra.udayan.fyi/",
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    App: {
      disableBackButtonHandler: false,
    },
  },
};

export default config;
