import { useAllAssets } from "@/features/markets";
import useWallet from "@/features/wallets/hooks/useWallet";
import { setWithdrawalDraft } from "@/features/wallets/storage/walletsSlice";
import { useGoToRoute } from "@/shared/hooks/useGoToRoute";
import { useAppDispatch } from "@/store/hooks";
import { useCallback, useMemo, useState } from "react";

export const useWithdrawFormFlow = () => {
  const { balances, verification } = useWallet();
  const { coins } = useAllAssets();
  const dispatch = useAppDispatch();
  const toConfirmation = useGoToRoute(
    "/wallets/withdraw/withdraw-confirmation",
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const availableAssets = useMemo(
    () => balances?.map((b) => b.assetSymbol) || [],
    [balances],
  );

  const currentAsset = useMemo(() => {
    return coins.find((asset) => asset.symbol === selectedAssetSymbol);
  }, [coins, selectedAssetSymbol]);

  const currentBalance = useMemo(() => {
    return (
      balances?.find((b) => b.assetSymbol === selectedAssetSymbol)?.available ||
      0
    );
  }, [balances, selectedAssetSymbol]);

  const network = currentAsset?.network || "Select asset first";
  const withdrawalLimit = verification?.limits?.withdrawalPerTransactionUsd;
  const dailyLimit = verification?.limits?.dailyWithdrawalUsd;

  const handleSubmit = useCallback(() => {
    setError(null);
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (numericAmount > currentBalance) {
      setError("Insufficient balance.");
      return;
    }
    if (!address.trim()) {
      setError("Enter or select a destination address.");
      return;
    }
    if (network === "Select asset first") {
      setError("Select an asset first.");
      return;
    }

    dispatch(
      setWithdrawalDraft({
        assetSymbol: selectedAssetSymbol,
        amount: numericAmount,
        address,
        network,
      }),
    );

    toConfirmation();
  }, [
    amount,
    currentBalance,
    address,
    network,
    selectedAssetSymbol,
    dispatch,
    toConfirmation,
  ]);

  return {
    state: {
      modalVisible,
      selectedAssetSymbol,
      amount,
      address,
      error,
      availableAssets,
      currentBalance,
      network,
      withdrawalLimit,
      dailyLimit,
    },
    actions: {
      setModalVisible,
      setSelectedAssetSymbol,
      setAmount,
      setAddress,
      handleSubmit,
    },
  };
};
