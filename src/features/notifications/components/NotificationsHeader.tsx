import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import { NOTIFICATIONS_CONFIG } from "../constants/notifications.constants";

type NotificationsHeaderProps = {
  selectMode: boolean;
  isDisabled: boolean;
  onMarkAction: () => void;
};

export const NotificationsHeader = ({
  selectMode,
  isDisabled,
  onMarkAction,
}: NotificationsHeaderProps) => {
  return (
    <View style={styles.container}>
      <TextBlock
        title={NOTIFICATIONS_CONFIG.headerTitle}
        body={NOTIFICATIONS_CONFIG.headerBody}
      />
      <ThemedButton
        title={
          selectMode
            ? NOTIFICATIONS_CONFIG.markSelectedText
            : NOTIFICATIONS_CONFIG.markAllText
        }
        variant="default"
        style={styles.markAllButton}
        textStyle={styles.markAllButtonText}
        onPress={onMarkAction}
        disabled={isDisabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
    marginBottom: 24,
  },
  markAllButton: {
    backgroundColor: Colors.surfaceNavy,
    borderWidth: 0,
    height: 56,
  },
  markAllButtonText: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: "600",
  },
});
