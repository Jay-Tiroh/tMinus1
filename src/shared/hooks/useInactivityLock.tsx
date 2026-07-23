// hooks/useInactivityLock.ts
import { useAppDispatch } from "@/core/store/hooks";
import { lockSession } from "@/features/auth/storage/authSlice";
import { saveToken } from "@/shared/utils/secureStore";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

const LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export const useInactivityLock = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const backgroundedAt = useRef<number | null>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = async (nextState: AppStateStatus) => {
      if (
        appState.current === "active" &&
        nextState.match(/inactive|background/)
      ) {
        backgroundedAt.current = Date.now();
      }

      if (
        appState.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        const elapsed = backgroundedAt.current
          ? Date.now() - backgroundedAt.current
          : 0;
        if (elapsed >= LOCK_TIMEOUT_MS) {
          dispatch(lockSession());
          await saveToken("SESSION_LOCKED", "true");
          router.replace("/welcome-back");
        }
        backgroundedAt.current = null;
      }

      appState.current = nextState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [dispatch, router]);
};
