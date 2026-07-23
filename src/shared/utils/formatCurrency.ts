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

export function formatAmount(value: number, isCrypto = true): string {
  if (!Number.isFinite(value)) {
    return isCrypto ? "0.00000000" : "0.00";
  }
  if (!isCrypto) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  let maxFraction: number;
  if (value >= 1) {
    maxFraction = 4;
  } else if (value === 0) {
    maxFraction = 2;
  } else {
    const leadingZeros = Math.floor(-Math.log10(Math.abs(value)));
    maxFraction = Math.min(Math.max(leadingZeros + 2, 2), 8);
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxFraction,
  }).format(value);
}
