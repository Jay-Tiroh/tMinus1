import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import ErrorState from "@/shared/components/ErrorComponent";
import Loader from "@/shared/components/Loader";
import Template from "@/shared/components/Template";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { SwipeableAlertItem } from "../components/SwipeableAlertItem";
import { usePriceAlerts } from "../hooks/usePriceAlerts";

const PriceAlertsScreen = () => {
  const {
    alertsData,
    isLoading,
    isError,
    refetch,
    modalVisible,
    setModalVisible,
    selectedAlertId,
    activeAlertId,
    setActiveAlertId,
    handlePressDelete,
    handleDeleteAlert,
    handleToggleAlert,
    handlePressAlert,
  } = usePriceAlerts();

  return (
    <>
      <Template
        textBlockProps={{
          title: "Price alerts",
          body: "View, edit, or delete market alerts. ",
        }}
        ctaProps={undefined}
        topSpacerSize={32}
      >
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorState onRetry={refetch} isLoading={isLoading} />
        ) : (
          <View style={GeneralStyles.wrapper}>
            <View style={{ gap: 12, width: "100%" }}>
              {alertsData.map((item, index) => (
                <SwipeableAlertItem
                  key={item.id}
                  item={item}
                  index={index}
                  isOpen={activeAlertId === item.id}
                  onOpen={() => setActiveAlertId(item.id)}
                  onClose={() => setActiveAlertId(null)}
                  onPressDelete={handlePressDelete}
                  onPressEdit={handlePressAlert}
                  onLongPress={() => handleToggleAlert(item.id, item.isActive)}
                />
              ))}
            </View>
          </View>
        )}
      </Template>

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
              This removes the alert from your list.
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
                onPress={() => handleDeleteAlert(selectedAlertId as string)}
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
