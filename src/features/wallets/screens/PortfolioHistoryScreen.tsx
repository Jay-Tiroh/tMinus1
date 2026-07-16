import ErrorState from "@/components/ErrorComponent";
import Loader from "@/components/Loader";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import CryptoAssetItem from "@/components/wallets/CryptoAssetItem";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useGetPortfolioHistoryQuery } from "@/features/wallets/api/walletsApi";
import AdvancedLineChart from "@/features/wallets/components/AdvancedLineChart";
import useWallet from "@/features/wallets/hooks/useWallet";
import { formatAmount, timeAgo } from "@/helpers/functions";
import useFiat from "@/hooks/useFiat";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { PORTFOLIO_TIME_OPTIONS } from "../constants/wallets.constants";

export const PortfolioHistoryScreen = () => {
  const [timeControl, setTimeControl] =
    useState<keyof typeof PORTFOLIO_TIME_OPTIONS>("1M");

  const {
    data: chartData,
    isLoading,
    isError,
    refetch,
  } = useGetPortfolioHistoryQuery({ range: timeControl });
  const { portfolioValueUsd } = useWallet();
  const { symbol } = useFiat();

  // Memoize to prevent arrays mutating during render
  const displayedData = useMemo(() => {
    return chartData?.data ? [...chartData.data].slice(-5).reverse() : [];
  }, [chartData]);

  return (
    <Template
      textBlockProps={{
        title: "Portfolio history",
        body: "Track total balance movement over time.",
      }}
      refetch={refetch}
      ctaProps={undefined}
    >
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
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
            {displayedData.map((item) => (
              <CryptoAssetItem
                key={item.time}
                iconComponent={
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: Colors.primaryClean },
                    ]}
                  >
                    <ThemedText
                      weight="bold"
                      size={16}
                      color={Colors.surfaceNavy}
                    >
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
        </>
      )}
    </Template>
  );
};

const styles = StyleSheet.create({
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
