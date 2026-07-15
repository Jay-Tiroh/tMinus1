import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/features/notifications/api/notificationsApi";
import { Notification } from "@/features/notifications/types/notification";
import { logger } from "@/utils/logger";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useNotificationsScreen = () => {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    [],
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: notifications, isLoading, refetch } = useNotificationsQuery();

  const [markAsRead, { isLoading: isMarkingAsRead }] =
    useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAllRead }] =
    useMarkAllNotificationsReadMutation();

  const sortedNotifications = useMemo(
    () =>
      [...(notifications?.data ?? [])].sort(
        (a, b) => Number(a.isRead) - Number(b.isRead),
      ),
    [notifications?.data],
  );

  // Exit select mode if all selections are cleared
  useEffect(() => {
    if (selectedNotifications.length === 0) {
      setSelectMode(false);
    }
  }, [selectedNotifications]);

  const handleLongPress = useCallback((id: string) => {
    setSelectMode(true);
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev : [...prev, id],
    );
  }, []);

  const handlePress = useCallback(
    (item: Notification) => {
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
    },
    [selectMode, markAsRead],
  );

  const handleMarkAction = useCallback(() => {
    if (selectMode && selectedNotifications.length > 0) {
      selectedNotifications.forEach((id) => markAsRead(id));
      setSelectedNotifications([]);
    } else {
      markAllRead();
    }
    logger.log("Notifications data:", notifications);
  }, [
    selectMode,
    selectedNotifications,
    markAsRead,
    markAllRead,
    notifications,
  ]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const isMarkingDisabled =
    isMarkingAllRead ||
    isMarkingAsRead ||
    (!selectMode && !notifications?.data?.length) ||
    (selectMode && selectedNotifications.length === 0);

  return {
    notifications: sortedNotifications,
    isLoading,
    isRefreshing,
    selectMode,
    selectedNotifications,
    isMarkingDisabled,
    handlePress,
    handleLongPress,
    handleMarkAction,
    handleRefresh,
  };
};
