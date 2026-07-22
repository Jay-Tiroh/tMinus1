import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useKyc } from "@/features/kyc/hooks/useKyc";
import BadgeStuff from "@/shared/components/BadgeStuff";
import { LabelValueItem } from "@/shared/components/LabelValueItem";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { ms, vs } from "@/utils/responsive";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { View } from "react-native";

export const Failed = () => {
  const { verification } = useKyc();

  const config = [
    {
      label: "Current level",
      value: verification?.level ?? "Starter",
    },
  ];

  return (
    <View>
      <Spacer size={12} />
      <BadgeStuff
        IconComponent={
          <FontAwesome5
            name="exclamation"
            color={Colors.lossBright}
            size={48}
          />
        }
        outerColor={Colors.lossBright}
        title="Try Again"
      />

      <Spacer size={52} />
      <View style={GeneralStyles.wrapper}>
        <View
          style={[
            GeneralStyles.box,
            {
              padding: ms(16),
            },
          ]}
        >
          <TextBlock
            title="Reason"
            titleStyle={{
              color: Colors.textMidGray,
              fontSize: ms(11),
              fontFamily: Fonts.regular,
            }}
            body="Document photo was blurry. Upload a clearer image with all corners visible."
            bodyStyle={{ color: Colors.snowGray, fontSize: ms(13) }}
          />
        </View>
      </View>
      <Spacer size={44} />
      <View
        style={{
          ...GeneralStyles.wrapper,
          gap: vs(14),
        }}
      >
        {config.map((item) => (
          <LabelValueItem
            key={item.label}
            label={item.label}
            value={item.value as string}
          />
        ))}
      </View>
    </View>
  );
};

export default Failed;
