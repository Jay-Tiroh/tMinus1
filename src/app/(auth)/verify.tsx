import CTA from "@/components/auth/CTA";
import NavHeader from "@/components/auth/NavHeader";
import { OTPInput } from "@/components/auth/OTPInput";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Verify() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const insets = useSafeAreaInsets();
  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSubmit = () => {
    console.log("Submitting OTP:", otp);
    router.push("/(auth)/success");
  };

  const startCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setIsCounting(true);
    setCountdown(30);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setIsCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startCountdown();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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
              9161186659
            </ThemedText>
          </View>
        </View>

        <Spacer size={44} />

        <View style={{ gap: Spacing.lg, width: "100%" }}>
          <View style={styles.inputContainer}>
            <OTPInput
              length={4}
              onChange={(code) => setOtp(code)}
              onComplete={(code) => console.log("OTP complete:", code)}
            />
          </View>
        </View>

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
              color: isCounting ? Colors.textSecondary : Colors.primary,
            }}
            onPress={isCounting ? undefined : startCountdown}
          >
            Resend Link
          </ThemedText>
        </View>

        <Spacer size={40} />
        <CTA page="verify" onPress={handleSubmit} />
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
});
