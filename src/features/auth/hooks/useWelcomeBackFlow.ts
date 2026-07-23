import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";
import { useAppDispatch } from "@/store/hooks";
import { saveToken } from "@/utils/secureStore";
import { useRouter } from "expo-router";
import { useLoginMutation } from "../api/authApi";
import { setCredentials, unlockSession } from "../storage/authSlice";

const isTwoFactorResponse = (
  data: unknown,
): data is {
  requiresTwoFactor: true;
  challengeId: string;
  expiresAt: string;
  attemptsRemaining: number;
} => typeof data === "object" && data !== null && "requiresTwoFactor" in data;

export const useWelcomeBackFlow = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const handleSignIn = async (user: any, password: string) => {
    try {
      const result = await login({
        loginType: "email",
        identifier: user.email,
        password,
      }).unwrap();

      if (isTwoFactorResponse(result)) {
        router.replace({
          pathname: "/verify-2fa",
          params: {
            challengeId: result.challengeId,
            expiresAt: result.expiresAt,
            attemptsRemaining: String(result.attemptsRemaining),
          },
        });
        return;
      }

      dispatch(
        setCredentials({
          user: result.user,
          token: result.accessToken,
          refreshToken: result.refreshToken,
        }),
      );
      dispatch(unlockSession());
      await saveToken("SESSION_LOCKED", "false");

      router.replace("/(tabs)/home");
    } catch {
      showErrorToast({
        title: "Authentication Failed",
        message: "Incorrect password",
      });
    }
  };

  const handleBiometrics = async (
    user: any,
    authenticate: (reason: string) => Promise<{ success: boolean }>,
  ) => {
    const result = await authenticate(`Unlock ${user.fullName}`);

    if (!result.success) {
      showErrorToast({
        title: "Authentication Failed",
        message: "Biometric authentication failed.",
      });
      return;
    }

    dispatch(unlockSession());
    await saveToken("SESSION_LOCKED", "false");

    showSuccessToast({ title: "Welcome Back" });
    router.replace("/(tabs)/home");
  };

  return { handleSignIn, handleBiometrics, isLoginLoading };
};
