import TextBlock from "@/shared/components/TextBlock";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { timeAgo } from "@/helpers/functions";
import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import {
  useDeleteDeviceMutation,
  useGetDevicesQuery,
} from "@/store/services/devicesApi";
import { Device } from "@/types/devices";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Derives display-friendly fields from the raw API Device shape
const toDisplayDevice = (device: Device, mostRecentId: string) => ({
  ...device,
  name: `${device.platform === "ios" ? "iOS" : "Android"} device`,
  details: `${device.platform === "ios" ? "iOS" : "Android"} ·  Last seen ${timeAgo(device.lastSeenAt)} · Push enabled`,
  status: device.id === mostRecentId ? "Current" : null,
  isActive: device.id === mostRecentId,
});

const FOOTER_CONFIG = {
  title: "No unknown devices",
  body: "New device alerts appear here after sign in from another device.",
};

// ─── Generic Reusable Modal ──────────────────────────────────────────────────
type ConfirmModalProps = {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  actionLoading?: boolean;
  isDestructive?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
};

const ConfirmModal = ({
  visible,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  actionLoading = false,
  isDestructive = true,
  onConfirm,
  onDismiss,
}: ConfirmModalProps) => (
  <Modal
    transparent
    animationType="fade"
    visible={visible}
    onRequestClose={onDismiss}
  >
    <Pressable style={styles.modalOverlay} onPress={onDismiss}>
      <Pressable
        style={styles.modalContent}
        onPress={(e) => e.stopPropagation()}
      >
        <ThemedText size={18} weight="bold" color={Colors.white}>
          {title}
        </ThemedText>
        <ThemedText size={14} color={Colors.textSecondary}>
          {body}
        </ThemedText>
        <View style={styles.modalActions}>
          <ThemedButton
            title={cancelLabel}
            variant="secondary"
            style={styles.modalButton}
            onPress={onDismiss}
            textStyle={{ fontSize: 16, fontFamily: Fonts.medium }}
          />
          <ThemedButton
            title={confirmLabel}
            variant="primary"
            style={[
              styles.modalButton,
              isDestructive && { backgroundColor: Colors.loss },
            ]}
            textStyle={{
              color: Colors.surfaceNavy,
              fontSize: 16,
              fontFamily: Fonts.medium,
            }}
            onPress={onConfirm}
            iconComponent={
              actionLoading ? (
                <ActivityIndicator
                  color={isDestructive ? Colors.lossAlt : Colors.surfaceNavy}
                />
              ) : undefined
            }
          />
        </View>
      </Pressable>
    </Pressable>
  </Modal>
);

// ─── Components ─────────────────────────────────────────────────────────────
type DisplayDevice = ReturnType<typeof toDisplayDevice>;

type DeviceItemProps = {
  item: DisplayDevice;
  onDeleteRequest: (device: DisplayDevice) => void;
};

const DeviceItem = ({ item, onDeleteRequest }: DeviceItemProps) => (
  <Pressable
    style={({ pressed }) => [
      GeneralStyles.box,
      styles.deviceRow,
      pressed && { opacity: 0.8 },
    ]}
    onLongPress={() => onDeleteRequest(item)}
    delayLongPress={1000}
  >
    <View style={styles.iconCircle}>
      {item.platform === "android" ? (
        <FontAwesome name="android" size={24} color={Colors.backgroundInk} />
      ) : (
        <FontAwesome name="apple" size={24} color={Colors.backgroundInk} />
      )}
    </View>
    <View style={styles.textContainer}>
      <ThemedText weight="bold" size={15} color={Colors.white}>
        {item.name}
      </ThemedText>
      <ThemedText size={13} color={Colors.textMidGray}>
        {item.details}
      </ThemedText>
    </View>

    {item.status && (
      <ThemedText
        weight="medium"
        size={13}
        color={item.isActive ? Colors.primaryClean : Colors.textMidGray}
      >
        {item.status}
      </ThemedText>
    )}
  </Pressable>
);

// ─── Main Screen ────────────────────────────────────────────────────────────
const DevicesScreen = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = useSafeBottom();

  const { data, isLoading } = useGetDevicesQuery();
  const [deleteDevice, { isLoading: isDeleting }] = useDeleteDeviceMutation();

  const [deviceToDelete, setDeviceToDelete] = useState<DisplayDevice | null>(
    null,
  );

  // Most recently seen device is treated as "Current"
  const devices = React.useMemo(() => {
    if (!data?.data?.length) return [];
    const sorted = [...data.data].sort(
      (a, b) =>
        new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime(),
    );
    const mostRecentId = sorted[0].id;
    return sorted.map((d) => toDisplayDevice(d, mostRecentId));
  }, [data]);

  const handleConfirmDelete = async () => {
    if (!deviceToDelete) return;

    try {
      await deleteDevice(deviceToDelete.id).unwrap();
      showSuccessToast({
        title: "Device Removed",
        message: `${deviceToDelete.name} has been signed out.`,
      });
    } catch {
      showErrorToast({
        title: "Failed to remove",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setDeviceToDelete(null);
    }
  };

  const ListHeader = (
    <View style={{ marginBottom: 24 }}>
      <TextBlock
        title="Devices"
        body="Registered devices for push notification and session awareness. Long-press a device to remove it."
      />
    </View>
  );

  const ListFooter = (
    <View style={[GeneralStyles.box, styles.infoCard]}>
      <ThemedText weight="bold" size={16} color={Colors.white}>
        {FOOTER_CONFIG.title}
      </ThemedText>
      <ThemedText
        size={14}
        color={Colors.textMidGray}
        style={{ lineHeight: 20 }}
      >
        {FOOTER_CONFIG.body}
      </ThemedText>
    </View>
  );

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[GeneralStyles.container]}
    >
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          GeneralStyles.wrapper,
          { paddingBottom: bottomPadding + 86, paddingTop: insets.top + 24 },
        ]}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        renderItem={({ item }) => (
          <DeviceItem item={item} onDeleteRequest={setDeviceToDelete} />
        )}
        refreshing={isLoading}
      />

      <ConfirmModal
        visible={!!deviceToDelete}
        title="Remove Device"
        body={`Are you sure you want to remove ${deviceToDelete?.name}? It will be signed out immediately.`}
        confirmLabel="Remove"
        actionLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onDismiss={() => setDeviceToDelete(null)}
      />
    </ImageBackground>
  );
};

export default DevicesScreen;

const styles = StyleSheet.create({
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    gap: 16,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryClean,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    gap: 4,
    justifyContent: "center",
  },
  infoCard: {
    padding: 24,
    gap: 12,
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.surfaceNavy,
    borderRadius: 16,
    padding: 24,
    width: "85%",
    gap: 12,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    height: 44,
  },
});
