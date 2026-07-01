import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import useOtherSettings from "@/hooks/useOtherSettings";
import { useStatusQuery } from "@/store/services/2faApi";
import { useGetDevicesQuery } from "@/store/services/devicesApi";
import React from "react";
import { View } from "react-native";
import { ListItem } from "./ProfileScreen"; // Assuming exported from above

const SecuritySettingsScreen = () => {
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
          : ``,
      color: Colors.primaryClean,
      onPress: seeRecoveryCodes,
      trailingTextColor: Colors.primaryClean,
    },
    {
      title: "Registered devices",
      subtitle: devicePlatform + " • push enabled",
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
  return (
    <Template
      textBlockProps={{
        title: "Security",
        body: "Protect account access and sensitive actions.",
      }}
      ctaProps={undefined}
      topSpacerSize={32}
      refetch={handleRefresh}
    >
      <View style={GeneralStyles.wrapper}>
        <View style={{ gap: 12 }}>
          {securityItems.map((item, index) => (
            <ListItem
              key={index}
              title={item.title}
              subtitle={item.subtitle}
              trailingText={item.status}
              iconColor={item.color}
              onPress={item.onPress}
              trailingTextColor={item.color}
            />
          ))}
        </View>

        <Spacer size={32} />

        {/* Info Box */}
        <View
          style={[
            GeneralStyles.box,
            {
              backgroundColor: Colors.surfaceGreenBrown,
              padding: 24,
              gap: 8,
            },
          ]}
        >
          <ThemedText size={16} weight="bold" color={Colors.snowGray}>
            Admin will never ask for codes
          </ThemedText>
          <ThemedText size={14} color={Colors.warningBronze}>
            Keep recovery codes private and regenerate them if exposed.
          </ThemedText>
        </View>
      </View>
    </Template>
  );
};

export default SecuritySettingsScreen;
