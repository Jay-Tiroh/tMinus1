import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { ms, s, vs } from "@/shared/utils/responsive";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for a coin or symbol..."
        style={styles.input}
        placeholderTextColor={Colors.textMidGray}
        value={value}
        onChangeText={onChangeText}
      />
      <Ionicons name="search" size={ms(24)} color={Colors.primaryClean} />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    borderRadius: ms(12),
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.backgroundDark,
    flexDirection: "row",
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    color: Colors.textOnDark,
    fontSize: ms(14),
  },
});
