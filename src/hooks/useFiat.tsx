import { SelectorOption } from "@/components/OptionPicker";
import useProfile from "@/hooks/useProfile";
import { FIAT_CURRENCIES, FiatCurrency } from "@/types/profile";
import { useEffect, useState } from "react";

export default function useFiat() {
  const { settings } = useProfile();

  const [fiat, setFiat] = useState<SelectorOption<FiatCurrency>>(
    FIAT_CURRENCIES[0],
  );

  useEffect(() => {
    const selectedFiat = FIAT_CURRENCIES.find(
      (currency) => currency.value === settings?.fiatCurrency,
    );
    setFiat(selectedFiat || FIAT_CURRENCIES[0]);
  }, [settings?.fiatCurrency]);

  return { fiat, symbol: fiat.symbol };
}
