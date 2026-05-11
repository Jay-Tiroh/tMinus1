import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

type ThemedTextInputProps<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
  ref?: React.Ref<TextInput>;
  onBlurCustom?: () => void;
  errorStyle?: object;
};

export function ThemedTextInput<T extends FieldValues>({
  control,
  name,
  ref,
  onBlurCustom,
  style,
  errorStyle,
  ...rest
}: ThemedTextInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          <TextInput
            ref={ref}
            style={[styles.baseInput, style]}
            onChangeText={onChange}
            onBlur={() => {
              onBlur();
              onBlurCustom?.();
            }}
            value={value?.toString() ?? ""}
            {...rest}
          />
          {error?.message && (
            <ThemedText
              weight="regular"
              size={10}
              style={[styles.error, errorStyle]}
            >
              {error.message}
            </ThemedText>
          )}
        </View>
      )}
    />
  );
}

ThemedTextInput.displayName = "ThemedTextInput";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  baseInput: {
    fontFamily: Fonts.regular,
  },
  error: {
    color: Colors.warning,
    marginTop: 4,
  },
});
