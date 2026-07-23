export const calculateEstimatedCryptoReceive = (
  usdAmountToSpend: number,
  currentPriceInUsd: number,
): number => {
  if (!usdAmountToSpend || !currentPriceInUsd || currentPriceInUsd <= 0) {
    return 0;
  }
  const estimatedCrypto = usdAmountToSpend / currentPriceInUsd;
  return Number(estimatedCrypto.toFixed(8));
};
