import { useLogoutMutation } from "@/features/auth/api/authApi";
import { clearCredentials } from "@/features/auth/storage/authSlice";
import { showSuccessToast } from "@/shared/hooks/showToast";
import { baseApi } from "@/store/services/baseApi";
import {
  useDeleteDeviceMutation,
  useLazyGetDevicesQuery,
} from "@/store/services/devicesApi";
import { clearTokens, saveToken } from "@/utils/secureStore";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";

export function useLogout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();
  const [fetchDevices] = useLazyGetDevicesQuery();
  const [deleteDevice] = useDeleteDeviceMutation();

  const performLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // API call failed — logout must never get "stuck" here.
    } finally {
      // Best-effort: remove this device's registration.
      // Never let this block the rest of logout if it fails.
      try {
        const { data } = await fetchDevices().unwrap();
        const sorted = data?.length
          ? [...data].sort(
              (a, b) =>
                new Date(b.lastSeenAt).getTime() -
                new Date(a.lastSeenAt).getTime(),
            )
          : [];
        const currentDeviceId = sorted[0]?.id;
        if (currentDeviceId) {
          await deleteDevice(currentDeviceId).unwrap();
        }
      } catch {
        // Ignore — device bookkeeping is not worth failing logout over.
      }

      await clearTokens();
      await saveToken("SESSION_LOCKED", "false");
      dispatch(clearCredentials());
      dispatch(baseApi.util.resetApiState());

      showSuccessToast({ title: "Logged out successfully" });
      router.replace("/(auth)");
    }
  };

  return { performLogout, isLoading };
}
