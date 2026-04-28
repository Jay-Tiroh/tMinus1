/**
 * tMinus1 — Design System Colors
 * Primary: #5ED5A8 (Mint Green)
 * Font: Neue Montreal
 */

export const Colors = {
  // ─── Brand / Primary ───────────────────────────────────────────────
  primary: "#5ED5A8", // Mint — main CTA, active states
  primaryDark: "#354E4C", // Deep Teal — pressed / dark variant
  primaryMid: "#364E4C", // Deep Teal Alt
  primaryLight: "#6EC4A1", // Soft Mint — lighter variant
  primarySoft: "#6FC3A0", // Soft Mint Alt
  primaryFaint: "#70C3A0", // Faint Mint
  primaryGlow: "#6FC29F", // Glow Mint
  primaryEmerald: "#2FDD96", // Bright Emerald — highlights
  primaryForest: "#43675E", // Forest Green
  primaryForestAlt: "#42675E",
  primaryPine: "#45695E", // Pine Green
  primarySage: "#528274", // Sage
  primaryMuted: "#34A853", // Google Green / success alt
  primaryTeal: "#00B594", // Teal — positive trend
  primaryGreen: "#05AA63", // Mid Green
  primaryVibrant: "#10C680", // Vibrant Green
  primaryPale: "#518173", // Pale Teal
  primaryPaleAlt: "#518273", // Pale Teal Alt
  primarySpark: "#64EDB2", // Spark / electric mint

  // ─── Surface / Background ──────────────────────────────────────────
  background: "#07060B", // True Black — main background
  backgroundAlt: "#08080E", // Near Black Alt
  backgroundDeep: "#01010B", // Deepest Black
  surface: "#1B232A", // Dark Card Surface
  surfaceAlt: "#212931", // Dark Surface Alt
  surfaceCard: "#161C22", // Card Background
  surfaceElevated: "#252E35", // Elevated Panel
  surfaceDark: "#171D22", // Dark Panel
  surfaceMid: "#1E272E", // Mid Surface
  surfaceDeep: "#231F20", // Deep Surface
  surfaceTeal: "#28383B", // Teal-tinted Surface
  surfaceDim: "#203234", // Dim Teal Surface
  surfaceNight: "#090C0E", // Near-black Teal

  // ─── Text ──────────────────────────────────────────────────────────
  textPrimary: "#FFFFFF", // White — primary text
  textSecondary: "#A7AFB7", // Muted — secondary text
  textMuted: "#777777", // Dimmed — hints, placeholders
  textDim: "#747E87", // Dimmer text
  textFaint: "#C1C7CD", // Faint — disabled labels
  textOnDark: "#C4C4C4", // Gray on dark

  // ─── Borders / Dividers ────────────────────────────────────────────
  border: "#3E474F", // Default border
  borderLight: "#B4B9C7", // Light border

  // ─── Semantic — Positive / Profit ──────────────────────────────────
  profit: "#5ED5A8", // Alias → primary (green = up)
  profitSoft: "#CEEBE9", // Soft profit background
  profitPale: "#CDEAE8", // Pale profit chip
  profitFaint: "#CEEAE9", // Faint profit tint
  profitMuted: "#9BD3B7", // Muted profit
  profitLight: "#99D0B5", // Light profit
  profitGlow: "#6EC5A2", // Profit glow

  // ─── Semantic — Negative / Loss ────────────────────────────────────
  loss: "#DD4B4B", // Red — loss / danger
  lossAlt: "#EC7571", // Soft Red
  lossMid: "#EE7671", // Mid Red
  lossVibrant: "#EA4335", // Vibrant Red (Google Red)
  lossDark: "#E42D04", // Deep Red
  lossBg: "#F8AD88", // Loss background tint
  lossPale: "#F5AB85", // Pale loss

  // ─── Semantic — Warning / Caution ──────────────────────────────────
  warning: "#FCBD68", // Amber — warning
  warningAlt: "#FABC68", // Amber Alt
  warningGoogle: "#FBBC05", // Google Yellow
  warningBright: "#FFCD34", // Bright Yellow
  warningFlash: "#FFAA35", // Flash Amber
  warningOrange: "#FF8C30", // Orange
  warningDeep: "#FF9A32", // Deep Orange
  warningBurn: "#F7931A", // Bitcoin Orange
  warningPeach: "#F7AC86", // Peach
  warningCream: "#F6EBB7", // Cream / pale warning
  warningGold: "#D5BB5E", // Gold
  warningBrown: "#7A2C18", // Dark Brown / rust
  warningBrownAlt: "#7A2B18",

  // ─── Semantic — Info / Links ───────────────────────────────────────
  info: "#4285F4", // Blue — info
  infoAlt: "#2A5ADA", // Deep Blue
  infoMeta: "#1877F2", // Meta Blue
  infoBright: "#4AA8FF", // Bright Sky Blue
  infoPurple: "#7833F6", // Purple — special label
  infoDark: "#0033AD", // Dark Blue
  infoDarkAlt: "#382A59", // Dark Purple

  // ─── Neutrals / Utility ────────────────────────────────────────────
  white: "#FFFFFF",
  offWhite: "#FCFCFE",
  paleGray: "#F1F4F6",
  lightGray: "#E3E8ED",
  paleBlue: "#EDF0F4",
  black: "#000000",
} as const;

export type ColorKey = keyof typeof Colors;
