import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "tMinus1",
  slug: "tMinus1",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",
  scheme: "tminus1",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.anonymous.tMinus1",
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#171D22",
      foregroundImage: "./src/assets/images/android-icon-foreground.png",
      backgroundImage: "./src/assets/images/android-icon-background.png",
      monochromeImage: "./src/assets/images/android-icon-monochrome.png",
    },
    backgroundColor: "#171D22",
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: [
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO",
      "android.permission.RECEIVE_BOOT_COMPLETED",
      "android.permission.VIBRATE",
      "android.permission.USE_BIOMETRIC",
      "android.permission.USE_FINGERPRINT",
    ],
    package: "com.anonymous.tMinus1",
  },
  web: {
    output: "static",
    favicon: "./src/assets/images/favicon.png",
    bundler: "metro",
  },
  plugins: [
    [
      "expo-file-system",
      [
        "@react-native-async-storage/async-storage",
        {
          exclude: ["NSUserDefaults"],
        },
      ],
    ],
    [
      "expo-camera",
      {
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
        recordAudioAndroid: true,
        barcodeScannerEnabled: true,
      },
    ],
    [
      "expo-router",
      {
        root: "src/app",
      },
    ],

    [
      "expo-local-authentication",
      {
        faceIDPermission:
          "Allow $(PRODUCT_NAME) to use Face ID for authentication.",
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./src/assets/images/icon.png",
        color: "#171D22",
        defaultChannel: "default",
        sounds: [],
      },
    ],
    "expo-font",
    "expo-secure-store",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {
      root: "src/app",
    },
    eas: {
      projectId: "ec17c97d-2d53-4fab-a16b-2804f3a559a4",
    },
  },
});
