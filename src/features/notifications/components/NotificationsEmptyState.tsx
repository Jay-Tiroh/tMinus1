import { ThemedText } from "@/shared/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import React from "react";
import { StyleSheet, View } from "react-native";
import { NOTIFICATIONS_CONFIG } from "../constants/notifications.constants";

export const NotificationsEmptyState = () => (
  <View style={styles.emptyStateCard}>
    <ThemedText weight="bold" size={16} color={Colors.white}>
      {NOTIFICATIONS_CONFIG.emptyStateTitle}
    </ThemedText>
    <ThemedText size={14} color={Colors.textMidGray} style={{ lineHeight: 20 }}>
      {NOTIFICATIONS_CONFIG.emptyStateBody}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  emptyStateCard: {
    ...GeneralStyles.box,
    padding: 24,
    gap: 12,
    marginTop: 12,
  },
});
