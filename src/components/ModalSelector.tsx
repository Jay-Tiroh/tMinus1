import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type ModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  options: string[] | undefined;
  value: string | boolean;
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
    <Modal visible={visible} transparent animationType="fade">
      {/* Full-screen backdrop to dismiss on outside tap */}
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={styles.backdrop}>
          {/* Stop tap propagation so tapping the dropdown itself doesn't close it */}
          <TouchableWithoutFeedback>
            <View style={styles.dropdown}>
              {options?.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => handleSelect(opt)}
                  style={[
                    styles.option,
                    opt === selected && styles.optionSelected,
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
    // Position the dropdown near top-right, matching your original intent
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 200,
    paddingRight: 24,
  },
  dropdown: {
    width: 120,
    borderRadius: 8,
    backgroundColor: Colors.surfaceAlt,
    overflow: "hidden",
  },
  option: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.offWhite + "05",
  },
  optionSelected: {
    backgroundColor: Colors.white + "1A",
  },
});
