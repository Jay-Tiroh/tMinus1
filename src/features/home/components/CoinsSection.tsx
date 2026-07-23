import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/shared/components/ThemedText";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useCoinsSection } from "../hooks/useCoinsSection";
import { CoinList } from "./CoinList";

export const CoinsSection = () => {
  const {
    coins,
    coinsLoading,
    isUninitialized,
    trending,
    trendingLoading,
    trendingUninitialized,
  } = useCoinsSection();

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <ThemedText
          weight="bold"
          size={18}
          letterSpacing={2.64}
          style={{ color: Colors.surface }}
        >
          Recent Coins
        </ThemedText>
        <CoinList
          data={coins}
          isLoading={coinsLoading}
          isUninitialized={isUninitialized}
        />

        <ThemedText
          weight="bold"
          size={18}
          letterSpacing={2.64}
          style={{ color: Colors.surface }}
        >
          Top Coins
        </ThemedText>
        <CoinList
          data={trending}
          isLoading={trendingLoading}
          isUninitialized={trendingUninitialized}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  wrapper: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
