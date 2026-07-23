import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useKyc } from "@/features/kyc/hooks/useKyc";
import { useFiat } from "@/features/user";
import BadgeStuff from "@/shared/components/BadgeStuff";
import { LabelValueItem } from "@/shared/components/LabelValueItem";
import { Spacer } from "@/shared/components/Spacer";

import { formatCurrency } from "@/shared/utils/formatCurrency";
import { vs } from "@/shared/utils/responsive";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { View } from "react-native";

export const Approved = () => {
  const { limits } = useKyc();
  const { symbol, convertFromUSD } = useFiat();

  const config = [
    {
      label: "Deposit per transaction",
      value:
        symbol +
        formatCurrency(convertFromUSD(limits?.depositPerTransactionUsd ?? NaN)),
    },
    {
      label: "Trade per transaction",
      value:
        symbol +
        formatCurrency(convertFromUSD(limits?.tradePerTransactionUsd ?? NaN)),
    },
    {
      label: "Withdrawal transaction",
      value:
        symbol +
        formatCurrency(
          convertFromUSD(limits?.withdrawalPerTransactionUsd ?? NaN),
        ),
    },
    {
      label: "Daily withdrawal",
      value:
        symbol +
        formatCurrency(convertFromUSD(limits?.dailyWithdrawalUsd ?? NaN)),
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
