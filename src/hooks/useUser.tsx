import { useAppSelector } from "@/store/hooks";
import { User } from "@/types/user";

export const useUser = () => {
  const user = useAppSelector((state) => state.auth.user);
  return (user || {}) as User;
};
