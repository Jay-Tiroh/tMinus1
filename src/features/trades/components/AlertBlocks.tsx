import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useAssetChart } from "@/features/markets";
import {
  CreatedPriceAlert,
  UpdatedPriceAlert,
  useCreatePriceAlertMutation,
  useUpdatePriceAlertMutation,
} from "@/features/user";
import BadgeStuff from "@/shared/components/BadgeStuff";
import { CryptoIcon } from "@/shared/components/CryptoIcon";
import { LabelValueItem } from "@/shared/components/LabelValueItem";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedText } from "@/shared/components/ThemedText";
import { showErrorToast } from "@/shared/hooks/showToast";
import { formatAmount } from "@/shared/utils/formatCurrency";
import { ms, s, vs } from "@/shared/utils/responsive";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

export type AlertAction = "create" | "edit";
type Direction = "Above" | "Below";

export interface CreateAlertProps {
  asset: string;
  submitRef: React.MutableRefObject<() => void>;
  onSuccess: (alert: CreatedPriceAlert | UpdatedPriceAlert) => void;
  onSubmittingChange: (isSubmitting: boolean) => void;
  alertToEdit?: CreatedPriceAlert | null;
  alertId?: string;
  alertAction?: AlertAction;
}

export const CreateAlert = ({
  asset,
  submitRef,
  onSuccess,
  onSubmittingChange,
  alertToEdit = null,
  alertId,
  alertAction = "create",
}: CreateAlertProps) => {
  const [activeDirection, setActiveDirection] = useState<Direction>(
    alertToEdit
      ? alertToEdit.direction === "above"
        ? "Above"
        : "Below"
      : "Above",
  );
  const [amount, setAmount] = useState(
    alertToEdit ? String(alertToEdit.targetPriceUsd) : "",
  );

  useEffect(() => {
    if (alertToEdit) {
      setActiveDirection(alertToEdit.direction === "above" ? "Above" : "Below");
      setAmount(String(alertToEdit.targetPriceUsd));
    }
  }, [alertToEdit]);

  const [createPriceAlert, { isLoading }] = useCreatePriceAlertMutation();
  const { coinInfo } = useAssetChart(asset);
  const [updatePriceAlert] = useUpdatePriceAlertMutation();

  const handleCreateAlert = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      showErrorToast({
        title: "Invalid amount",
        message: "Please enter a valid number for the target price.",
      });
      return;
    }
    try {
      if (alertAction === "edit" && alertId) {
        const result = await updatePriceAlert({
          alertId: alertId,
          data: {
            direction: activeDirection.toLocaleLowerCase() as "above" | "below",
            targetPriceUsd: parseFloat(amount),
          },
        }).unwrap();

        onSuccess(result.data);
        return;
      }
      const result = await createPriceAlert({
        assetSymbol: asset,
        direction: activeDirection.toLocaleLowerCase() as "above" | "below",
        targetPriceUsd: parseFloat(amount),
      }).unwrap();

      onSuccess(result.data);
    } catch (err: any) {
      showErrorToast({
        title: "Failed to create alert",
        message:
          err?.data?.error?.message ??
          "An error occurred while creating the price alert.",
      });
    }
  };

  useEffect(() => {
    onSubmittingChange(isLoading);
  }, [isLoading, onSubmittingChange]);

  submitRef.current = handleCreateAlert;

  const tabs: { title: Direction; bgColor: string; color: string }[] = [
    {
      title: "Above",
      bgColor: Colors.primaryClean,
      color: Colors.backgroundInk,
    },
    { title: "Below", bgColor: Colors.lossBright, color: Colors.snowGray },
  ];

  const config = [
    {
      label: "Trigger",
      value: `${asset.toUpperCase()} ${activeDirection.toLowerCase()} $${
        formatAmount(parseFloat(amount), false) || "—"
      }`,
    },
    {
      label: "Status",
      value: "Active after creation",
      valueColor: Colors.primaryClean,
    },
  ];

  return (
    <>
      <View
        style={[
          GeneralStyles.box,
          {
            height: vs(92),
            paddingHorizontal: s(16),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: s(12),
          },
        ]}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: s(12) }}
        >
          <CryptoIcon symbol={asset} size={ms(42)} />
          <TextBlock title={asset.toUpperCase()} body={coinInfo?.name} />
        </View>
        <ThemedText size={14} color={Colors.snowGray} weight="bold">
          ${formatAmount(coinInfo?.priceUsd ?? 0)}
        </ThemedText>
      </View>

      <Spacer size={46} />

      <View style={{ flexDirection: "row", alignItems: "center", gap: s(12) }}>
        {tabs.map((item) => (
          <TouchableOpacity
            key={item.title}
            onPress={() => setActiveDirection(item.title)}
            style={[
              GeneralStyles.box,
              {
                borderRadius: ms(18),
                backgroundColor:
                  activeDirection === item.title
                    ? item.bgColor
                    : Colors.surfaceNavy,
                width: s(80),
                height: vs(36),
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <ThemedText
              color={
                activeDirection === item.title ? item.color : Colors.snowGray
              }
              size={12}
              weight="medium"
            >
              {item.title}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <Spacer size={34} />

      <View
        style={[
          GeneralStyles.box,
          {
            height: vs(92),
            paddingHorizontal: s(16),
            paddingVertical: vs(16),
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: s(12),
          },
        ]}
      >
        <View
          style={{
            justifyContent: "space-between",
            gap: vs(12),
            height: "100%",
          }}
        >
          <ThemedText size={12} color={Colors.textMidGray} weight="bold">
            Target price
          </ThemedText>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={Colors.textMidGray}
            style={{
              fontSize: ms(26),
              fontFamily: Fonts.bold,
              color: Colors.snowGray,
              padding: 0,
              maxWidth: s(300),
            }}
          />
        </View>
        <ThemedText size={12} color={Colors.textMidGray} weight="bold">
          USD
        </ThemedText>
      </View>

      <Spacer size={44} />

      <View style={{ gap: vs(10) }}>
        {config.map((item) => (
          <LabelValueItem
            key={item.label}
            label={item.label}
            value={item.value}
            valueColor={item.valueColor}
          />
        ))}
      </View>
    </>
  );
};

export interface AlertSuccessProps {
  alert: CreatedPriceAlert | UpdatedPriceAlert | null;
}

export const AlertSuccess = ({ alert }: AlertSuccessProps) => {
  const config = [
    { label: "Asset", value: alert?.assetSymbol ?? "—" },
    { label: "Direction", value: alert?.direction ?? "—" },
    {
      label: "Target",
      value: alert ? `$${formatAmount(alert.targetPriceUsd)}` : "—",
    },
  ];

  return (
    <>
      <BadgeStuff
        title={`${alert?.assetSymbol ?? "Asset"} ${
          alert?.direction?.toLowerCase() ?? ""
        } $${formatAmount(alert?.targetPriceUsd ?? 0)}`}
        desc="This alert appears in Profile → Price Alerts and can be edited or deleted."
        outerColor={Colors.primaryClean}
        innerColor={Colors.primaryClean}
        IconComponent={
          <FontAwesome5 name="check" size={42} color={Colors.backgroundInk} />
        }
      />
      <Spacer size={56} />
      <View style={{ gap: vs(10) }}>
        {config.map((item) => (
          <LabelValueItem
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </View>
    </>
  );
};
