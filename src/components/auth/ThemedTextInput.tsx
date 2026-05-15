import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type ThemedTextInputProps<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
};

export function ThemedTextInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  containerStyle,
  inputStyle,
  errorStyle,
  ...rest
}: ThemedTextInputProps<T>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isEditable = rest.editable !== false;

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={[{ gap: 6 }, containerStyle]}>
          {name !== "password" ? (
            <TextInput
              placeholder={placeholder}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              style={[
                styles.input,
                !isEditable && styles.inputDisabled,
                inputStyle,
              ]}
              placeholderTextColor={Colors.textMuted}
              {...rest}
            />
          ) : (
            <View
              style={[
                styles.input,
                styles.password,
                !isEditable && styles.inputDisabled,
              ]}
            >
              <TextInput
                placeholder={placeholder}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                style={[{ width: "80%", color: Colors.textFaint }, inputStyle]}
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                {...rest}
              />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name={isPasswordVisible ? "eye-sharp" : "eye-off-sharp"}
                  size={24}
                  color={Colors.textMuted}
                  onPress={() => isEditable && setIsPasswordVisible((v) => !v)}
                />
              </View>
            </View>
          )}
          {error?.message && (
            <ThemedText
              weight="regular"
              size={12}
              style={[{ color: "#EF4444" }, errorStyle]}
            >
              {error.message}
            </ThemedText>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 54,
    justifyContent: "center",
    color: Colors.textFaint,
    fontFamily: Fonts.regular,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  password: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
