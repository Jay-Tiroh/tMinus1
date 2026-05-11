import MoreIcon from "@/assets/icons/home/more.svg";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GridItems } from "@/constants/GridItems";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

const Grid = () => {
  const router = useRouter();
  const handleMore = () => {
    router.push("/(tabs)/home/menu");
  };
  return (
    <View style={styles.container}>
      {GridItems.map((item, index) => (
        <View
          style={[
            styles.item,
            {
              borderColor: Colors.surfaceAlt + "40",
              borderRightWidth: index % 4 === 3 ? 0 : 1,
              borderBottomWidth: index > 4 ? 0 : 1,
            },
          ]}
          key={item.name}
        >
          <item.icon style={styles.icon} />
          <ThemedText size={12} style={{ color: Colors.textFaint }}>
            {item.name}
          </ThemedText>
        </View>
      ))}
      <Pressable onPress={handleMore} style={[styles.item]}>
        <MoreIcon style={styles.icon} />
        <ThemedText size={12} style={{ color: Colors.textFaint }}>
          More
        </ThemedText>
      </Pressable>
    </View>
  );
};

export default Grid;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // maxHeight: 168,
    backgroundColor: Colors.surfaceDark,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    width: "25%", // 4 columns → each takes 25%
    // height: 84, // 2 rows → 168 / 2
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    paddingTop: 10,
  },
  icon: {
    // boxShadow: "0px 5px 16px rgba(94, 213, 168, 0.25)",
  },
});
