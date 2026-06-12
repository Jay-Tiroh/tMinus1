import Filter from "@/assets/icons/home/notifications/filter.svg";
import Illustration from "@/assets/icons/home/notifications/illustration.svg";
import Notification from "@/components/home/Notification";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/store/services/notificationsApi";
import React, { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native";

const NotificationsScreen = () => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState("All");

  const options = [
    "All",
    "KYC",
    "Deposit",
    "Withdrawal",
    "Trade",
    "System",
    "Auth",
  ];

  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    [],
  );
  const [selectMode, setSelectMode] = useState(false);

  const { data: notifications, isLoading } = useNotificationsQuery();
  const [
    markAsRead,
    { isLoading: isMarkingAsRead, isError: isMarkingAsReadError },
  ] = useMarkNotificationReadMutation();
  const [
    markAllRead,
    { isLoading: isMarkingAllRead, isError: isMarkingAllReadError },
  ] = useMarkAllNotificationsReadMutation();

  // console.log(notifications, isLoading);

  const handleLongPress = (id: string) => {
    setSelectMode(true);
    setSelectedNotifications((prev) => [...prev, id]);
  };
  const handlePress = (id: string) => {
    if (selectMode) {
      if (selectedNotifications.includes(id)) {
        setSelectedNotifications((prev) => prev.filter((nid) => nid !== id));
      } else {
        setSelectedNotifications((prev) => [...prev, id]);
      }
    }
  };

  const isSelected = (id: string) => selectedNotifications.includes(id);

  const handleMarkRead = () => {
    if (selectMode) {
      selectedNotifications.forEach((id) => {
        markAsRead(id);
        console.log("id: ", id);
      });
      setSelectedNotifications([]);
    } else {
      markAllRead();
    }
  };

  const sortNotifications = (sortParam: string) => {};

  useEffect(() => {
    if (selectedNotifications.length === 0) {
      setSelectMode(false);
    }
  }, [selectedNotifications]);

  return (
    <View style={styles.container}>
      <View style={[GeneralStyles.wrapper, styles.header]}>
        <ThemedText weight="bold" size={18} color={Colors.white}>
          Notifications
        </ThemedText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <Pressable onPress={handleMarkRead} hitSlop={20}>
            <ThemedText weight="regular" size={14} color={Colors.textMuted}>
              Mark {selectMode ? "As" : "All"} Read
            </ThemedText>
          </Pressable>

          <Pressable onPress={() => setVisible(true)} hitSlop={20}>
            <Filter />
          </Pressable>
        </View>
        <Modal visible={visible} transparent animationType="slide">
          <Pressable
            style={[styles.modal, { flex: 1 }]}
            onPress={() => setVisible(false)}
          >
            <View style={styles.dropdown}>
              {options.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => {
                    setSelected(opt);
                    setVisible(false);
                  }}
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        opt === selected ? Colors.white + "1A" : undefined,
                    },
                  ]}
                >
                  <ThemedText
                    color={opt === selected ? Colors.primary : Colors.offWhite}
                  >
                    {opt}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      </View>

      <Spacer size={24} />
      <FlatList
        data={notifications?.data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          width: "100%",
          borderTopWidth: 1,
          borderTopColor: Colors.white + "08",
          // flex: 1,
        }}
        style={{ width: "100%", flex: 1 }}
        renderItem={({ item, index }) => (
          <Notification
            onLongPress={() => handleLongPress(item.id)}
            onPress={() => handlePress(item.id)}
            notification={item}
            isSelected={isSelected(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              width: "100%",
              marginTop: 16,
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Illustration />
            <ThemedText weight="bold" size={14} color={Colors.white}>
              You have no notifications
            </ThemedText>
          </View>
        }
      />
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  dropdown: {},
  option: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.offWhite + "05",
  },
  modal: {
    position: "absolute",
    top: 200,
    right: 24,
    borderRadius: 8,
    backgroundColor: Colors.surfaceAlt,
    width: 120,
    overflow: "hidden",
  },
});
