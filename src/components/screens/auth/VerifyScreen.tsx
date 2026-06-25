import { InfoBanner } from "@/components/auth/InfoBanner";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { showErrorToast, showSuccessToast } from "@/hooks/showToast";
import {
  useRequestOTPMutation,
  useVerifyOTPMutation,
} from "@/store/services/authApi";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Notifications from "expo-notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { OtpInput, OtpInputRef } from "react-native-otp-entry";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export default function VerifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Get email passed from SignUpForm
  const { email } = useLocalSearchParams<{ email: string }>();

  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const otpRef = useRef<OtpInputRef>(null);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOTPMutation();
  const [requestOtp, { isLoading: isRequesting }] = useRequestOTPMutation();

  // 1. Auto-fill Listener
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const pushData = notification.request.content.data;
        const extractedCode = pushData?.code;

        if (extractedCode && String(extractedCode).length === OTP_LENGTH) {
          const codeString = String(extractedCode);
          setCode(codeString);
          otpRef.current?.setValue(codeString);
        }
      },
    );

    return () => subscription.remove();
  }, []);

  // 2. Countdown Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 3. Request OTP & Send Local Push Notification
  const handleRequestOtp = async () => {
    if (!email) return;

    try {
      const result = await requestOtp(email).unwrap();

      setCountdown(RESEND_COOLDOWN);

      // Simulate backend push notification by scheduling a local one
      // using the demoCode returned by the sandbox API
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Verification Code",
          body: `Your authentication code is ${result.demoCode}`,
          sound: true,
          data: { code: result.demoCode }, // This data payload triggers the auto-fill
        },
        trigger: null, // Send immediately
      });

      showSuccessToast({
        title: "Code Sent",
        message: "Check your push notifications.",
      });
    } catch (error: any) {
      showErrorToast({
        title: "Failed to send",
        message: error?.data?.message ?? "Could not request OTP.",
      });
    }
  };

  // Initial OTP Request on Mount
  useEffect(() => {
    if (email && countdown === 0) {
      handleRequestOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  // 4. Verify OTP Logic
  const handleVerify = async (submitCode?: string) => {
    const finalCode = submitCode ?? code;
    if (finalCode.length !== OTP_LENGTH || !email) return;

    try {
      await verifyOtp({
        email,
        code: finalCode,
      }).unwrap();

      showSuccessToast({
        title: "Verified!",
        message: "Your email has been verified successfully.",
      });

      // Route to login so they can sign in with their newly verified account
      router.replace("/(auth)");
    } catch (error: any) {
      showErrorToast({
        title: "Verification Failed",
        message: error?.data?.message ?? "Invalid verification code.",
      });
    }
  };

  // Utility to obscure the email (e.g. stu***@cryptoclass.test)
  const maskEmail = (mail: string) => {
    if (!mail) return "";
    const [name, domain] = mail.split("@");
    return `${name.slice(0, 3)}***@${domain}`;
  };

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[styles.bgContainer, { paddingTop: insets.top + 16 }]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: Spacing.lg + 50, flexGrow: 1 }}
        style={{ width: "100%" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ paddingHorizontal: Spacing.lg }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={Colors.snowGray}
            />
          </TouchableOpacity>
          <Spacer size={24} />

          <TextBlock
            title="Verify Email"
            body={`Please type the code we sent to ${maskEmail(email || "")}`}
            titleStyle={{ fontSize: 28 }}
          />
          <Spacer size={40} />

          <OtpInput
            ref={otpRef}
            numberOfDigits={OTP_LENGTH}
            onTextChange={setCode}
            onFilled={(text) => handleVerify(text)}
            theme={{
              pinCodeContainerStyle: styles.pinContainer,
              pinCodeTextStyle: styles.pinText,
              focusedPinCodeContainerStyle: styles.pinContainerFocused,
            }}
          />

          <Spacer size={40} />

          <View style={{ gap: 16 }}>
            <ThemedButton
              title={isVerifying ? "Verifying..." : "Verify Code"}
              variant="primary"
              onPress={() => handleVerify()}
              disabled={code.length < OTP_LENGTH || isVerifying}
            />
          </View>

          <Spacer size={32} />

          <View style={{ gap: 4, alignItems: "center" }}>
            <ThemedText size={14} color={Colors.textMidGray}>
              Didn't receive the code?
            </ThemedText>
            <TouchableOpacity
              onPress={handleRequestOtp}
              disabled={countdown > 0 || isRequesting}
              style={{ padding: 4 }}
            >
              <ThemedText
                size={14}
                weight="bold"
                color={
                  countdown === 0 ? Colors.primaryClean : Colors.textMidGray
                }
              >
                {countdown > 0
                  ? `Resend code in ${countdown}s`
                  : "Resend Push Notification"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <Spacer size={40} />

          <InfoBanner
            type="warning"
            title="Check your notifications"
            desc="The verification code is sent directly to your device."
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceNavy,
    alignItems: "center",
    justifyContent: "center",
  },
  pinContainer: {
    backgroundColor: Colors.surfaceNavy,
    borderColor: Colors.borderDark,
    borderWidth: 1,
    borderRadius: 12,
  },
  pinContainerFocused: {
    borderColor: Colors.primaryClean,
  },
  pinText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
});
