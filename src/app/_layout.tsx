import SheetController from "@/components/SheetController";
import { Colors } from "@/constants/Colors";
import { toastConfig } from "@/constants/toastConfig";
import { store } from "@/store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";

SplashScreen.preventAutoHideAsync();

enableScreens(true);

export default function RootLayout() {
  const router = useRouter();
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [shouldRedirectToSignIn, setShouldRedirectToSignIn] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "NeueMontreal-Light": require("@/assets/fonts/NeueMontreal-Light.otf"),
    "NeueMontreal-Regular": require("@/assets/fonts/NeueMontreal-Regular.otf"),
    "NeueMontreal-Medium": require("@/assets/fonts/NeueMontreal-Medium.otf"),
    "NeueMontreal-Bold": require("@/assets/fonts/NeueMontreal-Bold.otf"),
  });

  // 1. Check storage status safely without executing immediate routing
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const hasOnboarded = await AsyncStorage.getItem("has_onboarded");
        if (hasOnboarded === "true") {
          setShouldRedirectToSignIn(true);
        }
      } catch (error) {
        console.error("Error reading onboarding status:", error);
      } finally {
        setIsBootstrapped(true);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (fontsLoaded && isBootstrapped) {
      if (shouldRedirectToSignIn) {
        router.replace("/(auth)");
      }
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isBootstrapped, shouldRedirectToSignIn]);

  useEffect(() => {
    if (fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                animationDuration: 200,
                contentStyle: { backgroundColor: Colors.surface },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="user" />
            </Stack>
            <SheetController />
          </BottomSheetModalProvider>
          <Toast config={toastConfig} />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}
