import { Colors } from "@/constants/Colors";
import Chart from "@/features/markets/components/LineChart";
import { Asset, FeaturedMeta } from "@/features/markets/types/assets";
import { formatAmount } from "@/helpers/functions";
import useFiat from "@/hooks/useFiat";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import { ms, s, vs } from "@/utils/responsive";
import { Href, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

type TopGainerProps = {
  topGainer: Asset | undefined;
  featured: FeaturedMeta | undefined;
};

export const TopGainer = ({ topGainer, featured }: TopGainerProps) => {
  const router = useRouter();
  const { symbol, convertFromUSD } = useFiat();

  const route = "/(tabs)/trades/asset?coin=" + featured?.symbol;

  const handlePress = () => {
    router.replace(route as Href);
  };

  return (
    <View style={styles.topGainerContainer}>
      <View>
        <ThemedText weight="medium" size={11} color={Colors.primaryMist}>
          TOP GAINER · 24H
        </ThemedText>
        <Spacer size={15} />
        <TextBlock
          title={featured?.name ?? "Top Gainer"}
          body={"Highest 24h gain"}
          bodyStyle={{
            color: Colors.primaryAqua,
            fontSize: ms(12),
            marginTop: vs(-4),
            maxWidth: s(120),
          }}
          titleStyle={{ fontSize: ms(22) }}
        />

        <Spacer size={6} />
        <ThemedButton
          title="View asset"
          style={{
            backgroundColor: Colors.surfaceGreenRich,
            width: s(78),
            height: vs(22),
            borderRadius: ms(11),
          }}
          textStyle={{ color: Colors.primaryFrost, fontSize: ms(11) }}
          onPress={handlePress}
        />
      </View>
      <View style={styles.metricsContainer}>
        <ThemedText weight="medium" size={11} color={Colors.primaryFrost}>
          {symbol + formatAmount(convertFromUSD(topGainer?.priceUsd as number))}
        </ThemedText>
        <View style={styles.chartWrapper}>
          <ThemedText weight="bold" size={12} color={Colors.primaryClean}>
            +{topGainer?.change24h.toFixed(1)}%
          </ThemedText>
          <Chart
            isPositive={true}
            data={topGainer?.sparkline ?? []}
            width={s(178)}
            height={vs(70)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topGainerContainer: {
    width: "100%",
    backgroundColor: Colors.surfaceGreenDark,
    borderRadius: ms(18),
    padding: ms(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxHeight: vs(150),
  },
  metricsContainer: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: vs(10),
    height: "100%",
  },
  chartWrapper: {
    alignItems: "flex-end",
    gap: vs(4),
  },
});
