import CTA from "@/components/auth/CTA";
import NavHeader from "@/components/auth/NavHeader";
import { ThemedTextInput } from "@/components/auth/ThemedTextInput";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import {
  MobilePasswordFormData,
  mobilePasswordSchema,
} from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type FormData = MobilePasswordFormData;

export default function RegisterMobile() {
  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(mobilePasswordSchema),
    mode: "onChange",
  });
  const router = useRouter();

  const onSubmit = (data: FormData) => {
    console.log(data);
    router.push("/(auth)/verify");
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, flex: 1 }}>
      <NavHeader title="Sign Up" />
      <Spacer size={26} />
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
            Register with mobile
          </ThemedText>
          <ThemedText
            size={14}
            letterSpacing={2.64}
            weight="regular"
            style={{ color: Colors.textSecondary }}
          >
            Please type your number, then we’ll send a verification code for
            authentication.
          </ThemedText>
        </View>
        <Spacer size={44} />

        <View style={{ gap: Spacing.lg, width: "100%" }}>
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <ThemedText size={14} style={styles.label}>
                Mobile number
              </ThemedText>
            </View>
            <ThemedTextInput
              control={control}
              name="mobileNumber"
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText size={14} style={styles.label}>
              Password
            </ThemedText>
            <ThemedTextInput
              control={control}
              name="password"
              placeholder="Enter your password"
            />
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
});
