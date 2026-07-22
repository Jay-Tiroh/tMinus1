import { Colors } from "@/constants/Colors";
import { Candle } from "@/features/markets/types/assets";
import { useMemo } from "react";
import { G, Line, Rect, Svg } from "react-native-svg";

type CandlestickChartProps = {
  data: Candle[];
  width?: number;
  height?: number;
};

export default function CandlestickChart({
  data,
  width = 300,
  height = 150,
}: CandlestickChartProps) {
  const renderedCandles = useMemo(() => {
    if (!data || data.length === 0) return null;

    const lows = data.map((d) => d.lowUsd);
    const highs = data.map((d) => d.highUsd);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const range = max - min || 1;

    const stepX = width / data.length;
    const candleWidth = stepX * 0.7;

    return data.map((d, i) => {
      const isPositive = d.closeUsd >= d.openUsd;
      const color = isPositive ? Colors.profit : Colors.loss;

      const xCenter = i * stepX + stepX / 2;
      const yHigh = height - ((d.highUsd - min) / range) * height;
      const yLow = height - ((d.lowUsd - min) / range) * height;
      const yOpen = height - ((d.openUsd - min) / range) * height;
      const yClose = height - ((d.closeUsd - min) / range) * height;

      const bodyY = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(1, Math.abs(yOpen - yClose));

      return (
        <G key={d.time}>
          <Line
            x1={xCenter}
            y1={yHigh}
            x2={xCenter}
            y2={yLow}
            stroke={color}
            strokeWidth={1}
          />
          <Rect
            x={xCenter - candleWidth / 2}
            y={bodyY}
            width={candleWidth}
            height={bodyHeight}
            fill={color}
          />
        </G>
      );
    });
  }, [data, width, height]);

  if (!renderedCandles) return null;

  return (
    <Svg width={width} height={height}>
      {renderedCandles}
    </Svg>
  );
}
