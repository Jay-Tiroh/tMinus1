import { useAssetChart } from "@/hooks/useAssetChart";

type Action = "Buy" | "Sell" | "Swap";

export const useTradeCalculator = (
  action: Action,
  fromSymbol: string,
  toSymbol: string,
) => {
  // Determine which assets we actually need to fetch prices for.
  // USDT doesn't need to be fetched since its price is always ~$1.00.
  const skipFromFetch = action === "Buy" || fromSymbol === "USDT";
  const skipToFetch = action === "Sell" || toSymbol === "USDT";

  const { coinInfo: fromCoin, isLoading: loadingFrom } = useAssetChart(
    fromSymbol,
    skipFromFetch,
  );

  const { coinInfo: toCoin, isLoading: loadingTo } = useAssetChart(
    toSymbol,
    skipToFetch,
  );

  const calculateReceiveAmount = (inputAmount: number): number => {
    if (!inputAmount || inputAmount <= 0) return 0;

    if (action === "Buy") {
      // Buy: USDT -> Crypto
      // Formula: inputAmount (USD) / priceUsd of Crypto
      const targetPrice = toCoin?.priceUsd;
      if (!targetPrice) return 0;

      return inputAmount / targetPrice;
    }

    if (action === "Sell") {
      // Sell: Crypto -> USDT
      // Formula: inputAmount (Crypto) * priceUsd of Crypto
      const sourcePrice = fromCoin?.priceUsd;
      if (!sourcePrice) return 0;

      return inputAmount * sourcePrice;
    }

    if (action === "Swap") {
      // Swap Route: CryptoA -> USD -> CryptoB
      const sourcePrice = fromCoin?.priceUsd;
      const targetPrice = toCoin?.priceUsd;

      if (!sourcePrice || !targetPrice) return 0;

      // Step 1: Liquidate CryptoA to USD
      const usdValue = inputAmount * sourcePrice;

      // Step 2: Use that USD to buy CryptoB
      return usdValue / targetPrice;
    }

    return 0;
  };

  return {
    calculateReceiveAmount,
    isLoading: loadingFrom || loadingTo,
    fromPriceUsd: fromCoin?.priceUsd,
    toPriceUsd: toCoin?.priceUsd,
  };
};
