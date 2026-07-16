import { useInternalTransferMutation } from "@/features/wallets/api/walletsApi";
import useWallet from "@/features/wallets/hooks/useWallet";
import {
  addRecentContact,
  setLastTransfer,
} from "@/features/wallets/storage/walletsSlice";
import { showErrorToast, showInfoToast } from "@/hooks/showToast";
import { useAllAssets } from "@/hooks/useAllAssets";
import { useAppDispatch } from "@/store/hooks";
import { logger } from "@/utils/logger";
import { useMemo, useState } from "react";
import { TRANSFER_NETWORK_FEE_RATE } from "../constants/wallets.constants";

export const useTransferFlow = (onSuccess: () => void) => {
  const dispatch = useAppDispatch();
  const { balances } = useWallet();
  const { coins } = useAllAssets();

  const [internalTransfer, { isLoading: isSubmitting }] =
    useInternalTransferMutation();

  // State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [selectedAssetSymbol, setSelectedAssetSymbol] =
    useState<string>("USDT");
  const [isPickerVisible, setPickerVisible] = useState(false);

  const [isPinModalVisible, setPinModalVisible] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinAttempt, setPinAttempt] = useState(0);

  // Derived Values
  const parsedAmount = parseFloat(amount) || 0;

  const assetBalance = useMemo(() => {
    return (
      balances?.find((b) => b.assetSymbol === selectedAssetSymbol)?.available ||
      0
    );
  }, [balances, selectedAssetSymbol]);

  const assetDetails = useMemo(() => {
    return coins?.find((c) => c.symbol === selectedAssetSymbol);
  }, [coins, selectedAssetSymbol]);

  const fiatValue = parsedAmount * (assetDetails?.priceUsd || 0);
  const networkFee = parsedAmount * TRANSFER_NETWORK_FEE_RATE;
  const totalDeduction = parsedAmount + networkFee;
  const isInsufficient = totalDeduction > assetBalance;

  const availableAssets = useMemo(
    () => balances?.map((b) => b.assetSymbol) || [],
    [balances],
  );

  const isCtaDisabled = useMemo(() => {
    if (currentStep === 1) return recipient.trim().length < 3;
    if (currentStep === 2) return parsedAmount <= 0 || isInsufficient;
    return false;
  }, [currentStep, recipient, parsedAmount, isInsufficient]);

  // Actions
  const handleNext = () => {
    if (currentStep === 1) {
      if (!recipient.trim())
        return showInfoToast({ title: "Recipient required" });
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (parsedAmount <= 0)
        return showInfoToast({ title: "Enter a valid amount" });
      if (isInsufficient)
        return showErrorToast({ title: "Insufficient balance" });
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setPinError(null);
      setPinModalVisible(true);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleQuickAmount = (percentage: number) => {
    if (assetBalance <= 0) return;
    const calculatedAmount = (assetBalance * (percentage / 100)).toFixed(4);
    setAmount(calculatedAmount);
  };

  const executeTransfer = async (pin: string) => {
    setPinError(null);
    try {
      const result = await internalTransfer({
        assetSymbol: selectedAssetSymbol,
        amount: parsedAmount,
        recipient,
        pin,
      }).unwrap();

      dispatch(setLastTransfer(result));
      dispatch(addRecentContact({ address: recipient }));
      setPinModalVisible(false);
      onSuccess();
    } catch (error: any) {
      if (error?.data?.error?.code === "INVALID_PIN") {
        setPinError("Invalid pin. Check your PIN and try again.");
        setPinAttempt((n) => n + 1);
      } else {
        showErrorToast({
          title: "Transfer Error",
          message: error?.data?.error?.message,
        });
        setPinModalVisible(false);
      }
      logger.log(error);
    }
  };

  return {
    state: {
      currentStep,
      recipient,
      amount,
      parsedAmount,
      selectedAssetSymbol,
      isPickerVisible,
      isPinModalVisible,
      pinError,
      pinAttempt,
      isSubmitting,
      assetBalance,
      fiatValue,
      networkFee,
      totalDeduction,
      isInsufficient,
      availableAssets,
      isCtaDisabled,
    },
    actions: {
      setRecipient,
      setAmount,
      setSelectedAssetSymbol,
      setPickerVisible,
      setPinModalVisible,
      handleNext,
      handlePrev,
      handleQuickAmount,
      executeTransfer,
    },
  };
};
