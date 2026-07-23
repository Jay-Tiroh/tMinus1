import { LabelValueItem } from "@/components/LabelValueItem";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import { formatAmount } from "@/shared/utils/formatCurrency";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useWithdrawConfirmationFlow } from "../hooks/useWithdrawConfirmationFlow";

export const WithdrawConfirmationScreen = () => {
  const { draft, isLoading, handleConfirmWithdrawal, handleCancel } =
    useWithdrawConfirmationFlow();

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
          onPress: handleCancel,
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
        <ThemedButton
          title={isLoading ? "Submitting..." : "Confirm Withdrawal"}
          onPress={handleConfirmWithdrawal}
          variant="primary"
          disabled={isLoading}
          iconComponent={
            isLoading ? (
              <ActivityIndicator color={Colors.backgroundInk} />
            ) : undefined
          }
        />
      </View>
    </Template>
  );
};
