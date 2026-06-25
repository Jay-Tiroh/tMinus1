// hooks/usePushRegistration.ts
import { useAppSelector } from "@/store/hooks";
import { useRegisterDeviceMutation } from "@/store/services/devicesApi";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushRegistration() {
  const token = useAppSelector((s) => s.auth.token);
  const [registerDevice] = useRegisterDeviceMutation();

  useEffect(() => {
    if (!token || !Device.isDevice) return;

    const setupPushNotifications = async () => {
      // 1. Configure Android channel first
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      // 2. Check and request permissions
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;

      if (existing !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") return;

      // 3. Grab the Expo push token
      const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync(
        {
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        },
      );

      // 4. Register the device with your backend
      try {
        await registerDevice({
          expoPushToken,
          platform: Platform.OS as "ios" | "android",
        }).unwrap();
      } catch (err) {
        console.warn("Failed to register push device:", err);
      }
    };

    setupPushNotifications();
  }, [token, registerDevice]);
}
