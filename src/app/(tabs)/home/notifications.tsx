import Filter from "@/assets/icons/home/notifications/filter.svg";
import Illustration from "@/assets/icons/home/notifications/illustration.svg";
import Notification from "@/components/home/Notification";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useNotificationsQuery } from "@/store/services/notificationsApi";
import React, { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native";

const Notifications = () => {
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

  const { data: notifications, isLoading } = useNotificationsQuery();

  const empty = false;
  console.log(notifications, isLoading);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText weight="bold" size={18} color={Colors.white}>
          Notifications
        </ThemedText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <ThemedText weight="regular" size={14} color={Colors.textMuted}>
            Mark All Read
          </ThemedText>

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
          flex: 1,
        }}
        style={{ width: "100%", flex: 1 }}
        renderItem={({ item, index }) => <Notification notification={item} />}
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

      {empty && (
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
      )}
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
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
