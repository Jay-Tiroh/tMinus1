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
