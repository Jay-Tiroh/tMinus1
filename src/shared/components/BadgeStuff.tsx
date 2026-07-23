import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import React from "react";
import { View } from "react-native";

type BadgeStuffProps = {
  outerColor?: string;
  innerColor?: string;
  Icon?: React.FC;
  IconComponent?: React.ReactNode;
  title?: string;
  desc?: string;
};
const BadgeStuff = (props: BadgeStuffProps) => {
  const {
    outerColor = Colors.surfaceGreenDeep,
    innerColor = Colors.surfaceNavy,
    Icon,
    IconComponent,
    title,
    desc,
  } = props;
  return (
    <View
      style={{
        ...GeneralStyles.wrapper,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: outerColor + "2E",
          width: 150,
          height: 150,
          borderRadius: 75,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: innerColor,
            width: 94,
            height: 94,
            borderRadius: 47,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {Icon && <Icon />}
          {IconComponent && IconComponent}
        </View>
      </View>
      <Spacer size={19} />
      <TextBlock
        title={title}
        body={desc}
        titleStyle={{
          textAlign: "center",
          fontSize: 22,
        }}
        bodyStyle={{
          textAlign: "center",
          fontSize: 12,
          maxWidth: 286,
        }}
      />
    </View>
  );
};

export default BadgeStuff;
