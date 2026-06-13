import Chart from "@/components/LineChart";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import CryptoAssetItem from "@/components/wallets/CryptoAsset"; // Correctly using your component
import { Colors } from "@/constants/Colors";
import { PORTFOLIO_HISTORY_DATA } from "@/constants/mockData";
import { GeneralStyles } from "@/constants/themes";
import React from "react";
import { StyleSheet, View } from "react-native";

const PortfolioHistoryScreen = () => {
  // Dummy data mapping to Chart component expectations
  const chartData = Array.from({ length: 10 }).map((_, i) => ({
    priceUsd: 100 + i * 15,
    time: i,
  }));

  return (
    <Template
      textBlockProps={{
        title: "Portfolio history",
        body: "Track total balance movement over time.",
      }}
      ctaProps={undefined}
    >
      <View style={GeneralStyles.wrapper}>
        <View
          style={[
            GeneralStyles.box,
            {
              padding: 20,
              paddingBottom: 10,
              height: 200,
              justifyContent: "space-between",
            },
          ]}
        >
          <Chart data={chartData} isPositive={true} width={300} height={120} />

          <View style={styles.timeFilters}>
            {["1D", "1W", "1M", "1Y"].map((filter) => (
              <View
                key={filter}
                style={[
                  styles.filterPill,
                  filter === "1M" && {
                    backgroundColor: Colors.surfaceGreenForest,
                  },
                ]}
              >
                <ThemedText
                  size={12}
                  weight="bold"
                  color={
                    filter === "1M" ? Colors.primaryClean : Colors.textMidGray
                  }
                >
                  {filter}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      </View>

      <Spacer size={32} />

      <View style={[GeneralStyles.wrapper, { gap: 10 }]}>
        {PORTFOLIO_HISTORY_DATA.map((item) => (
          <CryptoAssetItem
            key={item.id}
            iconComponent={
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: item.isPositive
                      ? Colors.primaryClean
                      : Colors.loss,
                  },
                ]}
              >
                <ThemedText weight="bold" size={16} color={Colors.surfaceNavy}>
                  P
                </ThemedText>
              </View>
            }
            leftTitle={item.displayMonth}
            leftBody="Portfolio value"
            rightTitle={item.portfolioValueFormatted}
            rightBody={item.percentageChangeFormatted}
          />
        ))}
      </View>
    </Template>
  );
};

export default PortfolioHistoryScreen;

const styles = StyleSheet.create({
  timeFilters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  filterPill: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 12 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
