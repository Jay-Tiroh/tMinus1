import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import AdvancedLineChart from "@/components/wallets/AdvancedLineChart";
import CryptoAssetItem from "@/components/wallets/CryptoAsset"; // Correctly using your component
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount, timeAgo } from "@/helpers/functions";
import useFiat from "@/hooks/useFiat";
import useWallet from "@/hooks/useWallet";
import { useGetPortfolioHistoryQuery } from "@/store/services/walletsApi";
import React from "react";
import { StyleSheet, View } from "react-native";

export const timeOptions = {
  "1D": "1 Day",
  "1W": "1 Week",
  "1M": "1 Month",
  "1Y": "1 Year",
} as const;

const PortfolioHistoryScreen = () => {
  const [timeControl, setTimeControl] =
    React.useState<keyof typeof timeOptions>("1M");
  const {
    data: chartData,
    isLoading,
    isError,
    isSuccess,
  } = useGetPortfolioHistoryQuery({ range: timeControl });
  const displayedData = chartData?.data.slice(-5).reverse();
  const { portfolioValueUsd } = useWallet();
  const { symbol } = useFiat();
  return (
    <Template
      textBlockProps={{
        title: "Portfolio history",
        body: "Track total balance movement over time.",
      }}
      ctaProps={undefined}
    >
      <View style={GeneralStyles.wrapper}>
        <AdvancedLineChart
          symbol="PORTFOLIO"
          priceUsd={portfolioValueUsd}
          change24h={5}
          chartData={chartData?.data || []}
          setTimeControl={setTimeControl}
          timeControl={timeControl}
        />
      </View>

      <Spacer size={32} />

      <View style={[GeneralStyles.wrapper, { gap: 10 }]}>
        {displayedData?.map((item) => (
          <CryptoAssetItem
            key={item.time}
            iconComponent={
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: Colors.primaryClean,
                  },
                ]}
              >
                <ThemedText weight="bold" size={16} color={Colors.surfaceNavy}>
                  P
                </ThemedText>
              </View>
            }
            leftTitle={timeAgo(item.time)}
            leftBody="Portfolio value"
            rightTitle={symbol + formatAmount(item.value)}
            rightBody={item.currency}
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
