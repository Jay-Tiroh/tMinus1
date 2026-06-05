import Selfie from "@/assets/icons/selfie.svg";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
const CheckList = [
  "Good lighting",
  "No sunglasses or masks",
  "Face fully visible, neutral expression, no filters or edits",
  "Use your own document",
];

const Phase2 = () => {
  return (
    <View style={styles.container}>
      <Text>Phase2</Text>
      <View
        style={{
          backgroundColor: Colors.surfaceGreenDeep,
          width: 150,
          height: 150,
          borderRadius: 75,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: Colors.surfaceNavy,
            width: 94,
            height: 94,
            borderRadius: 47,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Selfie width={48} height={48} color={Colors.textMidGray} />
        </View>
      </View>

      <Spacer size={103} />
      {CheckList.map((item) => (
        <View
          key={item}
          style={{
            ...GeneralStyles.box,
            minHeight: 46,
            marginVertical: 8,
            gap: 16,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.primaryClean,
              width: 22,
              height: 22,
              borderRadius: 11,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome name="check" size={12} color={Colors.backgroundInk} />
          </View>
          <ThemedText size={12} color={Colors.snowGray}>
            {item}
          </ThemedText>
        </View>
      ))}
      <Spacer size={78} />
    </View>
  );
};

export default Phase2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
