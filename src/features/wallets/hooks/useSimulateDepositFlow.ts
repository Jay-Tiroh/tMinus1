import { useAppDispatch } from "@/core/store/hooks";
import { useSimulateDepositMutation } from "@/features/wallets/api/walletsApi";
import { setLastDeposit } from "@/features/wallets/store/walletsSlice";
import { showErrorToast } from "@/shared/hooks/showToast";
import { getErrorMessage } from "@/shared/utils/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
  SimulateDepositFormValues,
  simulateDepositSchema,
} from "../validation/simulateDeposit.schema";

export const useSimulateDepositFlow = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [simulateDeposit, { isLoading, isSuccess }] =
    useSimulateDepositMutation();

  const form = useForm<SimulateDepositFormValues>({
    resolver: zodResolver(simulateDepositSchema),
    mode: "onChange",
    defaultValues: { amount: "200", delay: "5" },
  });

  const onSubmit = async (data: SimulateDepositFormValues) => {
    try {
      const result = await simulateDeposit({
        amount: Number(data.amount),
        settlementDelaySeconds: Number(data.delay),
      }).unwrap();

      dispatch(setLastDeposit(result));
      router.replace("/wallets/success");
    } catch (error) {
      showErrorToast({
        title: "Failed to create sandbox deposit",
        message: getErrorMessage(error),
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: isLoading || isSuccess,
    amountPreview: form.watch("amount"),
  };
};
