import BadgeStuff from "@/components/BadgeStuff";
import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/components/Spacer";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useAppSelector } from "@/store/hooks";
import { clearLastDeposit } from "@/store/slices/walletsSlice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";

const SuccessScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const lastDeposit = useAppSelector((s) => s.wallets.lastDeposit);
  const { transaction, estimatedCompletionAt } = lastDeposit ?? {};

  const items = [
    { id: "s_1", label: "Reference", value: transaction?.reference ?? "—" },
    { id: "s_2", label: "Asset", value: transaction?.toAsset ?? "—" },
    {
      id: "s_3",
      label: "Amount",
      value: transaction ? `+${transaction.toAmount}` : "—",
      valueColor: Colors.primaryClean,
    },
    {
      id: "s_4",
      label: "Fee",
      value: transaction ? `${transaction.feeAmount}` : "—",
    },
    { id: "s_5", label: "Status", value: transaction?.status ?? "—" },
    {
      id: "s_6",
      label: "Est. completion",
      value: estimatedCompletionAt
        ? new Date(estimatedCompletionAt).toLocaleString()
        : "—",
    },
  ];

  const handleViewTransaction = () => {
    dispatch(clearLastDeposit());
    router.push(`/(tabs)/wallets/transaction-details?id=${transaction?.id}`);
  };

  return (
    <Template
      textBlockProps={{
        title: "Deposit submitted",
        body: "Your sandbox deposit is pending and will complete automatically.",
      }}
      ctaProps={{
        title: "View transaction",
        variant: "primary",
        onPress: handleViewTransaction,
      }}
    >
      <Spacer size={20} />
      <BadgeStuff
        outerColor={Colors.primary}
        innerColor={Colors.primary}
        IconComponent={
          <MaterialCommunityIcons
            name="check"
            size={48}
            color={Colors.backgroundInk}
          />
        }
      />
      <Spacer size={40} />
      <View style={GeneralStyles.wrapper}>
        <View style={[GeneralStyles.box, { overflow: "hidden" }]}>
          {items.map((item) => (
            <LabelValueItem
              key={item.id}
              label={item.label}
              value={item.value}
              valueColor={item.valueColor}
            />
          ))}
        </View>
      </View>
    </Template>
  );
};

export default SuccessScreen;
