import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedText } from "@/shared/components/ThemedText";
import { useSafeBottom } from "@/shared/hooks/useSafeBottom";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ConfirmModal } from "../components/ConfirmModal";
import { useDevices } from "../hooks/useDevices";
import { DisplayDevice } from "../utils/deviceMappers";

const FOOTER_CONFIG = {
  title: "No unknown devices",
  body: "New device alerts appear here after sign in from another device.",
};

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

const DevicesScreen = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = useSafeBottom();

  const {
    devices,
    isLoading,
    isDeleting,
    deviceToDelete,
    setDeviceToDelete,
    handleConfirmDelete,
  } = useDevices();

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
});
