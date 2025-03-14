import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Map Notifier",
  slug: "Map-Notifier",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./icons/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./icons/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    icon: {
      light: "./icons/ios-light.png",
      dark: "./icons/ios-datk.png",
      tinted: "./icons/ios-tinted.png",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./icons/adaptive-icon.png",
      backgroundColor: "#ffffff",
      monochromeImage: "./icons/adaptive-icon.png",
    },
    package: "com.anonymous.MapNotifier",
  },
  web: {
    favicon: "./icons/favicon.png",
  },
  plugins: [
    "@maplibre/maplibre-react-native",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location.",
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
      },
    ],
  ],
});
