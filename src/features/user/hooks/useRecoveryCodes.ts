import { useRegenerateRecoveryCodesMutation } from "@/features/user/api/2faApi";
import { consumePendingRecoveryCodes } from "@/features/user/utils/recoveryCodesTransfer";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "@/shared/hooks/showToast";
import { getErrorMessage } from "@/utils/errors";
import * as Clipboard from "expo-clipboard";
import { useEffect, useRef, useState } from "react";
import { OtpInputRef } from "react-native-otp-entry";
import { passwordValidationSchema } from "../validation/2fa.schema";

export const useRecoveryCodes = () => {
  const [codes, setCodes] = useState<string[] | undefined>(undefined);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authCode, setAuthCode] = useState("");

  const otpRef = useRef<OtpInputRef>(null);

  const [regenerateCodes, { isLoading }] = useRegenerateRecoveryCodesMutation();

  useEffect(() => {
    const retrieved = consumePendingRecoveryCodes();
    if (retrieved) {
      setCodes(retrieved);
    }
  }, []);

  const handleCopy = async () => {
    if (codes) {
      await Clipboard.setStringAsync(codes.join("\n"));
      showInfoToast({ title: "Recovery codes copied to clipboard!" });
    }
  };

  const validatePassword = (value: string) => {
    const result = passwordValidationSchema.safeParse(value);
    if (!result.success) {
      setPasswordError(getErrorMessage(result.error));
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) validatePassword(text);
  };

  const handleRegenerate = async () => {
    if (!validatePassword(password)) return;

    try {
      const payload = {
        password,
        code: authCode,
      };

      const result = await regenerateCodes(payload).unwrap();
      const newCodes = result?.recoveryCodes;
      setCodes(newCodes);
      showSuccessToast({
        title: "Recovery codes regenerated",
        message: "Your recovery codes have been regenerated.",
      });
    } catch (error: any) {
      showErrorToast({
        title: "Error",
        message: error?.data?.message ?? "Please try again",
      });
    }
  };

  const isOtpReady = authCode.length === 6;
  const canSubmit = password.length >= 8 && isOtpReady;

  return {
    codes,
    password,
    passwordError,
    authCode,
    setAuthCode,
    otpRef,
    isLoading,
    canSubmit,
    handleCopy,
    handlePasswordChange,
    validatePassword,
    handleRegenerate,
  };
};
