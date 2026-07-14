import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { timeAgo } from "@/helpers/functions";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/store/services/notificationsApi";
import { Notification } from "@/types/notification";
import { logger } from "@/utils/logger";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Config & Types ─────────────────────────────────────────────────────────

const SCREEN_CONFIG = {
  headerTitle: "Notifications",
  headerBody: "Security, KYC, transaction, and alert messages.",
  markAllText: "Mark all as read",
  markSelectedText: "Mark selected as read",
  emptyStateTitle: "All caught up",
  emptyStateBody:
    "When the list is empty, show this calm state instead of a blank screen.",
};

// ─── Components ─────────────────────────────────────────────────────────────

const NotificationItem = ({
  item,
  isSelected,
  onPress,
  onLongPress,
}: {
  item: Notification;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) => {
  return (
    <Pressable
      style={[
        styles.notificationCard,
        isSelected && { backgroundColor: Colors.surfaceNavy }, // Visual feedback for selection
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
    >
      {/* Indicator Circle */}
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

      {/* Text Content */}
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

      {/* Status Label */}
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

const EmptyStateCard = () => (
  <View style={styles.emptyStateCard}>
    <ThemedText weight="bold" size={16} color={Colors.white}>
      {SCREEN_CONFIG.emptyStateTitle}
    </ThemedText>
    <ThemedText size={14} color={Colors.textMidGray} style={{ lineHeight: 20 }}>
      {SCREEN_CONFIG.emptyStateBody}
    </ThemedText>
  </View>
);

// ─── Main Screen ────────────────────────────────────────────────────────────

const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = useSafeBottom();

  const [selectMode, setSelectMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    [],
  );

  const { data: notifications, isLoading, refetch } = useNotificationsQuery();

  const sortedNotifications = useMemo(
    () =>
      [...(notifications?.data ?? [])].sort(
        (a, b) => Number(a.isRead) - Number(b.isRead),
      ),
    [notifications?.data],
  );

  const [markAsRead, { isLoading: isMarkingAsRead }] =
    useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAllRead }] =
    useMarkAllNotificationsReadMutation();
  // Exit select mode if all selections are cleared
  useEffect(() => {
    if (selectedNotifications.length === 0) {
      setSelectMode(false);
    }
  }, [selectedNotifications]);

  const handleLongPress = (id: string) => {
    setSelectMode(true);
    if (!selectedNotifications.includes(id)) {
      setSelectedNotifications((prev) => [...prev, id]);
    }
  };

  const handlePress = (item: Notification) => {
    if (selectMode) {
      setSelectedNotifications((prev) =>
        prev.includes(item.id)
          ? prev.filter((nid) => nid !== item.id)
          : [...prev, item.id],
      );
    } else {
      if (!item.isRead) {
        markAsRead(item.id)
          .unwrap()
          .then((res) => logger.log("markAsRead success", res))
          .catch((err) => logger.log("markAsRead error", err));
      }
    }
  };

  const handleMarkAction = useCallback(() => {
    if (selectMode && selectedNotifications.length > 0) {
      selectedNotifications.forEach((id) => markAsRead(id));
      setSelectedNotifications([]);
    } else {
      markAllRead();
    }

    logger.log("Notifications data:", notifications);
  }, [selectMode, selectedNotifications, markAsRead, markAllRead, notifications]);

  const ListHeader = useMemo(
    () => (
      <View style={{ gap: 24, marginBottom: 24 }}>
        <TextBlock
          title={SCREEN_CONFIG.headerTitle}
          body={SCREEN_CONFIG.headerBody}
        />
        <ThemedButton
          title={
            selectMode
              ? SCREEN_CONFIG.markSelectedText
              : SCREEN_CONFIG.markAllText
          }
          variant="default"
          style={styles.markAllButton}
          textStyle={{ fontSize: 15, color: Colors.white, fontWeight: "600" }}
          onPress={handleMarkAction}
          disabled={
            isMarkingAllRead ||
            isMarkingAsRead ||
            (!selectMode && !notifications?.data?.length) ||
            (selectMode && selectedNotifications.length === 0)
          }
        />
      </View>
    ),
    [
      selectMode,
      selectedNotifications.length,
      isMarkingAllRead,
      isMarkingAsRead,
      notifications?.data?.length,
      handleMarkAction, // ← added
    ],
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);
  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[{ flex: 1 }]}
    >
      <FlatList
        data={sortedNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          GeneralStyles.wrapper,
          { paddingBottom: bottomPadding + 40, paddingTop: insets.top + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => (
          <NotificationItem
            item={item}
            isSelected={selectedNotifications.includes(item.id)}
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item.id)}
          />
        )}
        ListEmptyComponent={!isLoading ? <EmptyStateCard /> : null}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressBackgroundColor={Colors.backgroundDark}
          />
        }
      />
    </ImageBackground>
  );
};

export default NotificationsScreen;

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  markAllButton: {
    backgroundColor: Colors.surfaceNavy,
    borderWidth: 0,
    height: 56,
  },
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
  emptyStateCard: {
    ...GeneralStyles.box,
    padding: 24,
    gap: 12,
    marginTop: 12,
  },
});
