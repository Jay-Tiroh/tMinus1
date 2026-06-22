import BadgeStuff from "@/components/BadgeStuff";
import { CryptoIcon } from "@/components/CryptoIcon";
import { LabelValueItem } from "@/components/LabelValueItem";
import { ConfigType } from "@/components/screens/tabs/trades/QuoteScreen";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { showErrorToast } from "@/hooks/showToast";
import { useAssetChart } from "@/hooks/useAssetChart";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import {
  useCreatePriceAlertMutation,
  useGetPriceAlertsQuery,
  useUpdatePriceAlertMutation,
} from "@/store/services/priceAlertsApi";
import {
  CreatedPriceAlert,
  PriceAlert,
  UpdatedPriceAlert,
} from "@/types/priceAlerts";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

export type AlertAction = "create" | "edit";
type Direction = "Above" | "Below";

// ─── AlertScreen ─────────────────────────────────────────────────────────────
const AlertScreen = () => {
  const params = useLocalSearchParams<{
    asset?: string;
    alertAction?: AlertAction;
    alertId?: string;
  }>();
  const asset = params.asset ?? "";
  const alertAction = params.alertAction ?? "create";
  const alertId = params.alertId ?? "";

  const [alertToEdit, setAlertToEdit] = useState<CreatedPriceAlert | null>(
    null,
  );
  const submitRef = useRef<() => void>(() => {});
  const [activeConfigIndex, setActiveConfigIndex] = useState(0);
  const [createdAlert, setCreatedAlert] = useState<CreatedPriceAlert | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleConfig = (alert?: CreatedPriceAlert) => {
    if (alert) setCreatedAlert(alert);
    setActiveConfigIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const { data } = useGetPriceAlertsQuery();
  const alertsData = data?.data ?? [];

  useFocusEffect(
    useCallback(() => {
      setActiveConfigIndex(0);
      setCreatedAlert(null);
      setIsSubmitting(false);
    }, []),
  );

  useEffect(() => {
    if (
      alertAction === "edit" &&
      alertId &&
      alertsData.length > 0 &&
      !alertToEdit
    ) {
      const alert = alertsData.find((a: PriceAlert) => a.id === alertId);
      if (alert) {
        setAlertToEdit(alert);
      } else {
        showErrorToast({
          title: "Alert not found",
          message: "The alert you are trying to edit does not exist.",
        });
      }
    }
  }, [alertsData, alertId, alertAction]);

  const handleViewAlerts = useGoToRoute("/user/price-alerts");

  const Config: ConfigType[] = [
    {
      title: (alertAction === "create" ? "Create" : "Edit") + " price alert",
      body: `Get notified when ${asset} crosses your target.`,
      cta: {
        title: isSubmitting
          ? alertAction === "edit"
            ? "Updating..."
            : "Creating..."
          : alertAction === "edit"
            ? "Update alert"
            : "Create alert",
        onPress: () => submitRef.current?.(),
        variant: "primary",
        style: undefined,
        textStyle: undefined,
      },
      content: () => (
        <CreateAlert
          asset={asset}
          submitRef={submitRef}
          onSuccess={toggleConfig}
          onSubmittingChange={setIsSubmitting}
          alertToEdit={alertToEdit}
          alertId={alertId}
          alertAction={alertAction}
        />
      ),
      topSpacerSize: 42,
    },
    {
      title: alertAction === "edit" ? "Alert updated" : "Alert created",
      body: "We will notify you when the target is reached.",
      cta: {
        title: "View alerts",
        onPress: handleViewAlerts,
        variant: "primary",
        style: undefined,
        textStyle: undefined,
      },
      content: () => <Success alert={createdAlert} />,
      topSpacerSize: 42,
    },
  ];

  // ✅ Derived directly — no useState, no useEffect
  const activeConfig = Config[activeConfigIndex];

  return (
    <Template
      textBlockProps={{
        title: activeConfig.title,
        body: activeConfig.body,
      }}
      ctaProps={{
        title: activeConfig.cta.title,
        onPress: activeConfig.cta.onPress,
        variant: activeConfig.cta.variant,
        style: activeConfig.cta.style,
        textStyle: {
          ...activeConfig.cta.textStyle,
          fontFamily: Fonts.bold,
          fontSize: 14,
        },
      }}
      topSpacerSize={activeConfig.topSpacerSize}
    >
      <View style={GeneralStyles.wrapper}>
        <activeConfig.content />
      </View>
    </Template>
  );
};

// ─── CreateAlert ─────────────────────────────────────────────────────────────

type CreateAlertProps = {
  asset: string;
  submitRef: React.MutableRefObject<() => void>;
  onSuccess: (alert: CreatedPriceAlert | UpdatedPriceAlert) => void;
  onSubmittingChange: (isSubmitting: boolean) => void;
  alertToEdit?: CreatedPriceAlert | null;
  alertId?: string;
  alertAction?: AlertAction;
};

const CreateAlert = ({
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

  const [updatePriceAlert, { isLoading: isUpdating }] =
    useUpdatePriceAlertMutation();

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
            isActive: alertToEdit?.isActive ?? true,
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
    } catch (err: unknown) {
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
  }, [isLoading]);

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
      value: `${asset.toUpperCase()} ${activeDirection.toLowerCase()} $${formatAmount(parseFloat(amount)) || "—"}`,
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
        style={{
          ...GeneralStyles.box,
          height: 92,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <CryptoIcon symbol={asset} size={42} />
          <TextBlock title={asset.toUpperCase()} body={coinInfo?.name} />
        </View>
        <ThemedText size={14} color={Colors.snowGray} weight="bold">
          ${formatAmount(coinInfo?.priceUsd ?? 0)}
        </ThemedText>
      </View>

      <Spacer size={46} />

      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {tabs.map((item) => (
          <TouchableOpacity
            key={item.title}
            onPress={() => setActiveDirection(item.title)}
            style={[
              GeneralStyles.box,
              {
                borderRadius: 18,
                backgroundColor:
                  activeDirection === item.title
                    ? item.bgColor
                    : Colors.surfaceNavy,
                width: 80,
                height: 36,
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
        style={{
          ...GeneralStyles.box,
          height: 92,
          paddingHorizontal: 16,
          paddingVertical: 16,
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <View
          style={{ justifyContent: "space-between", gap: 12, height: "100%" }}
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
              fontSize: 26,
              fontFamily: Fonts.bold,
              color: Colors.snowGray,
              padding: 0,
              maxWidth: 300,
            }}
          />
        </View>
        <ThemedText size={12} color={Colors.textMidGray} weight="bold">
          USD
        </ThemedText>
      </View>

      <Spacer size={44} />

      <View style={{ gap: 10 }}>
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

// ─── Success ─────────────────────────────────────────────────────────────────

type SuccessProps = {
  alert: CreatedPriceAlert | null;
};

const Success = ({ alert }: SuccessProps) => {
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
        title={`${alert?.assetSymbol ?? "Asset"} ${alert?.direction?.toLowerCase() ?? ""} $${formatAmount(alert?.targetPriceUsd ?? 0)}`}
        desc="This alert appears in Profile → Price Alerts and can be edited or deleted."
        outerColor={Colors.primaryClean}
        innerColor={Colors.primaryClean}
        IconComponent={
          <FontAwesome5 name="check" size={42} color={Colors.backgroundInk} />
        }
      />
      <Spacer size={56} />
      <View style={{ gap: 10 }}>
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

export default AlertScreen;
