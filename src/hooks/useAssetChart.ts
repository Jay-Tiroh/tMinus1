import { useGetAssetQuery } from "@/store/services/marketsApi";
import { AssetDetailsResponse, ChartData } from "@/types/assets";

interface UseAssetChartReturn {
  chart: ChartData[];
  coinInfo: AssetDetailsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => void;
}

export function useAssetChart(
  symbol: string,
  skip = false,
  pollIntervalMs = 10000,
): UseAssetChartReturn {
  const {
    data: coinInfo,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGetAssetQuery(
    { symbol },
    {
      skip,
      pollingInterval: pollIntervalMs,
    },
  );

  return {
    chart: coinInfo?.chart ?? [],
    coinInfo,
    isLoading,
    isError,
    isSuccess,
    refetch,
  };
}
