import { Colors } from "@/constants/Colors";
import { Chart } from "@/features/markets";
import { useFiat } from "@/features/user";
import { PortfolioChartPoint } from "@/features/wallets/types/wallets";
import ChangeText from "@/shared/components/ChangeText";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedText } from "@/shared/components/ThemedText";

import { formatCurrency } from "@/shared/utils/formatCurrency";
import React, { useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import { PORTFOLIO_TIME_OPTIONS } from "../constants/wallets.constants";

type TimeControlKey = keyof typeof PORTFOLIO_TIME_OPTIONS;

export interface AdvancedLineChartProps {
  symbol: string;
  priceUsd: number;
  change24h: number;
  chartData: PortfolioChartPoint[];
  setTimeControl: (option: TimeControlKey) => void;
  timeControl: TimeControlKey;
}

const AdvancedLineChart = ({
  symbol,
  priceUsd,
  change24h,
  chartData,
  setTimeControl,
  timeControl,
}: AdvancedLineChartProps) => {
  const [componentWidth, setComponentWidth] = useState(0);
  const { symbol: currency, fiat, convertFromUSD } = useFiat();

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setComponentWidth(width);
  };

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
      <View style={styles.header}>
        <TextBlock
          title={`${symbol} / ${fiat.label}`}
          body={`${PORTFOLIO_TIME_OPTIONS[timeControl]} · simulated portfolio history`}
          titleStyle={styles.textBlockTitle}
          bodyStyle={styles.textBlockBody}
        />
        <View style={styles.priceContainer}>
          <ThemedText size={14} weight="bold" color={Colors.white}>
            {currency + formatCurrency(convertFromUSD(priceUsd))}
          </ThemedText>
          <ChangeText change={change24h ?? 0} style={styles.changeText} />
        </View>
      </View>

      <Chart
        data={formattedChartData}
        width={componentWidth - 40}
        height={150}
        isPositive={isPositive}
      />

      <ActionTabs onSelect={setTimeControl} timeControl={timeControl} />
    </View>
  );
};

// ─── Local Subcomponent ───────────────────────────────────────────────────────

type ActionTabsProps = {
  timeControl: TimeControlKey;
  onSelect: (option: TimeControlKey) => void;
};

const ActionTabs = ({ timeControl, onSelect }: ActionTabsProps) => {
  return (
    <View style={styles.tabsContainer}>
      {Object.entries(PORTFOLIO_TIME_OPTIONS).map(([key]) => {
        const isSelected = key === timeControl;
        return (
          <Pressable
            key={key}
            style={[
              styles.tabButton,
              {
                backgroundColor: isSelected
                  ? Colors.surfaceGreenForest
                  : Colors.surfaceSlate + "D9",
              },
            ]}
            hitSlop={10}
            onPress={() => onSelect(key as TimeControlKey)}
          >
            <ThemedText
              size={12}
              color={isSelected ? Colors.primaryClean : Colors.textMidGray}
            >
              {key}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
};

export default AdvancedLineChart;

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  textBlockTitle: {
    color: Colors.textMidGray,
    fontSize: 12,
  },
  textBlockBody: {
    color: Colors.textCool,
    fontSize: 10,
    marginTop: -4,
  },
  priceContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  changeText: {
    fontSize: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 16,
    width: "100%",
  },
  tabButton: {
    borderRadius: 12,
    width: 48,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
