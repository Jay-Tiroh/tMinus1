import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import React from "react";
import { View } from "react-native";

const RecoveryCodesScreen = () => {
  const codes = [
    "CRT-2800",
    "CRT-2937",
    "CRT-3074",
    "CRT-3211",
    "CRT-3348",
    "CRT-3485",
    "CRT-3622",
    "CRT-3759",
  ];

  return (
    <Template
      textBlockProps={{
        title: "Recovery codes",
        body: "Save these once. Each code can only be used one time.",
      }}
      ctaProps={{
        title: "Regenerate codes",
        variant: "secondary",
        onPress: () => {},
      }}
      topSpacerSize={32}
    >
      <View style={GeneralStyles.wrapper}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
          }}
        >
          {codes.map((code, index) => (
            <View
              key={index}
              style={[
                GeneralStyles.box,
                {
                  width: "48%", // Two columns
                  height: 54,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <ThemedText size={14} weight="bold" color={Colors.white}>
                {code}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </Template>
  );
};

export default RecoveryCodesScreen;
