import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

export type ConfirmModalProps = {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  actionLoading?: boolean;
  isDestructive?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  actionLoading = false,
  isDestructive = true,
  onConfirm,
  onDismiss,
}) => (
  <Modal
    transparent
    animationType="fade"
    visible={visible}
    onRequestClose={onDismiss}
  >
    <Pressable style={styles.modalOverlay} onPress={onDismiss}>
      <Pressable
        style={styles.modalContent}
        onPress={(e) => e.stopPropagation()}
      >
        <ThemedText size={18} weight="bold" color={Colors.white}>
          {title}
        </ThemedText>
        <ThemedText size={14} color={Colors.textSecondary}>
          {body}
        </ThemedText>
        <View style={styles.modalActions}>
          <ThemedButton
            title={cancelLabel}
            variant="secondary"
            style={styles.modalButton}
            onPress={onDismiss}
            textStyle={{ fontSize: 16, fontFamily: Fonts.medium }}
          />
          <ThemedButton
            title={confirmLabel}
            variant={isDestructive ? "red" : "primary"}
            style={[
              styles.modalButton,
              isDestructive && { backgroundColor: Colors.loss },
            ]}
            textStyle={{
              color: isDestructive ? Colors.white : Colors.surfaceNavy,
              fontSize: 16,
              fontFamily: Fonts.medium,
            }}
            onPress={onConfirm}
            iconComponent={
              actionLoading ? (
                <ActivityIndicator
                  color={isDestructive ? Colors.lossAlt : Colors.surfaceNavy}
                />
              ) : undefined
            }
          />
        </View>
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.surfaceNavy,
    borderRadius: 16,
    padding: 24,
    width: "85%",
    gap: 12,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    height: 44,
  },
});
