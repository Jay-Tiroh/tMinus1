import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import React, { useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";

type OTPInputProps = {
  length?: number;
  onComplete?: (code: string) => void;
  onChange?: (code: string) => void;
};

export function OTPInput({ length = 4, onComplete, onChange }: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const updateValues = (next: string[]) => {
    setValues(next);
    const code = next.join("");
    onChange?.(code);
    if (code.length === length) {
      onComplete?.(code);
    }
  };

  const handleChangeText = (text: string, index: number) => {
    // Handle paste: if text length > 1, distribute across fields
    if (text.length > 1) {
      const digits = text.replace(/\D/g, "").slice(0, length).split("");
      const next = [...values];
      digits.forEach((d, i) => {
        if (index + i < length) next[index + i] = d;
      });
      updateValues(next);
      // Focus last filled or end
      const lastIndex = Math.min(index + digits.length - 1, length - 1);
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    // Single character input
    const digit = text.replace(/\D/g, "").slice(-1); // only digits, take last
    const next = [...values];
    next[index] = digit;
    updateValues(next);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      if (values[index]) {
        // Clear current field
        const next = [...values];
        next[index] = "";
        updateValues(next);
      } else if (index > 0) {
        // Move back and clear previous
        const next = [...values];
        next[index - 1] = "";
        updateValues(next);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={styles.row}>
      {Array(length)
        .fill(null)
        .map((_, i) => (
          <TextInput
            key={i}
            ref={(ref) => {
              inputRefs.current[i] = ref;
            }}
            style={[styles.cell, focusedIndex === i && styles.cellFocused]}
            value={values[i]}
            onChangeText={(text) => handleChangeText(text, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            onFocus={() => setFocusedIndex(i)}
            onBlur={() => setFocusedIndex(null)}
            keyboardType="number-pad"
            maxLength={length} // allows paste of full OTP into first cell
            textAlign="center"
            caretHidden
            selectTextOnFocus
            cursorColor={Colors.primary}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 34,
    width: "100%",
    justifyContent: "space-between",
    maxWidth: 342,
    alignSelf: "center",
  },
  cell: {
    height: 54,
    width: 60,
    borderRadius: 12,
    backgroundColor: Colors.surfaceCard,
    fontSize: 32,
    lineHeight: 34, 
    color: Colors.white,
    borderWidth: 1.5,
    borderColor: "transparent",
    fontFamily: Fonts.bold,
    textAlign: "center",
    textAlignVertical: "center", // Android vertical centering
    paddingVertical: 0, // kill default Android input padding
    paddingHorizontal: 0,
    includeFontPadding: false, // removes Android's extra font spacing
  },
  cellFocused: {
    borderColor: Colors.primaryForest,
    borderWidth: 1.5,
  },
});
