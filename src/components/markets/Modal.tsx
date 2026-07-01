import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { ms, s, vs } from "@/utils/responsive";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

type RemoveFromWatchlistModalProps = {
  visible: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
  coinName?: string;
  actionLoading?: boolean;
};

const RemoveFromWatchlistModal = ({
  visible,
  onConfirm,
  onDismiss,
  coinName = "this asset",
  actionLoading = false,
}: RemoveFromWatchlistModalProps) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          <ThemedText size={18} weight="bold" style={styles.title}>
            Remove from Watchlist
          </ThemedText>
          <ThemedText size={14} style={styles.body}>
            Are you sure you want to remove {coinName} from your watchlist?
          </ThemedText>
          <View style={styles.actions}>
            <ThemedButton
              title="Cancel"
              variant="secondary"
              style={styles.button}
              onPress={onDismiss}
              textStyle={{
                fontSize: ms(16),
                fontFamily: Fonts.medium,
              }}
            />
            <ThemedButton
              title="Remove"
              variant="primary"
              style={[styles.button, styles.removeButton]}
              textStyle={{
                color: Colors.surfaceNavy,
                fontSize: ms(16),
                fontFamily: Fonts.medium,
              }}
              onPress={onConfirm}
              iconComponent={
                actionLoading ? (
                  <ActivityIndicator color={Colors.lossAlt} />
                ) : undefined
              }
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default RemoveFromWatchlistModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: Colors.surfaceNavy,
    borderRadius: ms(16),
    padding: ms(24),
    width: "85%",
    gap: vs(12),
  },
  title: {
    color: Colors.white,
  },
  body: {
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: "row",
    gap: s(12),
    marginTop: vs(8),
  },
  button: {
    flex: 1,
    height: vs(44),
  },
  removeButton: {
    backgroundColor: Colors.loss,
  },
});
