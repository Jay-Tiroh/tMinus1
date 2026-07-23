// hooks/useBackToHome.ts
import { Href, useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { BackHandler } from "react-native";

export function useBackToHome(homeRoute: Href = "/(tabs)/home") {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (router.canGoBack()) {
          return false; // let default behavior pop the stack normally
        }
        router.replace(homeRoute);
        return true; // handled — prevents app exit/minimize
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, [router, homeRoute]),
  );
}
