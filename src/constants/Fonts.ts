/**
 * tMinus1 — Typography
 * Typeface: Neue Montreal
 *
 * Drop your font files in src/assets/fonts/ and register
 * the same keys in the useFonts() call in app/_layout.tsx
 */

export const Fonts = {
  light: "NeueMontreal-Light",
  regular: "NeueMontreal-Regular",
  medium: "NeueMontreal-Medium",
  bold: "NeueMontreal-Bold",
  /** Italic variants */
} as const;

export type FontKey = keyof typeof Fonts;
export type FontValue = (typeof Fonts)[FontKey];
