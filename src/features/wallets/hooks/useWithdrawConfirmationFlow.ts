import { useAppDispatch, useAppSelector } from "@/core/store/hooks";
import { useRequestWithdrawalMutation } from "@/features/wallets/api/walletsApi";
import {
  clearWithdrawalDraft,
  setLastWithdrawal,
} from "@/features/wallets/storage/walletsSlice";
import { showErrorToast } from "@/shared/hooks/showToast";
import { useGoToRoute } from "@/shared/hooks/useGoToRoute";
import { logger } from "@/shared/utils/logger";
import { useRouter } from "expo-router";

export const useWithdrawConfirmationFlow = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toSuccess = useGoToRoute("/wallets/success?type=withdrawal");
  const draft = useAppSelector((s) => s.wallets.withdrawalDraft);
  const [requestWithdrawal, { isLoading }] = useRequestWithdrawalMutation();

  const handleConfirmWithdrawal = async () => {
    if (!draft) return;
    try {
      const result = await requestWithdrawal(draft).unwrap();
      dispatch(setLastWithdrawal(result));
      dispatch(clearWithdrawalDraft());
      toSuccess();
    } catch (e) {
      logger.error("Withdrawal failed:", e);
      showErrorToast({
        title: "Withdrawal failed",
        message: (e as any)?.data?.error?.message || "Please try again.",
      });
    }
  };

  const handleCancel = () => {
    router.replace("/wallets/withdraw/withdraw-form");
  };

  return {
    draft,
    isLoading,
    handleConfirmWithdrawal,
    handleCancel,
  };
};
