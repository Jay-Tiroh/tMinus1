/**
 * tMinus1 — Typography
 * Typeface: Neue Montreal
 *
 * Drop your font files in src/assets/fonts/ and register
 * the same keys in the useFonts() call in app/_layout.tsx
 */

export const Fonts = {
  italic: "NeueMontreal-Italic",
  light: "NeueMontreal-Light",
  regular: "NeueMontreal-Regular",
  medium: "NeueMontreal-Medium",
  bold: "NeueMontreal-Bold",
  /** Italic variants */
  lightItalic: "NeueMontreal-LightItalic",
  mediumItalic: "NeueMontreal-MediumItalic",
  boldItalic: "NeueMontreal-BoldItalic",
} as const;

export type FontKey = keyof typeof Fonts;
export type FontValue = (typeof Fonts)[FontKey];
