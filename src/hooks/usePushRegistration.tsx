// hooks/usePushRegistration.ts
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRegisterDeviceMutation } from "@/store/services/devicesApi";
import { notificationsApi } from "@/store/services/notificationsApi";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
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
  const dispatch = useAppDispatch();
  const [registerDevice] = useRegisterDeviceMutation();

  // Keep stable refs so listeners aren't re-added on every render
  const notificationListener = useRef<
    Notifications.EventSubscription | undefined
  >(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!token || !Device.isDevice) return;

    const setupPushNotifications = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

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
      console.log("📱 Expo Push Token:", expoPushToken);
      try {
        await registerDevice({
          expoPushToken,
          platform: Platform.OS as "ios" | "android",
        }).unwrap();
        console.log("✅ Device registered successfully");
      } catch (err) {
        console.warn("Failed to register push device:", err);
      }
    };

    setupPushNotifications();

    // ─── Listener 1: notification arrives while app is foregrounded ──────────
    // Fires immediately when the push lands — no screen visit needed.
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification received:", notification); // ← add this
        dispatch(
          notificationsApi.util.invalidateTags([
            { type: "Notifications", id: "LIST" },
          ]),
        );
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 Notification tapped:", response); // ← add this
        dispatch(
          notificationsApi.util.invalidateTags([
            { type: "Notifications", id: "LIST" },
          ]),
        );
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [token, dispatch, registerDevice]);
}
