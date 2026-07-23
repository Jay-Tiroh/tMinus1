import { GeneralStyles } from "@/constants/themes";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import React from "react";
import { View } from "react-native";
import { ListItem } from "../components/ListItem";
import { useSecuritySettings } from "../hooks/useSecuritySettings";

const SecuritySettingsScreen = () => {
  const { securityItems, handleRefresh } = useSecuritySettings();

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
      </View>
    </Template>
  );
};

export default SecuritySettingsScreen;
