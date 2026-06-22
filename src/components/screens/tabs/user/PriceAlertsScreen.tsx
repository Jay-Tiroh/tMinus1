// import { ListItem } from "@/components/screens/user/ProfileScreen";
import { ListItem } from "@/components/screens/tabs/user/ProfileScreen";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount, timeAgo } from "@/helpers/functions";
import { showErrorToast } from "@/hooks/showToast";
import { useAssetRoute } from "@/hooks/useAssetRoute";
import {
  useDeletePriceAlertMutation,
  useGetPriceAlertsQuery,
} from "@/store/services/priceAlertsApi";
import { RTKErrorResponse } from "@/types/utility";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

const PriceAlertsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetPriceAlertsQuery();
  const alertsData = data?.data ?? [];
  const [deletePriceAlert, { isError: isDeleteError }] =
    useDeletePriceAlertMutation();

  const handleLongPressAlert = (alertId: string) => {
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

  const handlePressAlert = (alertId: string, asset: string) => {
    push("alert", {
      alertAction: "edit",
      asset: asset,
      alertId: alertId,
    });
  };
  const { push } = useAssetRoute();

  return (
    <>
      <Template
        textBlockProps={{
          title: "Price alerts",
          body: "View, edit, or delete market alerts. ",
        }}
        ctaProps={undefined}
        topSpacerSize={32}
      >
        <View style={GeneralStyles.wrapper}>
          {/*<ThemedButton
            title="Create alert"
            variant="primary"
            style={{ marginBottom: 24 }}
          />*/}

          <View style={{ gap: 12 }}>
            {alertsData.map((item, index) => (
              <ListItem
                key={index}
                title={
                  item.assetSymbol +
                  " " +
                  item.direction +
                  " $" +
                  formatAmount(item.targetPriceUsd)
                }
                subtitle={
                  item.isActive
                    ? "Active • push notification on"
                    : "Triggered " + timeAgo(item.triggeredAt as string)
                }
                trailingText={item.isActive ? "Active" : "Triggered"}
                trailingTextColor={!item.isActive ? Colors.loss : undefined}
                iconColor={item.isActive ? Colors.primaryClean : Colors.loss}
                onLongPress={() => handleLongPressAlert(item.id)}
                onPress={() => handlePressAlert(item.id, item.assetSymbol)}
              />
            ))}
          </View>
        </View>
      </Template>

      {/* Delete Alert Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <ThemedText size={18} weight="bold" color={Colors.white}>
              Delete alert?
            </ThemedText>
            <ThemedText size={14} color={Colors.textMidGray}>
              This removes the BTC above $72,000 alert from your list.
            </ThemedText>
            <View style={styles.actions}>
              <ThemedButton
                title="Cancel"
                variant="secondary"
                style={styles.button}
                textStyle={{ fontSize: 16, fontFamily: Fonts.medium }}
                onPress={() => setModalVisible(false)}
              />
              <ThemedButton
                title="Delete"
                variant="red"
                style={styles.button}
                textStyle={{
                  fontSize: 16,
                  fontFamily: Fonts.medium,
                  color: Colors.white,
                }}
                onPress={() => handleDeleteAlert(selectedAlertId as string)}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: Colors.surfaceNavy,
    borderRadius: 16,
    padding: 24,
    width: "85%",
    gap: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    height: 44,
  },
});

export default PriceAlertsScreen;
