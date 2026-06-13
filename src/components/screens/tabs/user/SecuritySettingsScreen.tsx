import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import React from "react";
import { View } from "react-native";
import { ListItem } from "./ProfileScreen"; // Assuming exported from above

const SecuritySettingsScreen = () => {
  const setPin = useGoToRoute("/user/transaction-pin");
  const seeRecoveryCodes = useGoToRoute("/user/recovery-codes");
  const securityItems = [
    {
      title: "Transaction PIN",
      subtitle: "Required for trades and withdrawals",
      status: "Set",
      color: Colors.primaryClean,
      onPress: setPin,
    },
    {
      title: "Authenticator app",
      subtitle: "Enabled for login protection",
      status: "On",
      color: Colors.primaryClean,
    },
    {
      title: "Recovery codes",
      subtitle: "8 backup codes remaining",
      status: "View",
      color: Colors.primaryClean,
      onPress: seeRecoveryCodes,
    },
    {
      title: "Registered devices",
      subtitle: "iPhone 15 Pro • push enabled",
      status: "2",
      color: Colors.primaryClean,
    },
    {
      title: "Biometric login",
      subtitle: "Face ID enabled on this device",
      status: "On",
      color: Colors.primaryClean,
    },
  ];

  return (
    <Template
      textBlockProps={{
        title: "Security",
        body: "Protect account access and sensitive actions.",
      }}
      ctaProps={undefined}
      topSpacerSize={32}
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
