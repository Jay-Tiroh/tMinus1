import { SelectorOption } from "@/components/OptionPicker";
import useProfile from "@/features/user/hooks/useProfile";
import { FIAT_CURRENCIES, FiatCurrency } from "@/features/user/types/profile";
import { useCallback, useEffect, useRef, useState } from "react";

// Fallback estimates in case fetch fails
const FALLBACK_RATES: Record<FiatCurrency, number> = {
  USD: 1,
  NGN: 1620,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.53,
  JPY: 157,
  CHF: 0.9,
};

export default function useFiat() {
  const { settings } = useProfile();
  const [fiat, setFiat] = useState<SelectorOption<FiatCurrency>>(
    FIAT_CURRENCIES[0],
  );
  const ratesRef = useRef<Record<FiatCurrency, number>>(FALLBACK_RATES);

  useEffect(() => {
    const selectedFiat = FIAT_CURRENCIES.find(
      (currency) => currency.value === settings?.fiatCurrency,
    );
    setFiat(selectedFiat || FIAT_CURRENCIES[0]);
  }, [settings?.fiatCurrency]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD",
        );
        if (!res.ok) return;
        const data = await res.json();
        const rates = data.rates as Record<string, number>;

        const mapped = Object.fromEntries(
          (Object.keys(FALLBACK_RATES) as FiatCurrency[]).map((key) => [
            key,
            rates[key] ?? FALLBACK_RATES[key],
          ]),
        ) as Record<FiatCurrency, number>;

        ratesRef.current = mapped;
      } catch {
        // silently fall back to estimates
      }
    };

    fetchRates();
  }, []);

  const convertFromUSD = useCallback(
    (usdAmount: number): number => {
      const rate = ratesRef.current[fiat.value] ?? 1;
      return usdAmount * rate;
    },
    [fiat.value],
  );

  return { fiat, symbol: fiat.symbol, convertFromUSD };
}
