import { ListItem } from "@/components/screens/tabs/user/ProfileScreen";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useAssetRoute } from "@/features/trades/hooks/useAssetRoute";
import { formatAmount, timeAgo } from "@/helpers/functions";
import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";
import ErrorState from "@/shared//components/ErrorComponent";
import Loader from "@/shared/components/Loader";
import Template from "@/shared/components/Template";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import {
  useDeletePriceAlertMutation,
  useGetPriceAlertsQuery,
  useUpdatePriceAlertMutation,
} from "@/store/services/priceAlertsApi";
import { RTKErrorResponse } from "@/types/utility";
import { getErrorMessage } from "@/utils/errors";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const ACTION_WIDTH = 100;

const SwipeableAlertItem = ({
  item,
  index,
  isOpen,
  onOpen,
  onClose,
  onPressDelete,
  onPressEdit,
  onLongPress,
}: {
  item: any;
  index: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPressDelete: (id: string) => void;
  onPressEdit: (id: string, symbol: string) => void;
  onLongPress?: () => void;
}) => {
  const translateX = useSharedValue(0);

  // React to parent-controlled isOpen
  useEffect(() => {
    translateX.value = withSpring(isOpen ? ACTION_WIDTH : 0, {
      damping: 100,
      stiffness: 2000,
    });
  }, [isOpen, translateX]);

  const toggle = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      const base = isOpen ? ACTION_WIDTH : 0;
      const next = base + e.translationX;
      translateX.value = Math.max(0, Math.min(ACTION_WIDTH, next));
    })
    .onEnd((e) => {
      const threshold = ACTION_WIDTH / 2;
      if (
        e.translationX > threshold ||
        (isOpen && e.translationX > -threshold)
      ) {
        runOnJS(onOpen)();
      } else {
        runOnJS(onClose)();
      }
    });

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(toggle)();
  });

  const longPress = Gesture.LongPress().onStart(() => {
    if (onLongPress) {
      runOnJS(onLongPress)();
    }
  });

  const gesture = Gesture.Race(pan, Gesture.Exclusive(tap, longPress));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={{
        ...GeneralStyles.box,
        width: "100%",
        overflow: "hidden",
        backgroundColor: Colors.surfaceNavy + "50",
        position: "relative",
      }}
    >
      {/* Actions sit behind, left-anchored */}
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: ACTION_WIDTH,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          paddingHorizontal: 8,
        }}
      >
        <TouchableOpacity onPress={() => onPressDelete(item.id)}>
          <Ionicons name="trash-outline" size={24} color={Colors.loss} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPressEdit(item.id, item.assetSymbol)}
        >
          <Feather name="edit-3" size={24} color={Colors.info} />
        </TouchableOpacity>
      </View>

      {/* Foreground row slides right */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[{ width: "100%" }, animatedStyle]}>
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
            trailingText={item.isActive ? "On" : "Off"}
            trailingTextColor={!item.isActive ? Colors.loss : undefined}
            iconColor={item.isActive ? Colors.primaryClean : Colors.loss}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const PriceAlertsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);
  const { data, isLoading, isError, refetch } = useGetPriceAlertsQuery();
  const alertsData = data?.data ?? [];
  const [deletePriceAlert] = useDeletePriceAlertMutation();

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

  const [updatePriceAlert] = useUpdatePriceAlertMutation();
  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      await updatePriceAlert({
        alertId: alertId,
        data: {
          isActive: !isActive,
        },
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
      asset: asset,
      alertId: alertId,
    });
  };

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
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorState onRetry={refetch} isLoading={isLoading} />
        ) : (
          <View style={GeneralStyles.wrapper}>
            <View style={{ gap: 12, width: "100%" }}>
              {alertsData.map((item, index) => (
                <SwipeableAlertItem
                  key={item.id}
                  item={item}
                  index={index}
                  isOpen={activeAlertId === item.id}
                  onOpen={() => setActiveAlertId(item.id)}
                  onClose={() => setActiveAlertId(null)}
                  onPressDelete={handlePressDelete}
                  onPressEdit={handlePressAlert}
                  onLongPress={() => handleToggleAlert(item.id, item.isActive)}
                />
              ))}
            </View>
          </View>
        )}
      </Template>

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
              This removes the alert from your list.
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
