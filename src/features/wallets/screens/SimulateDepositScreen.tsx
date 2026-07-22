import { Spacer } from "@/shared/components/Spacer";
import { ThemedText } from "@/shared/components/ThemedText";
import Template from "@/shared/components/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Controller } from "react-hook-form";
import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";
import { useSimulateDepositFlow } from "../hooks/useSimulateDepositFlow";

export const SimulateDepositScreen = () => {
  const { asset } = useLocalSearchParams<{ asset: string }>();

  const { form, onSubmit, isPending, amountPreview } = useSimulateDepositFlow();
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <Template
      textBlockProps={{
        title: "Simulate deposit",
        body: `Create a pending ${asset} deposit for testing polling and receipts.`,
      }}
      ctaProps={{
        title: "Create sandbox deposit",
        variant: "primary",
        onPress: onSubmit,
        disabled: isPending,
        iconComponent: isPending ? (
          <ActivityIndicator color={Colors.white} />
        ) : undefined,
      }}
    >
      <View style={[GeneralStyles.wrapper, { gap: 16 }]}>
        <View style={[GeneralStyles.box, { padding: 16, gap: 4 }]}>
          <ThemedText size={12} color={Colors.textMidGray}>
            Asset
          </ThemedText>
          <ThemedText size={16} weight="medium" color={Colors.snowGray}>
            {asset}
          </ThemedText>
        </View>

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
            +{amountPreview || "0"} {asset}
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
    padding: 0,
    margin: 0,
  },
});
