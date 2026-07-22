import { Colors } from "@/constants/Colors";
import { useStatusQuery } from "@/features/user/api/2faApi";
import { useGetDevicesQuery } from "@/features/user/api/devicesApi";
import useOtherSettings from "@/features/user/hooks/useOtherSettings";
import { useGoToRoute } from "@/shared/hooks/useGoToRoute";
import React from "react";

export const useSecuritySettings = () => {
  const setPin = useGoToRoute("/user/transaction-pin");
  const setup2fa = useGoToRoute("/user/two-factor/setup");
  const disable2fa = useGoToRoute("/user/two-factor/disable");
  const seeRecoveryCodes = useGoToRoute("/user/two-factor/recovery-codes");
  const seeDevices = useGoToRoute("/user/devices");

  const { data: devices } = useGetDevicesQuery();
  const activeDevice = React.useMemo(() => {
    if (!devices?.data?.length) return undefined;
    const sorted = [...devices.data].sort(
      (a, b) =>
        new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime(),
    );
    const mostRecentId = sorted[0].id;
    return devices?.data.find((device) => device.id === mostRecentId);
  }, [devices]);

  const devicePlatform =
    activeDevice?.platform === "android" ? "Android" : "iOS";
  const deviceCount = devices?.data?.length ?? 0;

  const {
    toggleBiometricSetting,
    settings,
    refetch: refetchSettings,
  } = useOtherSettings();
  const { data: twoFactorStatusData, refetch: refetchStatus } =
    useStatusQuery();

  const twoFactorEnabled = twoFactorStatusData?.twoFactorEnabled ?? false;
  const recoveryCodesRemaining = twoFactorStatusData?.recoveryCodesRemaining;
  const twoFactorStatus = twoFactorEnabled ? "On" : "Off";
  const biometricStatus = settings?.biometricEnabled ? "On" : "Off";
  const twoFactorAction = twoFactorEnabled ? disable2fa : setup2fa;

  const securityItems = [
    {
      title: "Transaction PIN",
      subtitle: "Required for trades and withdrawals",
      status: "Set",
      color: Colors.primaryClean,
      onPress: setPin,
      trailingTextColor: Colors.primaryClean,
    },
    {
      title: "Authenticator app",
      subtitle: "Enabled for login protection",
      status: twoFactorStatus,
      color: twoFactorEnabled ? Colors.primaryClean : Colors.loss,
      onPress: twoFactorAction,
      trailingTextColor: twoFactorEnabled ? Colors.primaryClean : Colors.loss,
    },
    {
      title: "Recovery codes",
      subtitle: `${recoveryCodesRemaining} backup codes remaining`,
      status:
        recoveryCodesRemaining && recoveryCodesRemaining <= 0
          ? "Regenerate"
          : "",
      color: Colors.primaryClean,
      onPress: seeRecoveryCodes,
      trailingTextColor: Colors.primaryClean,
    },
    {
      title: "Registered devices",
      subtitle: `${devicePlatform} • push enabled`,
      status: `${deviceCount}`,
      color: Colors.primaryClean,
      onPress: seeDevices,
      trailingTextColor: Colors.primaryClean,
    },
    {
      title: "Biometric login",
      subtitle: "Face ID enabled on this device",
      status: biometricStatus,
      color: settings?.biometricEnabled ? Colors.primaryClean : Colors.loss,
      onPress: toggleBiometricSetting,
      trailingTextColor: settings?.biometricEnabled
        ? Colors.primaryClean
        : Colors.loss,
    },
  ];

  const handleRefresh = () => {
    refetchSettings();
    refetchStatus();
  };

  return {
    securityItems,
    handleRefresh,
  };
};
