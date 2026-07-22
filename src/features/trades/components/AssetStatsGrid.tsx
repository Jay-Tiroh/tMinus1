import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { ThemedText } from "@/shared/components/ThemedText";
import { ms, s, vs } from "@/utils/responsive";
import React from "react";
import { StyleSheet, View } from "react-native";

export interface StatItem {
  name: string;
  value: string;
}

interface AssetStatsGridProps {
  stats: StatItem[];
}

export const AssetStatsGrid = ({ stats }: AssetStatsGridProps) => {
  return (
    <View style={[GeneralStyles.wrapper, styles.statsGrid]}>
      {stats.map((stat) => (
        <View key={stat.name} style={[GeneralStyles.box, styles.statCard]}>
          <ThemedText color={Colors.textMidGray} size={12}>
            {stat.name}
          </ThemedText>
          <ThemedText
            color={Colors.snowGray}
            size={15}
            weight="bold"
            style={{ alignSelf: "flex-end" }}
          >
            {stat.value}
          </ThemedText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: s(16),
  },
  statCard: {
    width: "46%",
    padding: ms(16),
    gap: vs(8),
  },
});
