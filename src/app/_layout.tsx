import { InactivityLockProvider } from "@/components/InactivityLockProvider";
import { Colors } from "@/constants/Colors";
import { toastConfig } from "@/constants/toastConfig";
import { usePushRegistration } from "@/hooks/usePushRegistration";
import { store } from "@/store";
import { authApi } from "@/store/services/authApi";
import { clearCredentials, setCredentials } from "@/store/slices/authSlice";
import { logger } from "@/utils/logger";
import { clearTokens, getToken, saveToken } from "@/utils/secureStore";
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

type BootstrapRoute = "onboarding" | "auth" | "locked";

function RootLayoutNav() {
  const router = useRouter();
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [bootstrapRoute, setBootstrapRoute] = useState<BootstrapRoute | null>(
    null,
  );
  usePushRegistration();

  const [fontsLoaded, fontError] = useFonts({
    "NeueMontreal-Light": require("@/assets/fonts/NeueMontreal-Light.otf"),
    "NeueMontreal-Regular": require("@/assets/fonts/NeueMontreal-Regular.otf"),
    "NeueMontreal-Medium": require("@/assets/fonts/NeueMontreal-Medium.otf"),
    "NeueMontreal-Bold": require("@/assets/fonts/NeueMontreal-Bold.otf"),
  });

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const hasOnboarded = await AsyncStorage.getItem("has_onboarded");
        if (hasOnboarded !== "true") {
          setBootstrapRoute("onboarding");
          return;
        }

        const token = await getToken("ACCESS_TOKEN");
        if (!token) {
          store.dispatch(clearCredentials());
          setBootstrapRoute("auth");
          return;
        }

        try {

          const result = await store.dispatch(
            authApi.endpoints.getSession.initiate(undefined, { forceRefetch: true }),
          );

          if (result.error || !result.data) {
            throw new Error("Session invalid");
          }

          const { user, accessToken, refreshToken } = result.data;

          await saveToken("ACCESS_TOKEN", accessToken);
          await saveToken("REFRESH_TOKEN", refreshToken);

          store.dispatch(
            setCredentials({ user, token: accessToken, refreshToken }),
          );
          setBootstrapRoute("locked");
        } catch {
          await clearTokens();
          await saveToken("SESSION_LOCKED", "false");
          store.dispatch(clearCredentials());
          setBootstrapRoute("auth");
        }
      } catch (error) {
        logger.error("Bootstrap error:", error);
        await clearTokens();
        store.dispatch(clearCredentials());
        setBootstrapRoute("auth");
      } finally {
        setIsBootstrapped(true);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (!fontsLoaded || !isBootstrapped || bootstrapRoute === null) return;

    switch (bootstrapRoute) {
      case "onboarding":
        break;
      case "auth":
        router.replace("/(auth)");
        break;
      case "locked":
        router.replace("/welcome-back");
        break;
    }

    SplashScreen.hideAsync();
  }, [fontsLoaded, isBootstrapped, bootstrapRoute, router]);

  useEffect(() => {
    if (fontError && isBootstrapped) SplashScreen.hideAsync();
  }, [fontError, isBootstrapped]);

  if (!fontsLoaded && !fontError) return null;
  if (!isBootstrapped) return null;

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
          <Stack.Screen name="kyc" />
        </Stack>

        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <InactivityLockProvider>
        <RootLayoutNav />
      </InactivityLockProvider>
    </Provider>
  );
}
