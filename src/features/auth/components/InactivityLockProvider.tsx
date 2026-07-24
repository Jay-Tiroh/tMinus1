// providers/InactivityLockProvider.tsx
import { useAppDispatch } from "@/core/store/hooks";
import { saveToken } from "@/shared/utils/secureStore";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import {
  AppState,
  AppStateStatus,
  GestureResponderEvent,
  View,
} from "react-native";
import { lockSession } from "../store/authSlice";

const LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export const InactivityLockProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const lastActiveAt = useRef<number>(Date.now());
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const foregroundTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerLock = useCallback(async () => {
    dispatch(lockSession());
    await saveToken("SESSION_LOCKED", "true");
    router.replace("/welcome-back");
  }, [dispatch, router]);

  const clearForegroundTimer = () => {
    if (foregroundTimer.current) {
      clearTimeout(foregroundTimer.current);
      foregroundTimer.current = null;
    }
  };

  const armForegroundTimer = useCallback(() => {
    clearForegroundTimer();
    foregroundTimer.current = setTimeout(triggerLock, LOCK_TIMEOUT_MS);
  }, [triggerLock]);

  // Any touch resets the clock and marks "last active"
  const handleActivity = useCallback(() => {
    lastActiveAt.current = Date.now();
    armForegroundTimer();
  }, [armForegroundTimer]);

  useEffect(() => {
    // start the foreground timer on mount
    armForegroundTimer();

    const handleAppStateChange = async (nextState: AppStateStatus) => {
      const wasActive = appState.current === "active";
      const goingBackground =
        wasActive && nextState.match(/inactive|background/);
      const comingForeground =
        appState.current.match(/inactive|background/) && nextState === "active";

      if (goingBackground) {
        // stop the foreground timer while backgrounded; we'll check elapsed time on resume instead
        clearForegroundTimer();
      }

      if (comingForeground) {
        const elapsed = Date.now() - lastActiveAt.current;
        if (elapsed >= LOCK_TIMEOUT_MS) {
          await triggerLock();
        } else {
          // re-arm for the remaining time so foreground inactivity continues counting correctly
          lastActiveAt.current = Date.now();
          armForegroundTimer();
        }
      }

      appState.current = nextState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
      clearForegroundTimer();
    };
  }, [armForegroundTimer, triggerLock]);

  return (
    <View
      style={{ flex: 1 }}
      onTouchStart={
        handleActivity as unknown as (e: GestureResponderEvent) => void
      }
    >
      {children}
    </View>
  );
};
