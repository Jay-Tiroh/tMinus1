import { useGetAssetQuery } from "@/store/services/marketsApi";
import { ChartData } from "@/types/assets";

export function useAssetChart(symbol: string, skip = false): ChartData[] {
  const { data: coinInfo } = useGetAssetQuery({ symbol }, { skip });
  return coinInfo?.chart ?? [];
}
