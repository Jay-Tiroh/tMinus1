import { Colors } from "./Colors";

/**
 * tMinus1 — Tab Bar Configuration
 *
 * All tab behaviour, labels, routes, colors and icons are defined here.
 * To add/remove a tab or change its appearance, edit ONLY this file.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type TabRoute = "index" | "markets" | "trades" | "activity" | "wallets";

export interface TabConfig {
  /** Expo Router screen name (maps to app/(tabs)/<name>.tsx) */
  name: TabRoute;
  /** Label shown under the tab icon */
  label: string;
  /** Icon name for your icon library — swap to match whatever you use */
  icon: {
    active: string;
    inactive: string;
  };
}

// ─── Global Tab Bar Appearance ───────────────────────────────────────────────
// Tweak these to restyle the entire tab bar in one place

export const TabBarStyle = {
  backgroundColor: Colors.surface, // Tab bar background
  borderTopColor: Colors.border, // Top border line
  borderTopWidth: 1,
  height: 64, // Tab bar height
  paddingBottom: 8,
  paddingTop: 8,
} as const;

export const TabBarColors = {
  active: Colors.primary, // ← active icon + label color
  inactive: Colors.textMuted, // ← inactive icon + label color
  indicatorDot: Colors.primaryEmerald, // ← active indicator dot (if used)
  labelSize: 10, // font size for tab labels
} as const;

// ─── Tab Definitions ─────────────────────────────────────────────────────────
// Add/remove/reorder tabs here. Icons use string names —
// swap these for your actual icon set (lucide, phosphor, custom SVG, etc.)

export const TABS: TabConfig[] = [
  {
    name: "index",
    label: "Home",
    icon: {
      active: "home-filled",
      inactive: "home-outline",
    },
  },
  {
    name: "markets",
    label: "Markets",
    icon: {
      active: "chart-bar-filled",
      inactive: "chart-bar-outline",
    },
  },
  {
    name: "trades",
    label: "Trades",
    icon: {
      active: "arrows-exchange-filled",
      inactive: "arrows-exchange-outline",
    },
  },
  {
    name: "activity",
    label: "Activity",
    icon: {
      active: "clock-filled",
      inactive: "clock-outline",
    },
  },
  {
    name: "wallets",
    label: "Wallets",
    icon: {
      active: "wallet-filled",
      inactive: "wallet-outline",
    },
  },
];

// ─── Helper ──────────────────────────────────────────────────────────────────

/** Look up a tab config by route name */
export const getTabConfig = (name: TabRoute): TabConfig | undefined =>
  TABS.find((t) => t.name === name);
