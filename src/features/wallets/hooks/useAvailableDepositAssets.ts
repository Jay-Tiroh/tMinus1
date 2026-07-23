import useWallet from "@/features/wallets/hooks/useWallet";
import { useMemo } from "react";

export const useAvailableDepositAssets = () => {
  const { balances, depositAddresses } = useWallet();

  return useMemo(() => {
    if (!balances || !depositAddresses) return [];

    return balances.reduce(
      (acc, balance) => {
        const addressInfo = depositAddresses.find(
          (addr) =>
            addr.assetSymbol === balance.assetSymbol && addr.address !== null,
        );

        if (addressInfo) {
          acc.push({
            ...balance,
            network: addressInfo.network,
          });
        }
        return acc;
      },
      [] as ((typeof balances)[0] & { network: string })[],
    );
  }, [balances, depositAddresses]);
};
