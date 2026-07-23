import {
  useDeleteDeviceMutation,
  useGetDevicesQuery,
} from "@/features/user/api/devicesApi";
import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";
import { useMemo, useState } from "react";
import { DisplayDevice, toDisplayDevice } from "../utils/deviceMappers";

export const useDevices = () => {
  const { data, isLoading } = useGetDevicesQuery();
  const [deleteDevice, { isLoading: isDeleting }] = useDeleteDeviceMutation();
  const [deviceToDelete, setDeviceToDelete] = useState<DisplayDevice | null>(
    null,
  );

  const devices = useMemo(() => {
    if (!data?.data?.length) return [];
    const sorted = [...data.data].sort(
      (a, b) =>
        new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime(),
    );
    const mostRecentId = sorted[0].id;
    return sorted.map((d) => toDisplayDevice(d, mostRecentId));
  }, [data]);

  const handleConfirmDelete = async () => {
    if (!deviceToDelete) return;

    try {
      await deleteDevice(deviceToDelete.id).unwrap();
      showSuccessToast({
        title: "Device Removed",
        message: `${deviceToDelete.name} has been signed out.`,
      });
    } catch {
      showErrorToast({
        title: "Failed to remove",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setDeviceToDelete(null);
    }
  };

  return {
    devices,
    isLoading,
    isDeleting,
    deviceToDelete,
    setDeviceToDelete,
    handleConfirmDelete,
  };
};
