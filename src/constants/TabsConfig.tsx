import ActivityIcon from "@/assets/icons/activity.svg";
import HomeIcon from "@/assets/icons/home.svg";
import MarketsIcon from "@/assets/icons/markets.svg";
import TradesIcon from "@/assets/icons/trades.svg";
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

export type TabRoute = "home" | "markets" | "trades" | "activity" | "wallets";

export interface TabConfig {
  name: TabRoute;
  label: string;
  icon: React.FC<SvgProps>;
}

// ─── Global Tab Bar Appearance ───────────────────────────────────────────────

export const TabBarStyle = {
  borderColor: "transparent",
  backgroundColor: Colors.surfaceDark,
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
  boxShadow: "0px 12px 50px rgba(22, 28, 34, 0.5)",
} as const;

export const TabBarColors = {
  active: Colors.textFaint, // ← label color
  inactive: Colors.textMuted, // ←  label color
  labelSize: 12,
} as const;

// ─── Tab Definitions ─────────────────────────────────────────────────────────

export const TABS: TabConfig[] = [
  {
    name: "home",
    label: "Home",
    icon: HomeIcon,
  },
  {
    name: "markets",
    label: "Markets",
    icon: MarketsIcon,
  },
  {
    name: "trades",
    label: "Trades",
    icon: TradesIcon,
  },
  {
    name: "activity",
    label: "Activity",
    icon: ActivityIcon,
  },
  {
    name: "wallets",
    label: "Wallets",
    icon: WalletsIcon,
  },
];

// ─── Helper ──────────────────────────────────────────────────────────────────

/** Look up a tab config by route name */
export const getTabConfig = (name: TabRoute): TabConfig | undefined =>
  TABS.find((t) => t.name === name);
