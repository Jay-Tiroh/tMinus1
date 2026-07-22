import { useAssetRoute } from "@/features/trades/hooks/useAssetRoute";
import {
  useDeletePriceAlertMutation,
  useGetPriceAlertsQuery,
  useUpdatePriceAlertMutation,
} from "@/features/user/api/priceAlertsApi";
import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";

import { RTKErrorResponse } from "@/types/utility";
import { getErrorMessage } from "@/utils/errors";
import { useState } from "react";

export const usePriceAlerts = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useGetPriceAlertsQuery();
  const alertsData = data?.data ?? [];

  const [deletePriceAlert] = useDeletePriceAlertMutation();
  const [updatePriceAlert] = useUpdatePriceAlertMutation();
  const { push } = useAssetRoute();

  const handlePressDelete = (alertId: string) => {
    setModalVisible(true);
    setSelectedAlertId(alertId);
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await deletePriceAlert(alertId).unwrap();
      setModalVisible(false);
    } catch (error: unknown) {
      const err = error as RTKErrorResponse;
      showErrorToast({
        title: "Error",
        message: err?.data?.message ?? "Failed to delete alert.",
      });
    }
  };

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      await updatePriceAlert({
        alertId,
        data: { isActive: !isActive },
      }).unwrap();
      showSuccessToast({
        title: "Success",
        message: "Alert toggled successfully.",
      });
    } catch (error: unknown) {
      showErrorToast({
        title: "Error",
        message: getErrorMessage(error, "Failed to update alert."),
      });
    }
  };

  const handlePressAlert = (alertId: string, asset: string) => {
    push("alert", {
      alertAction: "edit",
      asset,
      alertId,
    });
  };

  return {
    alertsData,
    isLoading,
    isError,
    refetch,
    modalVisible,
    setModalVisible,
    selectedAlertId,
    activeAlertId,
    setActiveAlertId,
    handlePressDelete,
    handleDeleteAlert,
    handleToggleAlert,
    handlePressAlert,
  };
};
