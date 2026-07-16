import { Colors } from "@/constants/Colors";
import { ChartData } from "@/features/markets/types/assets";
import { useMemo } from "react";
import { Defs, LinearGradient, Path, Stop, Svg } from "react-native-svg";

type ChartProps = {
  data: ChartData[];
  isPositive: boolean;
  width?: number;
  height?: number;
};

export default function Chart({
  data,
  isPositive,
  width = 150,
  height = 60,
}: ChartProps) {
  const { linePath, gradientPath } = useMemo(() => {
    if (data.length < 2) return { linePath: "", gradientPath: "" };

    const values = data.map((d) => d.priceUsd);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = values.map((v, i) => ({
      x: (i / (values.length - 1)) * width,
      y: height - ((v - min) / range) * height,
    }));

    const line = points
      .map(
        (p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`,
      )
      .join(" ");

    const gradient = `${line} L ${width} ${height} L 0 ${height} Z`;

    return { linePath: line, gradientPath: gradient };
  }, [data, width, height]);

  const color = isPositive ? Colors.profit : Colors.loss;

  if (!linePath) return null;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity={0.3} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d={gradientPath} fill="url(#chartGradient)" />
      <Path d={linePath} stroke={color} strokeWidth={1.5} fill="none" />
    </Svg>
  );
}
