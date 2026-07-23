import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { Notification } from "@/features/notifications/types/notification";
import { ThemedText } from "@/shared/components/ThemedText";
import { timeAgo } from "@/shared/utils/timeAgo";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

type NotificationItemProps = {
  item: Notification;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

export const NotificationItem = ({
  item,
  isSelected,
  onPress,
  onLongPress,
}: NotificationItemProps) => {
  return (
    <Pressable
      style={[
        styles.notificationCard,
        isSelected && { backgroundColor: Colors.surfaceNavy },
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
    >
      <View
        style={[
          styles.indicator,
          {
            backgroundColor: item.isRead
              ? Colors.surfaceGreenTeal
              : Colors.primaryClean,
          },
        ]}
      />

      <View style={styles.textContainer}>
        <ThemedText weight="bold" size={15} color={Colors.white}>
          {item.title}
        </ThemedText>
        <ThemedText
          size={13}
          color={Colors.textMidGray}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.body}
        </ThemedText>
      </View>

      <View>
        <ThemedText
          size={13}
          weight="medium"
          color={item.isRead ? Colors.primaryPale : Colors.primaryClean}
        >
          {item.isRead ? "Read" : "New"}
        </ThemedText>
        <ThemedText
          size={13}
          weight="medium"
          color={item.isRead ? Colors.textMuted : Colors.textFaint}
        >
          {timeAgo(item.createdAt)}
        </ThemedText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  notificationCard: {
    ...GeneralStyles.box,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    gap: 16,
    height: 72,
  },
  indicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  textContainer: {
    flex: 1,
    gap: 4,
    justifyContent: "center",
  },
});
