import { useProfileQuery, useSettingsQuery } from "@/store/services/profileApi";
import { useCallback } from "react";

export default function useProfile(pollIntervalMs?: number) {
  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
    isError: isProfileError,
    isSuccess: isProfileSuccess,
    isUninitialized: isProfileUninitialized,
    refetch: refetchProfile,
  } = useProfileQuery(undefined, {
    pollingInterval: pollIntervalMs,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: explicitSettings,
    isLoading: isSettingsLoading,
    isFetching: isSettingsFetching,
    isError: isSettingsError,
    isSuccess: isSettingsSuccess,
    isUninitialized: isSettingsUninitialized,
    refetch: refetchSettings,
  } = useSettingsQuery(undefined, {
    pollingInterval: pollIntervalMs,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const user = profileResponse?.data;

  // Destructure for ease of access in components
  const verification = user?.verification;
  const kycStatus = user?.kycStatus;
  const watchlist = user?.watchlist ?? [];
  const twoFactorEnabled = user?.twoFactorEnabled ?? false;

  // Prefer the direct settings query, fallback to the settings object inside the profile payload
  const settings = explicitSettings ?? user?.settings;

  const isInWatchlist = useCallback(
    (symbol: string) => {
      if (!symbol) return false;
      return watchlist.includes(symbol.toUpperCase());
    },
    [watchlist],
  );

  const refetchAll = useCallback(() => {
    refetchProfile();
    refetchSettings();
  }, [refetchProfile, refetchSettings]);

  // Aggregate states
  const isLoading = isProfileLoading || isSettingsLoading;
  const isFetching = isProfileFetching || isSettingsFetching;
  const isError = isProfileError || isSettingsError;
  const isSuccess = isProfileSuccess && isSettingsSuccess;

  return {
    user,
    verification,
    settings,
    watchlist,
    kycStatus,
    twoFactorEnabled,
    isInWatchlist,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    isProfileUninitialized,
    isSettingsUninitialized,
    refetch: refetchAll,
  };
}
