import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";

import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { showErrorToast } from "@/hooks/showToast";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRequestWithdrawalMutation } from "@/store/services/walletsApi";
import {
  clearWithdrawalDraft,
  setLastWithdrawal,
} from "@/store/slices/walletsSlice";
import { logger } from "@/utils/logger";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator , View } from "react-native";

const WithdrawConfirmationScreen = () => {
  const dispatch = useAppDispatch();
  const toSuccess = useGoToRoute("/wallets/success?type=withdrawal");
  const draft = useAppSelector((s) => s.wallets.withdrawalDraft);
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

  const handleConfirmWithdrawal = async () => {
    try {
      const result = await requestWithdrawal(draft).unwrap();
      dispatch(setLastWithdrawal(result));
      dispatch(clearWithdrawalDraft());
      toSuccess();
    } catch (e) {
      logger.error("Withdrawal failed:", e);
      showErrorToast({
        title: "Withdrawal failed",
        message: (e as any)?.data?.error?.message || "Please try again.",
      })
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
        <ThemedButton
          title={isLoading? "Submitting..." :"Confirm Withdrawal"}
          onPress={handleConfirmWithdrawal}
          variant="primary"
          disabled={isLoading}
          iconComponent={isLoading ? <ActivityIndicator color={ Colors.backgroundInk} /> : undefined}
        />
      </View>

    </Template>
  );
};

export default WithdrawConfirmationScreen;
