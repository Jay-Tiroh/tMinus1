// utils/responsive.ts
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const GUIDELINE_WIDTH = 414;
const GUIDELINE_HEIGHT = 929;

export const s = (size: number) => (width / GUIDELINE_WIDTH) * size;
export const vs = (size: number) => (height / GUIDELINE_HEIGHT) * size;
export const ms = (size: number, factor = 0.5) =>
  size + (s(size) - size) * factor;
export const mvs = (size: number, factor = 0.5) =>
  size + (vs(size) - size) * factor;
