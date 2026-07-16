import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { View } from "react-native";

export const TransactionEmptyState = () => (
  <View style={[GeneralStyles.wrapper, { marginTop: 12 }]}>
    <View
      style={[
        GeneralStyles.box,
        { padding: 24, gap: 12, alignItems: "center" },
      ]}
    >
      <Ionicons name="receipt-outline" size={44} color={Colors.textFaint} />
      <ThemedText weight="bold" size={16} color={Colors.textFaint}>
        No transactions found
      </ThemedText>
      <ThemedText
        size={13}
        color={Colors.textMidGray}
        style={{ lineHeight: 20, textAlign: "center" }}
      >
        {"You don't have any transactions matching this category yet."}
      </ThemedText>
    </View>
  </View>
);
