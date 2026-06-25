import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
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
}

export const ThemedInput = <T extends FieldValues>({
  icon,
  hasToggle,
  secureTextEntry,
  control,
  name,
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
        onChangeText={onChangeText}
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
    borderRadius: 16,
    height: 60,
    paddingHorizontal: 16,
  },

  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 16,
    backgroundColor: Colors.surfaceDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  input: {
    flex: 1,
    color: Colors.snowGray,
    fontFamily: Fonts.regular,
    fontSize: 16,
    height: "100%",
  },

  toggle: {
    padding: 8,
    marginRight: -8,
  },

  errorText: {
    color: Colors.lossAlt,
    marginTop: 6,
    marginLeft: 4,
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
});
