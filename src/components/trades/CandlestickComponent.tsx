import CandlestickChart from "@/components/CandlestickChart";
import ChangeText from "@/components/ChangeText";
import TextBlock from "@/components/TextBlock";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { formatCurrency } from "@/helpers/functions";
import { useAssetCandle } from "@/hooks/useAssetCandle";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

type props = {
  symbol: string;
  priceUsd: number;
  change24h: number;
};

const timeOptions = {
  "1m": "1 Minute",
  "5m": "5 Minutes",
  "15m": "15 Minutes",
  "1h": "1 Hour",
  "1d": "1 Day",
} as const;
const CandlestickComponent = ({ symbol, priceUsd, change24h }: props) => {
  const [timeControl, setTimeControl] =
    React.useState<keyof typeof timeOptions>("1m");

  const onSelectTimeControl = (option: keyof typeof timeOptions) => {
    setTimeControl(option);
  };

  const { candles, isLoading, isError, isSuccess } = useAssetCandle(
    symbol,
    timeControl,
  );

  const [componentWidth, setComponentWidth] = React.useState(0);

  const handleLayout = (event: any) => {
    // Extract width from nativeEvent
    const { width } = event.nativeEvent.layout;
    setComponentWidth(width);
  };

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
          title={symbol + " / USD"}
          body={timeOptions[timeControl] + " · simulated candles"}
          titleStyle={{ color: Colors.textMidGray, fontSize: 12 }}
          bodyStyle={{ color: Colors.textCool, fontSize: 10, marginTop: -4 }}
        />
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <ThemedText size={14} weight="bold" color={"#fff"}>
            ${formatCurrency(priceUsd as number)}
          </ThemedText>
          <ChangeText
            change={change24h ?? 0}
            style={{
              fontSize: 10,
            }}
          />
        </View>
      </View>

      {/*chart*/}

      <CandlestickChart data={candles} width={componentWidth - 40} />

      {/*action tabs*/}
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
      {Object.entries(timeOptions).map(([key, label]) => (
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

export default CandlestickComponent;

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
