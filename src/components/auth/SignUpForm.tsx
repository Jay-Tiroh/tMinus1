import CTA from "@/components/auth/CTA";
import { ThemedTextInput } from "@/components/auth/ThemedTextInput";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { SignupFormData, signupSchema } from "@/schemas/authSchemas";
import { useAppDispatch } from "@/store/hooks";
import { useRegisterMutation } from "@/store/services/baseApi";
import { setCredentials } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

type FormData = SignupFormData;

export default function SignUpForm() {
  const dispatch = useAppDispatch();

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const [register, { isLoading, isError, isSuccess, error }] =
    useRegisterMutation();

  const router = useRouter();
  const onSubmit = async (data: FormData) => {
    const result = await register(data);
    if ("data" in result && result.data) {
      dispatch(setCredentials(result.data));
      router.push("/(auth)/success");
    }
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
            Fullname
          </ThemedText>
          <ThemedTextInput
            control={control}
            name="fullName"
            placeholder="Enter your fullname"
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedText size={14} style={styles.label}>
            Mobile Number
          </ThemedText>
          <ThemedTextInput
            control={control}
            name="phone"
            placeholder="Enter your phone number"
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
      <CTA
        page="signup"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />
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
