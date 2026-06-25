import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type OTPInputProps = {
  length?: number;
  onChange?: (code: string) => void;
  onComplete: (code: string) => void;
};

export const OTPInput = ({
  length = 6,
  onChange,
  onComplete,
}: OTPInputProps) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (onChange) onChange(newCode.join(""));

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newCode.every((c) => c !== "")) {
      onComplete(newCode.join(""));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {code.map((char, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputs.current[index] = ref;
          }}
          style={[styles.box, char !== "" && styles.boxFilled]}
          value={char}
          onChangeText={(text) =>
            handleChange(text.replace(/[^0-9]/g, ""), index)
          }
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  box: {
    width: 48,
    height: 56,
    backgroundColor: Colors.surfaceNavy,
    borderRadius: 12,
    color: Colors.snowGray,
    fontSize: 24,
    fontFamily: Fonts.bold,
    textAlign: "center",
  },
  boxFilled: {
    backgroundColor: Colors.surfaceDark, // Slightly different shade when filled to match mockup
  },
});
