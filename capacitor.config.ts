import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shinecycle.laundry',
  appName: 'ShineCycle',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*'],
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    // Optimize for production builds
    minWebViewVersion: 55
  },
  ios: {
    allowsLinkPreview: false,
    // iOS specific optimizations
    scrollEnabled: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1E293B",
      showSpinner: false,
      androidSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    Camera: {
      saveToGallery: true,
      allowEditing: true,
      quality: 90
    },
    Geolocation: {
      timeout: 10000,
      enableHighAccuracy: true
    }
  }
};

export default config;
