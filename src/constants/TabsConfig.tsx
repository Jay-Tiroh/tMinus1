import HomeIcon from "@/assets/icons/home.svg";
import MarketsIcon from "@/assets/icons/markets.svg";
import TradesIcon from "@/assets/icons/trades.svg";
import UserIcon from "@/assets/icons/user.svg";
import WalletsIcon from "@/assets/icons/wallets.svg";
import { SvgProps } from "react-native-svg";
import { Colors } from "./Colors";

/**
 * tMinus1 — Tab Bar Configuration
 *
 * All tab behaviour, labels, routes, colors and icons are defined here.
 * To add/remove a tab or change its appearance, edit ONLY this file.
 */

// ─── Types ───────────────────────────────────────────────────────────────────
export type TabRoute = "home" | "markets" | "trades" | "user" | "wallets";

export interface TabConfig {
  name: TabRoute;
  label: string;
  icon: React.FC<SvgProps>;
  initialRoute?: string;
}

// ─── Global Tab Bar Appearance ───────────────────────────────────────────────
export const TabBarStyle = {
  borderColor: "transparent",
  backgroundColor: Colors.backgroundDark + "cc",
  borderRadius: 20,
  marginHorizontal: 24,
  height: 76,
  paddingTop: 10,
  placeItems: "center",
  justifyContent: "center",
  alignItems: "center",
  placeContent: "center",
  alignSelf: "center",
  position: "absolute",
} as const;

export const TabBarColors = {
  active: Colors.textFaint,
  inactive: Colors.textMuted,
  labelSize: 12,
} as const;

// ─── Default Asset for Trades Tab ────────────────────────────────────────────
export const DEFAULT_TRADE_ASSET = "BTC";

// ─── Tab Definitions ─────────────────────────────────────────────────────────
export const TABS: TabConfig[] = [
  { name: "home", label: "Home", icon: HomeIcon, initialRoute: "index" },
  {
    name: "markets",
    label: "Markets",
    icon: MarketsIcon,
    initialRoute: "index",
  },
  { name: "trades", label: "Trades", icon: TradesIcon },
  {
    name: "wallets",
    label: "Wallets",
    icon: WalletsIcon,
    initialRoute: "index",
  },
  { name: "user", label: "Profile", icon: UserIcon, initialRoute: "profile" },
];

// ─── Helper ──────────────────────────────────────────────────────────────────
/** Look up a tab config by route name */
export const getTabConfig = (name: TabRoute): TabConfig | undefined =>
  TABS.find((t) => t.name === name);
