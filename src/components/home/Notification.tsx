import Ellipse from "@/assets/icons/home/notifications/ellipse.svg";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { Notification } from "@/types/notification";
import { s, vs } from "@/utils/responsive";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

type NotificationItemProps = {
  notification: Notification;
  onPress: () => void;
  onLongPress: () => void;
  isSelected?: boolean;
};

const NotificationItem = ({
  notification,
  onPress,
  onLongPress,
  isSelected = false,
}: NotificationItemProps) => {
  const colorMap = {
    withdrawal: Colors.primary,
    deposit: Colors.warningGold,
    kyc: Colors.info,
    trade: Colors.profit,
    system: Colors.infoPurple,
    auth: Colors.loss,
  } as const;

  return (
    <Pressable
      style={[
        GeneralStyles.wrapper,
        styles.container,
        isSelected && { backgroundColor: Colors.infoBright + "0D" },
      ]}
      onLongPress={onLongPress}
      onPress={onPress}
    >
      <View style={styles.notificationTitleBlock}>
        <ThemedText color={Colors.textFaint} weight="medium" size={14}>
          {notification.title}
        </ThemedText>
        <Ellipse color={colorMap[notification.type]} />
      </View>
      <ThemedText
        color={notification.isRead ? Colors.textMuted : Colors.textSecondary}
        size={14}
        style={styles.details}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {notification.body}
      </ThemedText>
    </Pressable>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    gap: vs(4),
    height: vs(84),
    borderBottomWidth: 1,
    borderBottomColor: Colors.white + "08",
    // alignItems: "center",
  },
  notificationTitleBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(6),
  },
  details: {
    flexShrink: 1,
  },
});
