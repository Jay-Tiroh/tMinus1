import { useProfileQuery } from "@/store/services/profileApi";
import { UserVerification, VerificationLimits } from "@/types/profile";

interface UseKycReturn {
  verification: UserVerification | undefined;
  kycStatus: string | undefined;
  isVerified: boolean;
  canTrade: boolean;
  canWithdraw: boolean;
  limits: VerificationLimits | undefined;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => void;
}

export function useKyc(pollIntervalMs = 0): UseKycReturn {
  const { data, isLoading, isError, isSuccess, refetch } = useProfileQuery(
    undefined,
    {
      pollingInterval: pollIntervalMs,
      // Optional but recommended for status-checking hooks:
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const verification = data?.data?.verification;
  const kycStatus = data?.data?.kycStatus;

  return {
    verification,
    kycStatus,
    isVerified: verification?.status === "approved",
    canTrade: verification?.canTrade ?? false,
    canWithdraw: verification?.canWithdraw ?? false,
    limits: verification?.limits,
    isLoading,
    isError,
    isSuccess,
    refetch,
  };
}
