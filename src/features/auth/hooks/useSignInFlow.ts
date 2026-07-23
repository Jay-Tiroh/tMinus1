import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Control, FieldValues, useForm } from "react-hook-form";

import { useAppDispatch } from "@/core/store/hooks";
import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";
import { getErrorMessage } from "@/shared/utils/errors";
import { logger } from "@/shared/utils/logger";
import { saveToken } from "@/shared/utils/secureStore";
import { useLoginMutation } from "../api/authApi";
import { setCredentials } from "../storage/authSlice";
import { LoginRequest } from "../types/auth";
import {
  EmailPasswordFormData,
  emailPasswordSchema,
  MobilePasswordFormData,
  mobilePasswordSchema,
} from "../validation/authSchemas";

const isTwoFactorResponse = (
  data: unknown,
): data is {
  requiresTwoFactor: true;
  challengeId: string;
  expiresAt: string;
  attemptsRemaining: number;
} => typeof data === "object" && data !== null && "requiresTwoFactor" in data;

export const useSignInFlow = () => {
  const [isEmail, setIsEmail] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();

  const emailForm = useForm<EmailPasswordFormData>({
    resolver: zodResolver(emailPasswordSchema),
    mode: "onChange",
  });

  const phoneForm = useForm<MobilePasswordFormData>({
    resolver: zodResolver(mobilePasswordSchema),
    mode: "onChange",
  });

  const activeForm = isEmail ? emailForm : phoneForm;

  const [login, { isLoading, isError }] = useLoginMutation();

  const handleToggle = () => {
    emailForm.reset();
    phoneForm.reset();
    setIsEmail((prev) => !prev);
  };

  const onSubmit = async (
    data: EmailPasswordFormData | MobilePasswordFormData,
  ) => {
    const formattedData: LoginRequest = {
      loginType: isEmail ? "email" : "phone",
      identifier: "email" in data ? data.email : data.phone.replace(/\s/g, ""),
      password: data.password,
    };

    const result = await login(formattedData);
    logger.log("LOGIN RESULT", result);

    if ("data" in result && result.data) {
      if (isTwoFactorResponse(result.data)) {
        router.replace({
          pathname: "/verify-2fa",
          params: {
            challengeId: result.data.challengeId,
            expiresAt: result.data.expiresAt,
            attemptsRemaining: String(result.data.attemptsRemaining),
          },
        });
        return;
      }

      dispatch(
        setCredentials({
          user: result.data.user,
          token: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        }),
      );

      await saveToken("ACCESS_TOKEN", result.data.accessToken);
      await saveToken("REFRESH_TOKEN", result.data.refreshToken);
      await saveToken(
        "BIOMETRIC_ENABLED",
        String(result.data.user.settings.biometricEnabled),
      );

      showSuccessToast({
        title: "Login Successful",
        message: "Welcome back! You have been logged in successfully.",
      });

      router.replace("/(tabs)/home");
      return;
    }

    if ("error" in result) {
      const loginError = getErrorMessage(result.error);
      setErrorMessage(loginError);
      showErrorToast({ title: "Login Failed", message: loginError });
    }
  };

  return {
    isEmail,
    errorMessage,
    isLoading,
    isError,
    emailForm,
    phoneForm,
    activeForm: activeForm.control as unknown as Control<FieldValues>,
    handleToggle,
    handleSubmit: activeForm.handleSubmit(onSubmit, (errors) => {
      logger.log("VALIDATION ERRORS", errors);
    }),
  };
};
