import { Colors } from "@/constants/Colors";
import { ChartData } from "@/types/assets";
import { LineChart } from "react-native-wagmi-charts";

type ChartProps = {
  data: ChartData[];
  isPositive: boolean;
};

export default function Chart({ data, isPositive }: ChartProps) {
  const formattedData = data.map((item) => ({
    timestamp: Math.floor(Date.parse(item.time) / 1000),
    value: item.priceUsd,
  }));
  return (
    <LineChart.Provider data={formattedData}>
      <LineChart height={80} width={150}>
        <LineChart.Path color={isPositive ? Colors.profit : Colors.loss}>
          <LineChart.Gradient
            color={isPositive ? Colors.profit : Colors.loss}
          />
        </LineChart.Path>
      </LineChart>
    </LineChart.Provider>
  );
}
