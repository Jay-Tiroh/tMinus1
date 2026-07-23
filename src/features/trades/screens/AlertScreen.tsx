import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import {
  CreatedPriceAlert,
  PriceAlert,
  UpdatedPriceAlert,
  useGetPriceAlertsQuery,
} from "@/features/user";
import Template from "@/shared/components/Template";
import { showErrorToast } from "@/shared/hooks/showToast";
import { useGoToRoute } from "@/shared/hooks/useGoToRoute";
import { ms } from "@/shared/utils/responsive";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { ConfigType } from "@/features/trades/screens/QuoteScreen";
import {
  AlertAction,
  AlertSuccess,
  CreateAlert,
} from "../components/AlertBlocks";

export const AlertScreen = () => {
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
  const [createdAlert, setCreatedAlert] = useState<
    CreatedPriceAlert | UpdatedPriceAlert | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleConfig = (alert?: CreatedPriceAlert | UpdatedPriceAlert) => {
    if (alert) setCreatedAlert(alert);
    setActiveConfigIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const { data } = useGetPriceAlertsQuery();

  useFocusEffect(
    useCallback(() => {
      setActiveConfigIndex(0);
      setCreatedAlert(null);
      setIsSubmitting(false);
    }, []),
  );

  const alertsData = data?.data;

  useEffect(() => {
    const alerts = alertsData ?? [];
    if (
      alertAction === "edit" &&
      alertId &&
      alerts.length > 0 &&
      !alertToEdit
    ) {
      const alert = alerts.find((a: PriceAlert) => a.id === alertId);
      if (alert) {
        setAlertToEdit(alert);
      } else {
        showErrorToast({
          title: "Alert not found",
          message: "The alert you are trying to edit does not exist.",
        });
      }
    }
  }, [alertsData, alertId, alertAction, alertToEdit]);

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
      },
      content: (
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
      },
      content: <AlertSuccess alert={createdAlert} />,
      topSpacerSize: 42,
    },
  ];

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
        textStyle: {
          fontFamily: Fonts.bold,
          fontSize: ms(14),
        },
      }}
      topSpacerSize={activeConfig.topSpacerSize}
    >
      <View style={GeneralStyles.wrapper}>{activeConfig.content}</View>
    </Template>
  );
};
