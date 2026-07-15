import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import React from "react";
import { FlatList, ImageBackground, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NotificationItem } from "../components/NotificationItem";
import { NotificationsEmptyState } from "../components/NotificationsEmptyState";
import { NotificationsHeader } from "../components/NotificationsHeader";
import { useNotificationsScreen } from "../hooks/useNotificationsScreen";

export const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = useSafeBottom();

  const {
    notifications,
    isLoading,
    isRefreshing,
    selectMode,
    selectedNotifications,
    isMarkingDisabled,
    handlePress,
    handleLongPress,
    handleMarkAction,
    handleRefresh,
  } = useNotificationsScreen();

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={{ flex: 1 }}
    >
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          GeneralStyles.wrapper,
          { paddingBottom: bottomPadding + 40, paddingTop: insets.top + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <NotificationsHeader
            selectMode={selectMode}
            isDisabled={Boolean(isMarkingDisabled)}
            onMarkAction={handleMarkAction}
          />
        }
        renderItem={({ item }) => (
          <NotificationItem
            item={item}
            isSelected={selectedNotifications.includes(item.id)}
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item.id)}
          />
        )}
        ListEmptyComponent={!isLoading ? <NotificationsEmptyState /> : null}
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
