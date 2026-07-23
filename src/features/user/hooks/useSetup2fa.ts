import {
  useEnable2FAMutation,
  useSetup2FAMutation,
} from "@/features/user/api/2faApi";
import { Setup2FAResponseData } from "@/features/user/types/2fa";
import { setPendingRecoveryCodes } from "@/features/user/utils/recoveryCodesTransfer";
import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";
import { getErrorMessage } from "@/shared/utils/errors";
import { logger } from "@/shared/utils/logger";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const useSetup2fa = () => {
  const [authCode, setAuthCode] = useState("");
  const [setupResponse, setSetupResponse] =
    useState<Setup2FAResponseData | null>(null);

  const [setup, { isLoading: settingUp, isError: setupFailed }] =
    useSetup2FAMutation();
  const [enable, { isLoading: enabling }] = useEnable2FAMutation();

  const router = useRouter();

  useEffect(() => {
    const runSetup = async () => {
      try {
        const response: Setup2FAResponseData = await setup().unwrap();
        setSetupResponse(response);
      } catch (error) {
        logger.error("2FA setup failed:", error);
        showErrorToast({
          title: "Failed to initialize 2FA.",
          message: getErrorMessage(
            error,
            "We couldn't initialize 2FA right now. Please try again.",
          ),
        });
      }
    };

    runSetup();
  }, [setup]);

  const handleCopyKey = async () => {
    if (setupResponse?.secret) {
      await Clipboard.setStringAsync(setupResponse.secret);
      showSuccessToast({ title: "Secret key copied to clipboard!" });
    } else {
      showErrorToast({ title: "No key available to copy." });
    }
  };

  const handleEnable2FA = async () => {
    try {
      const result = await enable({ code: authCode }).unwrap();
      showSuccessToast({ title: "2FA enabled successfully!" });
      const codes = result?.recoveryCodes;
      setPendingRecoveryCodes(codes);
      router.replace("/user/two-factor/recovery-codes");
    } catch (error) {
      showErrorToast({
        title: "Invalid code.",
        message: getErrorMessage(error, "Please check the code and try again."),
      });
    }
  };

  return {
    authCode,
    setAuthCode,
    setupResponse,
    settingUp,
    setupFailed,
    enabling,
    handleCopyKey,
    handleEnable2FA,
  };
};
