import TextBlock from "@/components/TextBlock";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import React from "react";
import { FlatList, ImageBackground, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Config ─────────────────────────────────────────────────────────────────
// Single source of truth. Ready to be swapped with an API response.
const DEVICES_CONFIG = [
  {
    id: "device-1",
    name: "iPhone 15 Pro",
    details: "iOS · Push enabled",
    status: "Current",
    isActive: true,
  },
  {
    id: "device-2",
    name: "Chrome browser",
    details: "Web · Last seen today",
    status: "Active",
    isActive: true,
  },
  {
    id: "device-3",
    name: "Expo Go",
    details: "Android · Last seen yesterday",
    status: null,
    isActive: false,
  },
];

const FOOTER_CONFIG = {
  title: "No unknown devices",
  body: "New device alerts appear here after sign in from another device.",
};

// ─── Components ─────────────────────────────────────────────────────────────
const DeviceItem = ({ item }: { item: (typeof DEVICES_CONFIG)[0] }) => (
  <View style={[GeneralStyles.box, styles.deviceRow]}>
    <View style={styles.iconCircle} />
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
  </View>
);

// ─── Main Screen ────────────────────────────────────────────────────────────
const DevicesScreen = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = useSafeBottom();

  const ListHeader = (
    <View style={{ marginBottom: 24 }}>
      <TextBlock
        title="Devices"
        body="Registered devices for push notification and session awareness."
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
      style={[GeneralStyles.container, { paddingTop: insets.top + 24 }]}
    >
      <FlatList
        data={DEVICES_CONFIG}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          GeneralStyles.wrapper,
          { paddingBottom: bottomPadding + 86 },
        ]}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        renderItem={({ item }) => <DeviceItem item={item} />}
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
