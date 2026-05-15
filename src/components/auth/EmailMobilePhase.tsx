import CTA from "@/components/auth/CTA";
import { ThemedTextInput } from "@/components/auth/ThemedTextInput";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import {
  EmailFormData,
  emailSchema_,
  PhoneFormData,
  phoneSchema_,
} from "@/schemas/authSchemas";
import { useAppDispatch } from "@/store/hooks";
import { setTempUser } from "@/store/slices/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

type FormData = EmailFormData | PhoneFormData;

export default function EmailMobile() {
  const [isEmail, setIsEmail] = useState(true);
  const dispatch = useAppDispatch();
  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(isEmail ? emailSchema_ : phoneSchema_),
    mode: "onChange",
  });
  const router = useRouter();

  const onSubmit = (data: FormData) => {
    if (isEmail && "email" in data) {
      dispatch(
        setTempUser({
          user: { email: data.email },
        }),
      );
    } else if (!isEmail && "phone" in data) {
      dispatch(
        setTempUser({
          user: { phone: data.phone },
        }),
      );
    }

    router.push("/(auth)/verify");
  };

  const handleToggle = () => {
    reset();
    setIsEmail((prev) => !prev);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ gap: Spacing.md, width: "100%" }}>
          <ThemedText
            size={32}
            weight="bold"
            style={{
              color: Colors.white,
              lineHeight: 46,
            }}
          >
            Sign Up with {isEmail ? "Email" : "Mobile"}
          </ThemedText>

          <ThemedText
            size={14}
            letterSpacing={0.5}
            weight="regular"
            style={{ color: Colors.textSecondary, lineHeight: 24 }}
          >
            {isEmail
              ? "Enter your email address to receive a verification code and securely create your account."
              : "Enter your mobile number to receive a verification code and securely create your account."}
          </ThemedText>
        </View>
        <Spacer size={44} />

        <View style={{ gap: Spacing.lg, width: "100%" }}>
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <ThemedText size={14} style={styles.label}>
                {isEmail ? "Email" : "Mobile Number"}
              </ThemedText>
              <ThemedText
                size={14}
                style={styles.toggleLink}
                onPress={handleToggle}
              >
                {isEmail ? "Sign up with mobile" : "Sign up with email"}
              </ThemedText>
            </View>
            {isEmail ? (
              <ThemedTextInput
                control={control}
                name="email"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <ThemedTextInput
                control={control}
                name="phone"
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
            )}
          </View>
        </View>

        <Spacer size={40} />
        <CTA page="mobile" onPress={handleSubmit(onSubmit)} />
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
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: Colors.textSecondary,
  },
  toggleLink: {
    color: Colors.primary,
  },
});
