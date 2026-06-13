import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { WITHDRAWAL_CONTEXT } from "@/constants/mockData";
import { GeneralStyles } from "@/constants/themes";
import React from "react";
import { View } from "react-native";

const WithdrawConfirmationScreen = () => {
  return (
    <Template
      textBlockProps={{
        title: "Confirm withdrawal",
        body: "Review every detail before submitting.",
      }}
      ctaProps={{
        title: "Submit withdrawal",
        variant: "primary",
      }}
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
            {WITHDRAWAL_CONTEXT.amount}{" "}
            {WITHDRAWAL_CONTEXT.previewItems[0].value}
          </ThemedText>

          {WITHDRAWAL_CONTEXT.previewItems.map((item) => (
            <LabelValueItem
              key={item.id}
              label={item.label}
              value={item.value}
              valueColor={item.valueColor}
            />
          ))}
        </View>
      </View>

      <Spacer size={24} />

      <View style={GeneralStyles.wrapper}>
        <View style={[GeneralStyles.box, { padding: 20, gap: 8 }]}>
          <ThemedText size={12} color={Colors.textMidGray}>
            Transaction PIN
          </ThemedText>
          <ThemedText size={24} weight="bold" color={Colors.snowGray}>
            ••••
          </ThemedText>
        </View>
      </View>
    </Template>
  );
};

export default WithdrawConfirmationScreen;
