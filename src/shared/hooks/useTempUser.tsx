import { useAppSelector } from "@/core/store/hooks";
import { TempUser } from "@/core/store/slices/userSlice";

export const useTempUser = () => {
  const user = useAppSelector((state) => state.tempUser.user);
  return (user || {}) as TempUser;
};
