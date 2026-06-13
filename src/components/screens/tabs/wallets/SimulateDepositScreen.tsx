import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { showErrorToast } from "@/hooks/showToast";
import { useAppDispatch } from "@/store/hooks";
import { useSimulateDepositMutation } from "@/store/services/walletsApi";
import { setLastDeposit } from "@/store/slices/walletsSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";
import { z } from "zod";

const schema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      "Must be a positive number",
    ),
  delay: z
    .string()
    .min(1, "Delay is required")
    .refine(
      (v) =>
        !isNaN(Number(v)) &&
        Number.isInteger(Number(v)) &&
        Number(v) >= 0 &&
        Number(v) <= 60,
      "Must be a whole number between 0 and 60",
    ),
});

type FormValues = z.infer<typeof schema>;

const SimulateDepositScreen = () => {
  const { asset } = useLocalSearchParams();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { amount: "200", delay: "5" },
  });

  const amount = watch("amount");

  const [simulateDeposit, { isError, isLoading, isSuccess }] =
    useSimulateDepositMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const onSubmit = async (data: FormValues) => {
    try {
      const result = await simulateDeposit({
        amount: Number(data.amount),
        settlementDelaySeconds: Number(data.delay),
      }).unwrap();
      dispatch(setLastDeposit(result));
      router.push("/wallets/success");
    } catch (error) {
      showErrorToast({
        title: "Failed to create sandbox deposit",
        message: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <Template
      textBlockProps={{
        title: "Simulate deposit",
        body: `Create a pending ${asset} deposit for testing polling and receipts.`,
      }}
      ctaProps={{
        title: "Create sandbox deposit",
        variant: "primary",
        onPress: handleSubmit(onSubmit),
        disabled: isLoading || isSuccess,
        iconComponent:
          isLoading || isSuccess ? (
            <ActivityIndicator color={Colors.white} />
          ) : undefined,
      }}
    >
      <View style={[GeneralStyles.wrapper, { gap: 16 }]}>
        {/* Static: Asset */}
        <View style={[GeneralStyles.box, { padding: 16, gap: 4 }]}>
          <ThemedText size={12} color={Colors.textMidGray}>
            Asset
          </ThemedText>
          <ThemedText size={16} weight="medium" color={Colors.snowGray}>
            {asset}
          </ThemedText>
        </View>

        {/* Controlled: Amount */}
        <Controller
          control={control}
          name="amount"
          render={({ field: { value, onChange, onBlur } }) => (
            <View
              style={[
                GeneralStyles.box,
                styles.inputBox,
                errors.amount && styles.inputBoxError,
              ]}
            >
              <ThemedText size={12} color={Colors.textMidGray}>
                Amount
              </ThemedText>
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="decimal-pad"
                placeholder="e.g. 200"
                placeholderTextColor={Colors.textMidGray}
                style={styles.input}
              />
              {errors.amount && (
                <ThemedText size={11} color={Colors.loss}>
                  {errors.amount.message}
                </ThemedText>
              )}
            </View>
          )}
        />

        {/* Controlled: Settlement delay */}
        <Controller
          control={control}
          name="delay"
          render={({ field: { value, onChange, onBlur } }) => (
            <View
              style={[
                GeneralStyles.box,
                styles.inputBox,
                errors.delay && styles.inputBoxError,
              ]}
            >
              <ThemedText size={12} color={Colors.textMidGray}>
                Settlement delay (seconds)
              </ThemedText>
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                placeholder="e.g. 5"
                placeholderTextColor={Colors.textMidGray}
                style={styles.input}
              />
              {errors.delay && (
                <ThemedText size={11} color={Colors.loss}>
                  {errors.delay.message}
                </ThemedText>
              )}
            </View>
          )}
        />
      </View>

      <Spacer size={24} />

      <View style={GeneralStyles.wrapper}>
        <View style={[GeneralStyles.box, { padding: 20 }]}>
          <ThemedText
            weight="bold"
            size={14}
            color={Colors.snowGray}
            style={{ marginBottom: 12 }}
          >
            Deposit preview
          </ThemedText>
          <ThemedText
            weight="bold"
            size={24}
            color={Colors.primaryClean}
            style={{ marginBottom: 8 }}
          >
            +{amount || "0"} {asset}
          </ThemedText>
          <ThemedText size={13} color={Colors.textMidGray}>
            Status starts as pending, then completes automatically.
          </ThemedText>
        </View>
      </View>
    </Template>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    padding: 16,
    gap: 4,
  },
  inputBoxError: {
    borderColor: "#FF4D4D",
    borderWidth: 1,
  },
  input: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.snowGray,
    padding: 0, // remove default TextInput padding so it aligns flush
    margin: 0,
  },
});

export default SimulateDepositScreen;
