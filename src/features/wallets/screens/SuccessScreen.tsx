import BadgeStuff from "@/components/BadgeStuff";
import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import {
  clearLastDeposit,
  clearLastTransfer,
  clearLastWithdrawal,
} from "@/features/wallets/storage/walletsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import {
  mapTransactionToDisplayItems,
  SuccessScreenType,
} from "../utils/transaction.mappers";

const COPY: Record<SuccessScreenType, { title: string; body: string }> = {
  deposit: {
    title: "Deposit submitted",
    body: "Your sandbox deposit is pending and will complete automatically.",
  },
  withdrawal: {
    title: "Withdrawal submitted",
    body: "Your withdrawal is being processed and will update shortly.",
  },
  transfer: {
    title: "Transfer sent",
    body: "Your transfer has been sent to the recipient.",
  },
};

export const SuccessScreen = () => {
  const params = useLocalSearchParams<{ type?: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const type: SuccessScreenType =
    params.type === "withdrawal" || params.type === "transfer"
      ? params.type
      : "deposit";

  const lastDeposit = useAppSelector((s) => s.wallets.lastDeposit);
  const lastWithdrawal = useAppSelector((s) => s.wallets.lastWithdrawal);
  const lastTransfer = useAppSelector((s) => s.wallets.lastTransfer);

  const { items, hasData, transactionId } = mapTransactionToDisplayItems(
    type,
    lastDeposit,
    lastWithdrawal,
    lastTransfer,
  );

  const handleViewTransaction = () => {
    if (type === "deposit") dispatch(clearLastDeposit());
    if (type === "withdrawal") dispatch(clearLastWithdrawal());
    if (type === "transfer") dispatch(clearLastTransfer());

    router.replace({
      pathname: "/(tabs)/wallets/transaction-details",
      params: { id: transactionId },
    });
  };

  return (
    <Template
      textBlockProps={COPY[type]}
      ctaProps={{
        title: "View transaction",
        variant: "primary",
        onPress: handleViewTransaction,
        disabled: !hasData,
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
