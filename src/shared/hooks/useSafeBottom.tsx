import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useSafeBottom = () => {
  const insets = useSafeAreaInsets();
  const TabsBottomPadding = insets.bottom + 50;
  return TabsBottomPadding;
};
