import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  options: string[] | undefined;
  value: string;
  setValue?: (value: string) => void;
};

const ModalSelector = ({
  visible,
  setVisible,
  options,
  value,
  setValue,
}: ModalProps) => {
  const [selected, setSelected] = useState(value);
  const insets = useSafeAreaInsets();

  // Re-sync when value changes externally
  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (opt: string) => {
    setSelected(opt);
    setValue?.(opt); // Notify parent
    setVisible(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      {/* Dimmed backdrop */}
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={styles.backdrop}>
          {/* Stop tap propagation so tapping the sheet doesn't close it */}
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.bottomSheet,
                { paddingBottom: Math.max(insets.bottom, 24) },
              ]}
            >
              {/* Native-looking drag indicator handle */}
              <View style={styles.dragHandle} />

              <View style={styles.optionsContainer}>
                {options?.map((opt, index) => {
                  const isSelected = opt === selected;
                  const isLast = index === options.length - 1;

                  return (
                    <Pressable
                      key={opt}
                      onPress={() => handleSelect(opt)}
                      style={({ pressed }) => [
                        styles.option,
                        !isLast && styles.optionBorder,
                        isSelected && styles.optionSelected,
                        pressed && styles.optionPressed,
                      ]}
                    >
                      <ThemedText
                        size={16} // Slightly larger for bottom sheet touch targets
                        color={isSelected ? Colors.primaryClean : Colors.snowGray}
                        weight={isSelected ? "bold" : "medium"}
                      >
                        {opt}
                      </ThemedText>

                      {isSelected && <View style={styles.selectedIndicator} />}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalSelector;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end", // Pushes the sheet to the bottom
  },
  bottomSheet: {
    ...GeneralStyles.box,
    backgroundColor: Colors.surfaceNavy,
    width: "100%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: Colors.surfaceAlt,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surfaceAlt,
    alignSelf: "center",
    marginBottom: 16,
  },
  optionsContainer: {
    paddingHorizontal: 8, // Gives the options a slightly floated look inside the sheet
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12, // Inner border radius for the pressed states
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceAlt,
    borderRadius: 0, // Remove radius if it's a middle item to keep the border clean
  },
  optionSelected: {
    backgroundColor: Colors.surfaceDark,
  },
  optionPressed: {
    backgroundColor: Colors.surfaceCharcoal,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryClean,
  },
});
