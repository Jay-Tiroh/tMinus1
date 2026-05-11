import Fingerprint from "@/assets/icons/fingerprint.svg";
import CTA from "@/components/auth/CTA";
import { ThemedTextInput } from "@/components/auth/ThemedTextInput";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import {
  EmailPasswordFormData,
  emailPasswordSchema,
} from "@/schemas/authSchemas";
import { useAppDispatch } from "@/store/hooks";
import { useLoginMutation } from "@/store/services/baseApi";
import { setCredentials } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

type FormData = EmailPasswordFormData;

export default function SignInForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(emailPasswordSchema),
    mode: "onChange",
  });

  const [login, { isLoading, isError, error }] = useLoginMutation();

  const onSubmit = async (data: FormData) => {
    const result = await login(data);
    if ("data" in result && result.data) {
      dispatch(setCredentials(result.data));
      router.push("/(tabs)/home");
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText
        size={32}
        weight="bold"
        style={{ color: Colors.white, lineHeight: 46, alignSelf: "flex-start" }}
      >
        Sign In
      </ThemedText>

      <Spacer size={14} />
      {isError && (
        <ThemedText color={Colors.lossAlt} style={{ width: "100%" }}>
          {(error as any)?.data?.message ?? "Something went wrong"}
        </ThemedText>
      )}
      <Spacer size={44} />

      <View style={{ gap: Spacing.lg, width: "100%" }}>
        <View style={styles.inputContainer}>
          <View style={styles.labelRow}>
            <ThemedText size={14} style={styles.label}>
              Email
            </ThemedText>
          </View>

          <ThemedTextInput
            control={control}
            name="email"
            placeholder="Enter your email"
            keyboardType="email-address"
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
          <ThemedText size={14} style={{ color: Colors.primary }}>
            Forgot password?
          </ThemedText>
        </View>
      </View>

      <Spacer size={40} />
      <CTA
        page="signin"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />
      <Spacer size={55} />

      <View style={{ gap: 20, alignItems: "center" }}>
        <Fingerprint color={Colors.primary} style={{ width: 40, height: 40 }} />
        <ThemedText
          size={14}
          letterSpacing={2.64}
          style={{ color: Colors.textSecondary }}
        >
          Use fingerprint instead?
        </ThemedText>
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
