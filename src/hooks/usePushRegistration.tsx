// hooks/usePushRegistration.ts
import { useAppSelector } from "@/store/hooks";
import { useRegisterDeviceMutation } from "@/store/services/devicesApi";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

export function usePushRegistration() {
  const token = useAppSelector((s) => s.auth.token);
  const [registerDevice] = useRegisterDeviceMutation();

  useEffect(() => {
    if (!token || !Device.isDevice) return;

    (async () => {
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;

      if (existing !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") return;

      const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync(
        {
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        },
      );

      try {
        await registerDevice({
          expoPushToken,
          platform: Platform.OS as "ios" | "android",
        }).unwrap();
      } catch (err) {
        console.warn("Failed to register push device:", err);
      }
    })();
  }, [token, registerDevice]);
}
