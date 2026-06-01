import * as LocalAuthentication from "expo-local-authentication";
import { useCallback, useEffect, useState } from "react";

type BiometricType = "fingerprint" | "facial" | "iris" | "none";

interface BiometricState {
  isSupported: boolean;
  isEnrolled: boolean;
  biometricType: BiometricType;
}

export function useBiometrics() {
  const [state, setState] = useState<BiometricState>({
    isSupported: false,
    isEnrolled: false,
    biometricType: "none",
  });

  useEffect(() => {
    checkBiometrics();
  }, []);

  async function checkBiometrics() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

    let biometricType: BiometricType = "none";

    if (
      types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
    ) {
      biometricType = "facial";
    } else if (
      types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
    ) {
      biometricType = "fingerprint";
    } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      biometricType = "iris";
    }

    setState({ isSupported: hasHardware, isEnrolled: enrolled, biometricType });
  }

  const authenticate = useCallback(
    async (promptMessage = "Confirm your identity") => {
      if (!state.isSupported || !state.isEnrolled) {
        return {
          success: false,
          error: "Biometrics not available or not enrolled",
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: "Use passcode",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      return result;
    },
    [state],
  );

  return { ...state, authenticate };
}
