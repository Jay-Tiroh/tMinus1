import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import React, { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

const PIN_LENGTH = 4;

type TransactionPinInputProps = {
  onComplete: (pin: string) => void;
};

export default function TransactionPinInput({
  onComplete,
}: TransactionPinInputProps) {
  const inputRef = useRef<TextInput>(null);
  const pinRef = useRef("");
  const [inputValue, setInputValue] = useState("");

  // refs for each box and dot so we can imperatively style them
  const boxRefs = useRef<(View | null)[]>([]);
  const dotRefs = useRef<(View | null)[]>([]);

  const updateBoxes = useCallback((pin: string) => {
    for (let i = 0; i < PIN_LENGTH; i++) {
      const filled = i < pin.length;
      const active = i === pin.length;

      boxRefs.current[i]?.setNativeProps({
        style: {
          borderWidth: active ? 1 : 0,
          borderColor: active ? Colors.primaryClean : "transparent",
        },
      });

      dotRefs.current[i]?.setNativeProps({
        style: { display: filled ? "flex" : "none" },
      });
    }
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      const sanitized = value.replace(/\D/g, "").slice(0, PIN_LENGTH);
      pinRef.current = sanitized;
      setInputValue(sanitized); // minimal state — only drives TextInput value
      updateBoxes(sanitized);
      if (sanitized.length === PIN_LENGTH) {
        onComplete(sanitized);
      }
    },
    [onComplete, updateBoxes],
  );

  return (
    <Pressable
      onPress={() => {
        inputRef.current?.focus();
      }}
      style={styles.row}
    >
      {Array.from({ length: PIN_LENGTH }).map((_, index) => (
        <View
          key={index}
          ref={(el) => {
            boxRefs.current[index] = el;
          }}
          style={[GeneralStyles.box, styles.box]}
        >
          <View
            ref={(el) => {
              dotRefs.current[index] = el;
            }}
            style={[styles.dot, { display: "none" }]}
          />
        </View>
      ))}
      <TextInput
        ref={inputRef}
        value={inputValue}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={PIN_LENGTH}
        autoFocus
        style={styles.hiddenInput}
        caretHidden
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
  box: {
    borderRadius: 14,
    backgroundColor: Colors.backgroundInk,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.snowGray,
  },
  hiddenInput: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.01, // Sometimes opacity: 0.01 is safer for very old Android versions
  },
});
