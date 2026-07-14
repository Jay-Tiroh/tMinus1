import ChangeText from "@/components/ChangeText";
import TextBlock from "@/components/TextBlock";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { formatCurrency } from "@/helpers/functions";
import useFiat from "@/hooks/useFiat";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

// Assuming you have this exported from somewhere, or you can define it here

import Chart from "@/components/LineChart";
import { timeOptions } from "@/components/screens/tabs/wallets/PortfolioHistoryScreen";
import { PortfolioChartPoint } from "@/types/wallets";

type props = {
  symbol: string;
  priceUsd: number;
  change24h: number;
  chartData: PortfolioChartPoint[];
  setTimeControl: (option: keyof typeof timeOptions) => void;
  timeControl: keyof typeof timeOptions;
};

const AdvancedLineChart = ({
  symbol,
  priceUsd,
  change24h,
  chartData,
  setTimeControl,
  timeControl,
}: props) => {
  const onSelectTimeControl = (option: keyof typeof timeOptions) => {
    setTimeControl(option);
  };

  const [componentWidth, setComponentWidth] = React.useState(0);

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setComponentWidth(width);
  };

  const { symbol: currency, fiat, convertFromUSD } = useFiat();

  // Transform the PortfolioChartPoint data to match the ChartData interface
  const formattedChartData = useMemo(() => {
    if (!chartData) return [];

    return chartData.map((point: PortfolioChartPoint) => ({
      time: point.time,
      priceUsd: point.valueUsd,
    }));
  }, [chartData]);

  const isPositive = change24h >= 0;

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TextBlock
          title={symbol + " / " + fiat.label}
          body={timeOptions[timeControl] + " · simulated portfolio history"}
          titleStyle={{ color: Colors.textMidGray, fontSize: 12 }}
          bodyStyle={{ color: Colors.textCool, fontSize: 10, marginTop: -4 }}
        />
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <ThemedText size={14} weight="bold" color={"#fff"}>
            {currency + formatCurrency(convertFromUSD(priceUsd as number))}
          </ThemedText>
          <ChangeText
            change={change24h ?? 0}
            style={{
              fontSize: 10,
            }}
          />
        </View>
      </View>

      {/* Pass the transformed data to your original Chart component */}
      <Chart
        data={formattedChartData}
        width={componentWidth - 40}
        height={150}
        isPositive={isPositive}
      />

      {/* action tabs */}
      <ActionTabs onSelect={onSelectTimeControl} timeControl={timeControl} />
    </View>
  );
};

type ActionTabsProps = {
  timeControl: keyof typeof timeOptions;
  onSelect: (option: keyof typeof timeOptions) => void;
};

const ActionTabs = ({ timeControl, onSelect }: ActionTabsProps) => {
  const isSelected = (option: string) => option === timeControl;
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        justifyContent: "space-between",
        marginTop: 16,
        width: "100%",
      }}
    >
      {Object.entries(timeOptions).map(([key]) => (
        <Pressable
          key={key}
          style={{
            borderRadius: 12,
            backgroundColor: isSelected(key)
              ? Colors.surfaceGreenForest
              : Colors.surfaceSlate + "D9",
            width: 48,
            height: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
          hitSlop={10}
          onPress={() => onSelect(key as keyof typeof timeOptions)}
        >
          <ThemedText
            size={12}
            color={isSelected(key) ? Colors.primaryClean : Colors.textMidGray}
          >
            {key}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
};

export default AdvancedLineChart;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.backgroundDark,
    borderRadius: 20,
    padding: 20,
    minHeight: 200,
    alignItems: "center",
    gap: 16,
  },
});
