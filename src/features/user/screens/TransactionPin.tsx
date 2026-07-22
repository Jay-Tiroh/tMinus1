import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useUpdatePinMutation } from "@/features/user/api/profileApi";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import { ThemedText } from "@/shared/components/ThemedText";
import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TextInput, View } from "react-native";
import { PinFormValues, pinSchema } from "../validation/transactionPin.schema";

const TransactionPINScreen = () => {
  const [updatePin, { isLoading }] = useUpdatePinMutation();

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
      reset();
      router.back();
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
      }}
      topSpacerSize={32}
    >
      <View style={GeneralStyles.wrapper}>
        <View style={{ gap: 16 }}>
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
