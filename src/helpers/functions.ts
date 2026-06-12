export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactNumber(amount: number): string {
  if (Number.isNaN(amount)) return "0.00";

  const absAmount = Math.abs(amount);

  if (absAmount >= 1_000_000_000_000) {
    return (amount / 1_000_000_000_000).toFixed(2) + "T";
  }

  if (absAmount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(2) + "B";
  }

  if (absAmount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(2) + "M";
  }

  if (absAmount >= 10_000) {
    return (amount / 1_000).toFixed(2) + "K";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const formatExtensionsForDisplay = (extensions: string[]): string => {
  return Array.from(
    new Set(extensions.map((ext) => ext.replace(/^\./, "").toUpperCase())),
  ).join(" · ");
};

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

export function formatAmount(value: number, isCrypto = false): string {
  if (!isCrypto) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  // For values >= 1, show up to 4 decimal places
  // For values < 1, show enough digits to capture 2 significant figures
  let maxFraction: number;

  if (value >= 1) {
    maxFraction = 4;
  } else if (value === 0) {
    maxFraction = 2;
  } else {
    // Find how many leading zeros are after the decimal point
    // e.g. 0.00000183 → needs 8 decimal places to show 2 sig figs
    const leadingZeros = Math.floor(-Math.log10(Math.abs(value)));
    maxFraction = Math.min(leadingZeros + 2, 8);
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxFraction,
  }).format(value);
}
