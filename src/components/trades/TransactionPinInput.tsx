import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TextInput, View } from "react-native";
import { z } from "zod";

const PIN_LENGTH = 4;

const pinSchema = z.object({
  pin: z
    .string()
    .length(PIN_LENGTH, "PIN must be 4 digits")
    .regex(/^\d+$/, "PIN must be numeric"),
});

type PinFormValues = z.infer<typeof pinSchema>;

type TransactionPinInputProps = {
  onComplete: (pin: string) => void;
};

const TransactionPinInput = ({ onComplete }: TransactionPinInputProps) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const digits = useRef<string[]>(Array(PIN_LENGTH).fill(""));

  const { control, setValue, watch } = useForm<PinFormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: { pin: "" },
  });

  const pin = watch("pin");

  const handleChange = (text: string, index: number) => {
    const char = text.slice(-1);

    if (char && !/^\d$/.test(char)) return;

    digits.current[index] = char;
    const newPin = digits.current.join("");
    setValue("pin", newPin, { shouldValidate: true });

    if (char && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // ✅ correct check: all slots filled and every slot is a digit
    const allFilled = digits.current.every((d) => d !== "");
    if (allFilled) {
      onComplete(newPin);
    }
  };
  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace") {
      if (digits.current[index]) {
        digits.current[index] = "";
        setValue("pin", digits.current.join(""));
      } else if (index > 0) {
        digits.current[index - 1] = "";
        setValue("pin", digits.current.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <Controller
      control={control}
      name="pin"
      render={() => (
        <View style={styles.row}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => {
            const filled = !!digits.current[i];
            return (
              <View
                key={i}
                style={[
                  GeneralStyles.box,
                  styles.box,
                  pin.length === i && styles.boxActive,
                ]}
              >
                {filled && <View style={styles.dot} />}
                <TextInput
                  ref={(r) => {
                    inputRefs.current[i] = r;
                  }}
                  style={styles.hiddenInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  caretHidden
                  contextMenuHidden
                  onChangeText={(text) => handleChange(text, i)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, i)
                  }
                  autoFocus={i === 0}
                />
              </View>
            );
          })}
        </View>
      )}
    />
  );
};

export default TransactionPinInput;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
  box: {
    borderRadius: 14,
    backgroundColor: Colors.backgroundDark,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  boxActive: {
    borderWidth: 1,
    borderColor: Colors.primaryClean,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.snowGray,
  },
  hiddenInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
  },
});
