import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { CommonList, FinanceList, TradeList } from "@/constants/MenuLists";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

const SECTIONS = [
  { label: "Common", list: CommonList },
  { label: "Trade", list: TradeList },
  { label: "Finance", list: FinanceList },
];

const MenuList = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {SECTIONS.map((section) => (
        <View style={styles.section} key={section.label}>
          <ThemedText
            size={16}
            letterSpacing={2.64}
            weight="medium"
            style={{
              color: Colors.textFaint,
              paddingHorizontal: 24,
              paddingVertical: 16,
            }}
          >
            {section.label}
          </ThemedText>

          <View
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: Colors.surfaceAlt,
              marginHorizontal: 24,
            }}
          />

          <View style={styles.listContainer}>
            {section.list.map((item) => (
              <Pressable style={styles.item} key={item.name}>
                <item.icon style={styles.icon} />
                <ThemedText size={12} style={{ color: Colors.textFaint }}>
                  {item.name}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default MenuList;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 20,
  },
  section: {},
  listContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 16,
  },
  item: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingBottom: 40,
  },
  icon: {},
});
