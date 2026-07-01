import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { ms, s, vs } from "@/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface ThemedInputProps<
  T extends FieldValues = FieldValues,
> extends TextInputProps {
  icon: React.ReactNode;
  hasToggle?: boolean;
  control?: Control<T>;
  name?: Path<T>;
  formatter?: (value: string) => string;
}

export const ThemedInput = <T extends FieldValues>({
  icon,
  hasToggle,
  secureTextEntry,
  control,
  name,
  formatter,
  ...props
}: ThemedInputProps<T>) => {
  const [isHidden, setIsHidden] = useState(secureTextEntry);

  const renderInput = (
    value?: string,
    onChangeText?: (text: string) => void,
    onBlur?: () => void,
  ) => (
    <View style={styles.container}>
      <View style={styles.iconCircle}>{icon}</View>

      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.textMidGray}
        secureTextEntry={isHidden}
        value={value ?? ""}
        onChangeText={(text) => {
          const formatted = formatter ? formatter(text) : text;
          onChangeText?.(formatted);
        }}
        onBlur={onBlur}
        {...props}
      />

      {hasToggle && (
        <TouchableOpacity
          onPress={() => setIsHidden((prev) => !prev)}
          style={styles.toggle}
        >
          <MaterialCommunityIcons
            name={isHidden ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={Colors.textMidGray}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View>
            {renderInput(value, onChange, onBlur)}

            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        )}
      />
    );
  }

  return renderInput();
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceNavy,
    borderRadius: ms(16),
    height: vs(60),
    paddingHorizontal: s(16),
  },

  iconCircle: {
    width: s(38),
    height: vs(38),
    borderRadius: ms(16),
    backgroundColor: Colors.surfaceDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(12),
  },

  input: {
    flex: 1,
    color: Colors.snowGray,
    fontFamily: Fonts.regular,
    fontSize: ms(16),
    height: "100%",
  },

  toggle: {
    padding: ms(8),
    marginRight: s(-8),
  },

  errorText: {
    color: Colors.lossAlt,
    marginTop: vs(6),
    marginLeft: s(4),
    fontSize: ms(12),
    fontFamily: Fonts.regular,
  },
});
