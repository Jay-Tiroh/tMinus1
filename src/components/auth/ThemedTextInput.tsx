import { ThemedText } from "@/components/ThemedText"; // adjust path as needed
import { Colors } from "@/constants/Colors";
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
              style={[styles.input, inputStyle]}
              placeholderTextColor={Colors.textMuted}
              {...rest}
            />
          ) : (
            <View style={[styles.input, styles.password]}>
              <TextInput
                placeholder={placeholder}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                style={[{ width: "80%", color: Colors.textFaint }, inputStyle]}
                placeholderTextColor={Colors.textMuted}
                // secureTextEntry={!isPasswordVisible}
                {...rest}
              />

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {isPasswordVisible ? (
                  <Ionicons
                    name="eye-sharp"
                    size={24}
                    color={Colors.textMuted}
                    onPress={() => setIsPasswordVisible(false)}
                  />
                ) : (
                  <Ionicons
                    name="eye-off-sharp"
                    size={24}
                    color={Colors.textMuted}
                    onPress={() => setIsPasswordVisible(true)}
                  />
                )}
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
  },
  password: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
