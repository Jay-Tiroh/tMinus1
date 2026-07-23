import { ThemedText } from "@/shared/components/ThemedText";
import { Colors } from "@/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SelectorOption<T = string | number> = {
  label: string;
  value: T;
  description?: string;
  symbol?: string;
};

interface ModalSelectorProps<T> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  data: SelectorOption<T>[];
  selected: T | null;
  setSelected?: (value: T) => void;
  handleSelect?: (value: T) => void; // Added for complex selection logic
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ModalSelector = <T extends string | number>({
  visible,
  onClose,
  title = "Select Option",
  data,
  selected,
  setSelected,
  handleSelect,
}: ModalSelectorProps<T>) => {
  const insets = useSafeAreaInsets();

  const onOptionPress = (value: T) => {
    // Prioritize custom handleSelect if provided, fallback to basic setSelected
    if (handleSelect) {
      handleSelect(value);
    } else if (setSelected) {
      setSelected(value);
    }

    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={[styles.modalContent, { paddingBottom: insets.bottom || 24 }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <ThemedText weight="bold" size={18} color={Colors.snowGray}>
              {title}
            </ThemedText>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={Colors.textMidGray}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={data}
            keyExtractor={(item) => String(item.value)}
            showsVerticalScrollIndicator={false}
            bounces={false}
            renderItem={({ item }) => {
              const isSelected = selected === item.value;

              return (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => onOptionPress(item.value)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionTextContainer}>
                    <ThemedText
                      size={16}
                      color={isSelected ? Colors.primaryClean : Colors.snowGray}
                      weight={isSelected ? "bold" : "regular"}
                    >
                      {item.label}
                    </ThemedText>
                    {item.description && (
                      <ThemedText
                        size={12}
                        color={Colors.textMidGray}
                        style={{ marginTop: 4 }}
                      >
                        {item.description}
                      </ThemedText>
                    )}
                  </View>

                  {isSelected && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color={Colors.primaryClean}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.surfaceNavy,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "65%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceAlt,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceAlt,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
});
