import { Spacer } from "@/shared/components/Spacer";
import { ThemedText } from "@/shared/components/ThemedText";
import Template from "@/shared/components/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { showErrorToast, showSuccessToast } from "@/hooks/showToast"; // Adjust path to where your toast functions live
import { useUpdatePinMutation } from "@/store/services/profileApi"; // Adjust path as needed
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TextInput, View } from "react-native";
import { z } from "zod";

// 1. Define the validation schema
const pinSchema = z
  .object({
    currentPin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d+$/, "PIN must contain only numbers"),
    newPin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d+$/, "PIN must contain only numbers"),
    confirmPin: z.string().length(4, "PIN must be exactly 4 digits"),
  })
  .refine((data) => data.newPin === data.confirmPin, {
    message: "New PINs do not match",
    path: ["confirmPin"],
  });

type PinFormValues = z.infer<typeof pinSchema>;

const TransactionPINScreen = () => {
  // 2. Initialize the API mutation
  const [updatePin, { isLoading }] = useUpdatePinMutation();

  // 3. Initialize React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PinFormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      currentPin: "",
      newPin: "",
      confirmPin: "",
    },
  });

  // 4. Handle form submission
  const router = useRouter();
  const onSubmit = async (data: PinFormValues) => {
    try {
      await updatePin({
        currentPin: data.currentPin,
        newPin: data.newPin,
      }).unwrap();

      showSuccessToast({
        title: "PIN Updated",
        message: "Your transaction PIN has been successfully updated.",
      });
      reset(); // Clear the form on success
      router.back(); // Navigate back to the previous screen
    } catch (err: any) {
      showErrorToast({
        title: "Update Failed",
        message:
          err?.data?.error?.message ||
          "An error occurred while updating your PIN. Please try again.",
      });
    }
  };

  return (
    <Template
      textBlockProps={{
        title: "Transaction PIN",
        body: "Update the PIN used for trade and withdrawal confirmations.",
      }}
      ctaProps={{
        title: "Update PIN",
        variant: "primary",
        onPress: handleSubmit(onSubmit),
        disabled: isLoading,
        // isLoading: isLoading, // Assumes your CTA supports an loading spinner state
      }}
      topSpacerSize={32}
    >
      <View style={GeneralStyles.wrapper}>
        <View style={{ gap: 16 }}>
          {/* Current PIN Field */}
          <Controller
            control={control}
            name="currentPin"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <View style={styles.inputContainer}>
                  <ThemedText size={12} color={Colors.textMidGray}>
                    Current PIN
                  </ThemedText>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    keyboardType="number-pad"
                    maxLength={4}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="••••"
                    placeholderTextColor={Colors.textMidGray}
                  />
                </View>
                {errors.currentPin && (
                  <ThemedText size={12} color="red" style={styles.errorText}>
                    {errors.currentPin.message}
                  </ThemedText>
                )}
              </View>
            )}
          />

          {/* New PIN Field */}
          <Controller
            control={control}
            name="newPin"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <View style={styles.inputContainer}>
                  <ThemedText size={12} color={Colors.textMidGray}>
                    New PIN
                  </ThemedText>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    keyboardType="number-pad"
                    maxLength={4}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="••••"
                    placeholderTextColor={Colors.textMidGray}
                  />
                </View>
                {errors.newPin && (
                  <ThemedText size={12} color="red" style={styles.errorText}>
                    {errors.newPin.message}
                  </ThemedText>
                )}
              </View>
            )}
          />

          {/* Confirm PIN Field */}
          <Controller
            control={control}
            name="confirmPin"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <View style={styles.inputContainer}>
                  <ThemedText size={12} color={Colors.textMidGray}>
                    Confirm PIN
                  </ThemedText>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    keyboardType="number-pad"
                    maxLength={4}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="••••"
                    placeholderTextColor={Colors.textMidGray}
                  />
                </View>
                {errors.confirmPin && (
                  <ThemedText size={12} color="red" style={styles.errorText}>
                    {errors.confirmPin.message}
                  </ThemedText>
                )}
              </View>
            )}
          />
        </View>

        <Spacer size={32} />

        {/* Info Box */}
        <View style={[GeneralStyles.box, { padding: 20, gap: 8 }]}>
          <ThemedText size={16} weight="bold" color={Colors.white}>
            PIN rules
          </ThemedText>
          <ThemedText size={14} color={Colors.textMidGray}>
            Use four digits. Avoid repeated or obvious numbers in production
            apps.
          </ThemedText>
        </View>
      </View>
    </Template>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    ...GeneralStyles.box,
    padding: 16,
    height: 80,
    justifyContent: "center",
    gap: 8,
  },
  input: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
    letterSpacing: 4,
    padding: 0,
    margin: 0,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
});

export default TransactionPINScreen;
