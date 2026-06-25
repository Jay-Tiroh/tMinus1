import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";

import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRequestWithdrawalMutation } from "@/store/services/walletsApi";
import {
  clearWithdrawalDraft,
  setLastWithdrawal,
} from "@/store/slices/walletsSlice";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

const WithdrawConfirmationScreen = () => {
  const dispatch = useAppDispatch();
  const toSuccess = useGoToRoute("/wallets/success?type=withdrawal");
  const draft = useAppSelector((s) => s.wallets.withdrawalDraft);

  const [error, setError] = useState<string | null>(null);
  const [pinAttempt, setPinAttempt] = useState(0);
  const [requestWithdrawal, { isLoading }] = useRequestWithdrawalMutation();
  const router = useRouter();

  if (!draft) {
    return (
      <Template
        textBlockProps={{
          title: "Confirm withdrawal",
          body: "No withdrawal in progress.",
        }}
        ctaProps={{
          title: "Back to withdraw",
          variant: "primary",
          onPress: () => {
            router.replace("/wallets/withdraw/withdraw-form");
          },
        }}
      >
        <View style={GeneralStyles.wrapper}>
          <ThemedText size={14} color={Colors.textMidGray}>
            Start a new withdrawal from the wallet screen.
          </ThemedText>
        </View>
      </Template>
    );
  }

  const previewItems = [
    { id: "asset", label: "Asset", value: draft.assetSymbol },
    { id: "address", label: "Destination address", value: draft.address },
    { id: "network", label: "Network", value: draft.network },
  ];

  const handlePinComplete = async (pin: string) => {
    setError(null);
    try {
      const result = await requestWithdrawal(draft).unwrap();
      dispatch(setLastWithdrawal(result));
      dispatch(clearWithdrawalDraft());
      toSuccess();
    } catch (e) {
      setError("Withdrawal failed. Check your PIN and try again.");
      setPinAttempt((n) => n + 1);
    }
  };

  return (
    <Template
      textBlockProps={{
        title: "Confirm withdrawal",
        body: "Review every detail before submitting.",
      }}
      ctaProps={undefined}
    >
      <View style={GeneralStyles.wrapper}>
        <View
          style={[GeneralStyles.box, { overflow: "hidden", paddingTop: 24 }]}
        >
          <ThemedText
            weight="bold"
            size={32}
            color={Colors.snowGray}
            style={{ textAlign: "center", marginBottom: 16 }}
          >
            {formatAmount(draft.amount)} {draft.assetSymbol}
          </ThemedText>
          {previewItems.map((item) => (
            <LabelValueItem
              key={item.id}
              label={item.label}
              value={item.value}
            />
          ))}
        </View>
      </View>
      <Spacer size={24} />
      <View style={GeneralStyles.wrapper}>
        <View
          style={[
            GeneralStyles.box,
            { padding: 20, gap: 8, backgroundColor: "transparent" },
          ]}
        >
          <ThemedText size={12} color={Colors.textMidGray}>
            Transaction PIN
          </ThemedText>
          <Spacer size={8} />

          <OtpInput
            key={pinAttempt}
            numberOfDigits={4}
            onFilled={handlePinComplete}
            secureTextEntry
            theme={{
              pinCodeTextStyle: {
                color: Colors.snowGray,
                fontFamily: Fonts.bold,
              },
              focusedPinCodeContainerStyle: {
                borderColor: Colors.primaryClean,
              },
              pinCodeContainerStyle: {
                minWidth: 80,
                borderColor: Colors.surface,
              },
            }}
          />
        </View>
      </View>
      {error && (
        <View style={GeneralStyles.wrapper}>
          <ThemedText size={12} color={Colors.loss} style={{ marginTop: 8 }}>
            {error}
          </ThemedText>
        </View>
      )}
      {isLoading && (
        <View style={GeneralStyles.wrapper}>
          <ThemedText
            size={12}
            color={Colors.textMidGray}
            style={{ marginTop: 8 }}
          >
            Submitting...
          </ThemedText>
        </View>
      )}
    </Template>
  );
};

export default WithdrawConfirmationScreen;
