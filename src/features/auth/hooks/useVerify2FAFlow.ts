import { useAppDispatch } from "@/core/store/hooks";
import { useVerify2FAMutation } from "@/features/user";
import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";
import { saveToken } from "@/shared/utils/secureStore";
import { useRouter } from "expo-router";
import { RefObject } from "react";
import { OtpInputRef } from "react-native-otp-entry";
import { setCredentials } from "../storage/authSlice";

export const useVerify2FAFlow = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [verify2FA, { isLoading }] = useVerify2FAMutation();

  const handleVerify = async ({
    challengeId,
    code,
    recoveryCode,
    isRecoveryMode,
    setCode,
    setRecoveryCode,
    otpRef,
  }: {
    challengeId: string;
    code: string;
    recoveryCode: string;
    isRecoveryMode: boolean;
    setCode: (c: string) => void;
    setRecoveryCode: (c: string) => void;
    otpRef: RefObject<OtpInputRef | null>;
  }) => {
    try {
      const payload = isRecoveryMode
        ? { challengeId, recoveryCode }
        : { challengeId, code };

      const result = await verify2FA(payload).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          token: result.accessToken,
          refreshToken: result.refreshToken,
        }),
      );

      await saveToken("ACCESS_TOKEN", result.accessToken);
      await saveToken("REFRESH_TOKEN", result.refreshToken);
      await saveToken(
        "BIOMETRIC_ENABLED",
        String(result.user.settings.biometricEnabled),
      );

      showSuccessToast({
        title: "Verification Successful",
        message: "Welcome back!",
      });

      router.replace("/(tabs)/home");
    } catch (error: any) {
      showErrorToast({
        title: "Verification Failed",
        message: error?.data?.message ?? "Invalid code",
      });

      if (isRecoveryMode) {
        setRecoveryCode("");
      } else {
        setCode("");
        otpRef.current?.clear();
      }
    }
  };

  return { handleVerify, isLoading };
};
