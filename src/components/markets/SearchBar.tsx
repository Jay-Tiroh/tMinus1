import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
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
      <Ionicons name="search" size={24} color={Colors.primaryClean} />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.backgroundDark,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    color: Colors.textOnDark,
  },
});
