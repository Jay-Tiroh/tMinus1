import CTA from "@/components/auth/CTA";
import NavHeader from "@/components/auth/NavHeader";
import { OTPInput } from "@/components/auth/OTPInput";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useMaskData } from "@/hooks/useMaskData";
import { useRequestOtp } from "@/hooks/useRequestOTP";
import { useTempUser } from "@/hooks/useTempUser";
import { useVerifyOTPMutation } from "@/store/services/authApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Verify() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const { email, phone } = useTempUser();
  const payload: { type: "email" | "phone"; value: string } = phone
    ? { type: "phone", value: phone }
    : { type: "email", value: email ?? "" };
  const { maskData } = useMaskData();
  const maskedData = maskData(payload);
  const { handleRequestOtp, countdown, error, isLoading } = useRequestOtp();

  const [verifyOtp, { isLoading: isVerifying, isError }] =
    useVerifyOTPMutation();

  const handleSubmit = async (code?: string) => {
    const otpToSubmit = code ?? otp;
    if (otpToSubmit.length < 6) return;
    try {
      const result = await verifyOtp({
        email: payload.value,
        code: otpToSubmit,
      }).unwrap();

      router.replace("/signUp");
      console.log("Submitting OTP:", otpToSubmit);
    } catch (err) {
      const fetchError = err as FetchBaseQueryError;
      const data = fetchError.data as { error: { message: string } };
      const message = data?.error?.message ?? "Verification failed. Try again.";
      setVerifyError(message);
      console.log(payload, otpToSubmit);
    }
  };

  useEffect(() => {
    if (!payload.value) return;
    handleRequestOtp(payload.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload.value]);

  return (
    <View style={{ paddingTop: insets.top, flex: 1 }}>
      <NavHeader title="Verification" />
      <Spacer size={26} />
      <View style={styles.container}>
        <View style={{ gap: Spacing.md, width: "100%" }}>
          <ThemedText
            size={32}
            weight="bold"
            style={{ color: Colors.white, lineHeight: 46 }}
          >
            Enter your code
          </ThemedText>
          <View style={{ gap: 2 }}>
            <ThemedText
              size={14}
              letterSpacing={2.64}
              weight="regular"
              style={{ color: Colors.textSecondary }}
            >
              Please type the code we sent to
            </ThemedText>
            <ThemedText
              size={14}
              letterSpacing={2.64}
              weight="regular"
              style={{ color: Colors.primary }}
            >
              {maskedData}
            </ThemedText>
          </View>
        </View>

        <Spacer size={44} />

        <View style={{ gap: Spacing.lg, width: "100%" }}>
          <View style={styles.inputContainer}>
            <OTPInput
              length={6}
              onChange={(code) => setOtp(code)}
              onComplete={handleSubmit}
            />
          </View>
        </View>

        {verifyError && (
          <>
            <Spacer size={34} />
            <ThemedText color={Colors.lossAlt} style={styles.errorText}>
              {verifyError}
            </ThemedText>
          </>
        )}

        <Spacer size={34} />

        <View style={{ gap: 2, alignItems: "center" }}>
          <ThemedText
            size={14}
            letterSpacing={2.64}
            weight="regular"
            style={{ color: Colors.textSecondary }}
          >
            Resend code ({countdown})
          </ThemedText>
          <ThemedText
            size={14}
            letterSpacing={2.64}
            weight="regular"
            style={{
              color: countdown === 0 ? Colors.primary : Colors.textSecondary,
            }}
            onPress={() => {
              if (countdown === 0) handleRequestOtp(payload.value);
            }}
          >
            Resend Link
          </ThemedText>
        </View>

        <Spacer size={40} />
        <CTA
          page="verify"
          onPress={() => handleSubmit()}
          isLoading={isLoading || isVerifying}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    gap: 12,
  },
  errorText: {
    width: "100%",
    textAlign: "center",
  },
});
