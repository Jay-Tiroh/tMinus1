import { useAssetChart } from "@/features/markets";

export const useTradeCalculations = (
  buyOutputSymbol: string,
  sellInputSymbol: string,
  swapInputSymbol: string,
  swapOutputSymbol: string,
) => {
  const { coinInfo: buyCoin } = useAssetChart(buyOutputSymbol);
  const { coinInfo: sellCoin } = useAssetChart(sellInputSymbol);
  const { coinInfo: swapInCoin } = useAssetChart(swapInputSymbol);
  const { coinInfo: swapOutCoin } = useAssetChart(swapOutputSymbol);

  const getBuyReceive = (usdAmount: number) => {
    if (!buyCoin?.priceUsd) return 0;
    return usdAmount / buyCoin.priceUsd;
  };

  const getSellReceive = (coinAmount: number) => {
    if (!sellCoin?.priceUsd) return 0;
    return coinAmount * sellCoin.priceUsd;
  };

  const getSwapReceive = (coinAmount: number) => {
    if (!swapInCoin?.priceUsd || !swapOutCoin?.priceUsd) return 0;
    const usdValue = coinAmount * swapInCoin.priceUsd;
    return usdValue / swapOutCoin.priceUsd;
  };

  return {
    buyPriceUsd: buyCoin?.priceUsd || 0,
    sellPriceUsd: sellCoin?.priceUsd || 0,
    swapInPriceUsd: swapInCoin?.priceUsd || 0,
    swapOutPriceUsd: swapOutCoin?.priceUsd || 0,
    getBuyReceive,
    getSellReceive,
    getSwapReceive,
  };
};
