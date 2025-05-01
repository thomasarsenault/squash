import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thomasarsenault.squash',
  appName: 'squash',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
