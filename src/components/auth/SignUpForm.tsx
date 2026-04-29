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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

type FormData = EmailPasswordFormData;

export default function SignUpForm() {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(emailPasswordSchema),
    mode: "onChange",
  });

  const router = useRouter();
  const onSubmit = (data: FormData) => {
    console.log(data);
    router.push("/(auth)/success");
  };

  return (
    <View style={styles.container}>
      <ThemedText
        size={32}
        weight="bold"
        style={{ color: Colors.white, lineHeight: 46, alignSelf: "flex-start" }}
      >
        Sign up
      </ThemedText>

      <Spacer size={44} />

      <View style={{ gap: Spacing.lg, width: "100%" }}>
        <View style={styles.inputContainer}>
          <View style={styles.labelRow}>
            <ThemedText size={14} style={styles.label}>
              Email
            </ThemedText>
            <ThemedText
              size={14}
              style={{ color: Colors.primary }}
              onPress={() => router.push("/register-mobile")}
            >
              Register with mobile
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
        </View>
      </View>

      <Spacer size={40} />
      <CTA page="signup" onPress={handleSubmit(onSubmit)} />
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
