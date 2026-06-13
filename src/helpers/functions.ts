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

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  // Get the difference in seconds
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Future dates or invalid dates fallback
  if (seconds < 0 || isNaN(date.getTime())) {
    return "just now";
  }

  // Time calculations
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Return strings based on thresholds
  if (seconds < 60) {
    return "just now";
  } else if (minutes === 1) {
    return "1 min ago";
  } else if (minutes < 60) {
    return `${minutes} mins ago`;
  } else if (hours === 1) {
    return "1 hr ago";
  } else if (hours < 24) {
    return `${hours} hrs ago`;
  } else if (days === 1) {
    return "yesterday";
  } else if (days < 7) {
    return `${days} days ago`;
  } else if (weeks === 1) {
    return "last week";
  } else if (weeks < 4) {
    return `${weeks} weeks ago`;
  } else if (months === 1) {
    return "last month";
  } else if (months < 12) {
    return `${months} months ago`;
  } else if (years === 1) {
    return "last year";
  } else {
    return `${years} years ago`;
  }
}
