import { useGetCandlesQuery } from "@/store/services/marketsApi";
import { Candle } from "@/types/assets";

interface UseAssetCandleReturn {
  candles: Candle[];
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => void;
}

export function useAssetCandle(
  symbol: string,
  interval: string = "1m",
  limit: number = 50,
  skip = false,
  pollIntervalMs = 10000,
): UseAssetCandleReturn {
  const {
    data: candles,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGetCandlesQuery(
    { symbol, interval, limit },
    {
      skip: skip || !symbol,
      pollingInterval: pollIntervalMs,
    },
  );

  return {
    candles: candles ?? [],
    isLoading,
    isError,
    isSuccess,
    refetch,
  };
}
