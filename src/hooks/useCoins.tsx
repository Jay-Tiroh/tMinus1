import {
  useAllAssetsQuery,
  useGetAssetQuery,
} from "@/store/services/marketsApi";

export const useCoins = () => {
  const { data: coins, isLoading: coinsLoading } = useAllAssetsQuery();
  const coinData = [];
  coins?.forEach((coin) => {
    const { data: coinInfo, isLoading } = useGetAssetQuery(coin.symbol);
    coinData.push({
      ...coin,
      chart: coinInfo?.chartData || [],
    });
  });
};
