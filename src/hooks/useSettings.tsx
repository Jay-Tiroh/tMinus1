import { UserSettings } from "@/types/profile";

// Replace with your actual icon imports from Expo/React
import LanguageIcon from "@/assets/icons//user/language.svg";
import BellIcon from "@/assets/icons/bell.svg";
import FingerprintIcon from "@/assets/icons/fingerprint.svg";
import CurrencyIcon from "@/assets/icons/user/dollar.svg";
import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SvgProps } from "react-native-svg";

export interface SettingsListItem {
  label: string;
  value: string | boolean;
  icon?: React.FC<SvgProps>;
  altIcon?: (props: { color: string; size: number }) => React.ReactNode;
  options?: string[];
  type: "dropdown" | "toggle"; // Helps your UI know which component to render
  settingKey: string; // New: This tells the Item which API key it represents for updates
}

export const buildSettingsList = (
  settings: UserSettings,
): SettingsListItem[] => [
  {
    label: "Theme",
    value: settings.theme,
    altIcon: ({ color = Colors.profit, size = 17 }) => (
      <FontAwesome6 name="paint-roller" size={size} color={color} />
    ),
    options: ["light", "dark", "system"],
    type: "dropdown",
    settingKey: "theme",
  },
  {
    label: "Fiat Currency",
    value: settings.fiatCurrency,
    icon: CurrencyIcon,
    options: ["USD", "EUR", "GBP", "NGN"],
    type: "dropdown",
    settingKey: "fiatCurrency",
  },
  {
    label: "Language",
    value: settings.language,
    icon: LanguageIcon,
    options: ["en", "es", "fr"],
    type: "dropdown",
    settingKey: "language",
  },
  {
    label: "Price Alerts",
    value: settings.priceAlerts,
    altIcon: ({ color = Colors.profit, size = 17 }) => (
      <AntDesign name="alert" size={size} color={color} />
    ),
    type: "toggle",
    settingKey: "priceAlerts",
  },
  {
    label: "Push Notifications",
    value: settings.pushNotifications,
    icon: BellIcon,
    settingKey: "pushNotifications",
    type: "toggle",
  },
  {
    label: "Biometric Login",
    value: settings.biometricEnabled,
    icon: FingerprintIcon,
    settingKey: "biometricEnabled",
    type: "toggle",
  },
];
