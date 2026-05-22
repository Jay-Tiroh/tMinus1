import { useGetWalletQuery } from "@/store/services/walletsApi";

export default function useWallet() {
  const { data, isLoading, isError, isSuccess, refetch } = useGetWalletQuery();

  return { wallet: data, isLoading, isError, isSuccess, refetch };
}
