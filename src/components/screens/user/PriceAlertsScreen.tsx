import { ListItem } from "@/components/screens/user/ProfileScreen";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

const PriceAlertsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const alerts = [
    {
      title: "BTC above $72,000",
      subtitle: "Active • push notification on",
      status: "On",
      color: Colors.primaryClean,
    },
    {
      title: "ETH below $2,900",
      subtitle: "Paused",
      status: "Off",
      color: Colors.loss,
    },
    {
      title: "SOL above $170",
      subtitle: "Triggered today",
      status: "Read",
      color: Colors.primaryClean,
    },
  ];

  return (
    <>
      <Template
        textBlockProps={{
          title: "Price alerts",
          body: "Create, edit, pause, or delete market alerts.",
        }}
        ctaProps={undefined}
        topSpacerSize={32}
      >
        <View style={GeneralStyles.wrapper}>
          <ThemedButton
            title="Create alert"
            variant="primary"
            style={{ marginBottom: 24 }}
          />

          <View style={{ gap: 12 }}>
            {alerts.map((item, index) => (
              <ListItem
                key={index}
                title={item.title}
                subtitle={item.subtitle}
                trailingText={item.status}
                iconColor={item.color}
                onPress={() => index === 0 && setModalVisible(true)} // Example: Tap first to delete
              />
            ))}
          </View>
        </View>
      </Template>

      {/* Delete Alert Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <ThemedText size={18} weight="bold" color={Colors.white}>
              Delete alert?
            </ThemedText>
            <ThemedText size={14} color={Colors.textMidGray}>
              This removes the BTC above $72,000 alert from your list.
            </ThemedText>
            <View style={styles.actions}>
              <ThemedButton
                title="Cancel"
                variant="secondary"
                style={styles.button}
                textStyle={{ fontSize: 16, fontFamily: Fonts.medium }}
                onPress={() => setModalVisible(false)}
              />
              <ThemedButton
                title="Delete"
                variant="red"
                style={styles.button}
                textStyle={{
                  fontSize: 16,
                  fontFamily: Fonts.medium,
                  color: Colors.white,
                }}
                onPress={() => setModalVisible(false)}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: Colors.surfaceNavy,
    borderRadius: 16,
    padding: 24,
    width: "85%",
    gap: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    height: 44,
  },
});

export default PriceAlertsScreen;
