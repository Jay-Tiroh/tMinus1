import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { WITHDRAWAL_CONTEXT } from "@/constants/mockData";
import { GeneralStyles } from "@/constants/themes";
import React from "react";
import { View } from "react-native";

const WithdrawFormScreen = () => {
  // Replace with state/form hooks when connecting API
  const formFields = [
    { id: "wf_1", label: "Asset", value: WITHDRAWAL_CONTEXT.assetLabel },
    { id: "wf_2", label: "Amount", value: WITHDRAWAL_CONTEXT.amount },
    {
      id: "wf_3",
      label: "Destination address",
      value: WITHDRAWAL_CONTEXT.destination,
    },
    { id: "wf_4", label: "Network", value: WITHDRAWAL_CONTEXT.network },
  ];

  return (
    <Template
      textBlockProps={{
        title: "Withdraw",
        body: "Withdrawals require verification and transaction PIN.",
      }}
      ctaProps={{
        title: "Preview withdrawal",
        variant: "primary",
      }}
    >
      <View style={[GeneralStyles.wrapper, { gap: 16 }]}>
        {formFields.map((field) => (
          <View
            key={field.id}
            style={[GeneralStyles.box, { padding: 16, gap: 4 }]}
          >
            <ThemedText size={12} color={Colors.textMidGray}>
              {field.label}
            </ThemedText>
            <ThemedText size={16} weight="bold" color={Colors.snowGray}>
              {field.value}
            </ThemedText>
          </View>
        ))}
      </View>

      <Spacer size={24} />

      <View style={GeneralStyles.wrapper}>
        <View
          style={[
            GeneralStyles.box,
            { padding: 20, backgroundColor: Colors.surfaceGreenNight },
          ]}
        >
          <ThemedText
            weight="bold"
            size={14}
            color={Colors.snowGray}
            style={{ marginBottom: 4 }}
          >
            {WITHDRAWAL_CONTEXT.limitTitle}
          </ThemedText>
          <ThemedText size={13} color={Colors.textMidGray}>
            {WITHDRAWAL_CONTEXT.limitSubtext}
          </ThemedText>
        </View>
      </View>
    </Template>
  );
};

export default WithdrawFormScreen;
