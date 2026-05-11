import Ellipse from "@/assets/icons/home/notifications/ellipse.svg";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Notification } from "@/types/notification";
import React from "react";
import { StyleSheet, View } from "react-native";

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const colorMap = {
    withdrawal: Colors.primary,
    deposit: Colors.warningGold,
    kyc: Colors.info,
    trade: Colors.profit,
    system: Colors.infoPurple,
    auth: Colors.loss,
  } as const;

  return (
    <View style={styles.container}>
      <View style={styles.notificationTitleBlock}>
        <ThemedText color={Colors.textFaint} weight="medium" size={14}>
          {notification.title}
        </ThemedText>
        <Ellipse color={colorMap[notification.type]} />
      </View>
      <ThemedText
        color={notification.isRead ? Colors.textMuted : Colors.textDim}
        size={14}
        style={styles.details}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {notification.body}
      </ThemedText>
    </View>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    gap: 4,
    height: 84,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white + "08",
    // alignItems: "center",
  },
  notificationTitleBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  details: {
    flexShrink: 1,
  },
});
