import { useAppSelector } from "@/store/hooks";
import { TempUser } from "@/store/slices/userSlice";

export const useTempUser = () => {
  const user = useAppSelector((state) => state.tempUser.user);
  return (user || {}) as TempUser;
};
