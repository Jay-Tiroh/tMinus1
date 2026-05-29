import SheetController from "@/components/SheetController";
import { Colors } from "@/constants/Colors";
import { store } from "@/store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import { Provider } from "react-redux";

SplashScreen.preventAutoHideAsync();

enableScreens(true);

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "NeueMontreal-Light": require("@/assets/fonts/NeueMontreal-Light.otf"),
    "NeueMontreal-Regular": require("@/assets/fonts/NeueMontreal-Regular.otf"),
    "NeueMontreal-Medium": require("@/assets/fonts/NeueMontreal-Medium.otf"),
    "NeueMontreal-Bold": require("@/assets/fonts/NeueMontreal-Bold.otf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

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
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}
