import BadgeStuff from "@/components/BadgeStuff";
import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/components/Spacer";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { formatCurrency } from "@/helpers/functions";
import { useKyc } from "@/hooks/useKyc";
import { vs } from "@/utils/responsive";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { View } from "react-native";

const Approved = () => {
  const { limits } = useKyc();

  const config = [
    {
      label: "Deposit per transaction",
      value: "$" + formatCurrency(limits?.depositPerTransactionUsd ?? NaN),
    },
    {
      label: "Trade per transaction",
      value: "$" + formatCurrency(limits?.tradePerTransactionUsd ?? NaN),
    },
    {
      label: "Withdrawal transaction",
      value: "$" + formatCurrency(limits?.withdrawalPerTransactionUsd ?? NaN),
    },
    {
      label: "Daily withdrawal",
      value: "$" + formatCurrency(limits?.dailyWithdrawalUsd ?? NaN),
    },
  ];
  return (
    <View>
      <Spacer size={12} />
      <BadgeStuff
        IconComponent={
          <FontAwesome5 name="check" color={Colors.backgroundInk} size={48} />
        }
        outerColor={Colors.primaryClean}
        innerColor={Colors.primaryClean}
        title="Level 2 unlocked"
      />
      <Spacer size={80} />
      <View
        style={{
          ...GeneralStyles.wrapper,
          gap: vs(14),
        }}
      >
        {config.map((item) => (
          <LabelValueItem
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </View>
    </View>
  );
};

export default Approved;
