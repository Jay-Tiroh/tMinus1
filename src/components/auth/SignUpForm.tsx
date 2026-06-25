import { ThemedInput } from "@/components/auth/ThemedTextInput";
import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { showErrorToast } from "@/hooks/showToast"; // Adjust import path if needed
import { signupSchema } from "@/schemas/authSchemas";
import {
  useRegisterMutation,
  useValidateSignupMutation,
} from "@/store/services/authApi"; // Adjust import path if needed

import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { z } from "zod";

// 1. Extend your base schema to handle the confirm password check
const signUpFormSchema = signupSchema
  .extend({
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

const SignUpForm = () => {
  const router = useRouter();

  // 2. Initialize React Hook Form
  const { control, handleSubmit } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirm: "",
    },
    mode: "onChange",
  });

  // 3. Initialize API Mutations
  const [validateSignup, { isLoading: isValidating }] =
    useValidateSignupMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const isLoading = isValidating || isRegistering;

  // 4. Form Submission Flow
  const onSubmit = async (data: SignUpFormValues) => {
    try {
      // Step A: Validate the details first
      const validationResult = await validateSignup({
        email: data.email,
        phone: data.phone,
      }).unwrap();

      if (!validationResult.canRegister) {
        // Extract specific error messages from the backend validation response
        const emailError = !validationResult.email?.available
          ? validationResult.email?.message
          : null;
        const phoneError = !validationResult.phone?.available
          ? validationResult.phone?.message
          : null;

        showErrorToast({
          title: "Registration Unavailable",
          message:
            emailError ||
            phoneError ||
            "These details cannot be used to register.",
        });
        return; // Halt registration
      }

      // Step B: Proceed with actual registration
      const registerResult = await register({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      }).unwrap();

      // Step C: Route to Verify OTP screen, passing the email for context
      router.push({
        pathname: "/verify",
        params: { email: data.email },
      });
    } catch (error: any) {
      showErrorToast({
        title: "Registration Failed",
        message:
          error?.data?.message ||
          "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ gap: 16 }}>
        <ThemedInput
          control={control}
          name="fullName"
          icon={<Feather name="user" size={20} color={Colors.primaryClean} />}
          placeholder="Full name"
        />
        <ThemedInput
          control={control}
          name="email"
          icon={<Feather name="mail" size={20} color={Colors.primaryClean} />}
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <ThemedInput
          control={control}
          name="phone"
          icon={<Feather name="phone" size={20} color={Colors.primaryClean} />}
          placeholder="Phone number"
          keyboardType="phone-pad"
        />
        <ThemedInput
          control={control}
          name="password"
          icon={
            <MaterialIcons
              name="lock-outline"
              size={20}
              color={Colors.primaryClean}
            />
          }
          placeholder="Create password"
          secureTextEntry
          hasToggle
        />
        <ThemedInput
          control={control}
          name="confirm"
          icon={
            <MaterialIcons
              name="lock-outline"
              size={20}
              color={Colors.primaryClean}
            />
          }
          placeholder="Confirm password"
          secureTextEntry
          hasToggle
        />
      </View>

      <Spacer size={16} />

      <ThemedText
        color={Colors.textMidGray}
        size={13}
        style={{ lineHeight: 18 }}
      >
        Use your real name and an international phone number for verification.
      </ThemedText>

      <Spacer size={32} />

      <ThemedButton
        title={isLoading ? "Signing up..." : "Sign up"}
        variant="primary"
        disabled={isLoading}
        onPress={handleSubmit(onSubmit)}
      />

      <Spacer size={40} />

      <View style={styles.centerRow}>
        <ThemedText color={Colors.textMidGray} size={14}>
          Already have an account?{" "}
          <ThemedText
            color={Colors.snowGray}
            weight="medium"
            // onPress={() => router.push("/login")}
            // Add actual route for sign-in
            style={{ padding: 4 }}
          >
            Sign in
          </ThemedText>
        </ThemedText>
      </View>
    </View>
  );
};

export default SignUpForm;

const styles = StyleSheet.create({
  centerRow: { alignItems: "center", width: "100%" },
});
