import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedText } from "@/shared/components/ThemedText";
import { ms, s, vs } from "@/shared/utils/responsive";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";

export type HeaderProps = {
  title?: string;
  body?: string;
  stage?: number;
  onBackPress?: () => void;
  goBack?: boolean;
};

const Stages = [
  {
    label: "Identity",
    number: 1,
  },
  {
    label: "Document",
    number: 2,
  },
  {
    label: "Review",
    number: 3,
  },
];

export const Header = ({
  title = "Verify to unlock limits",
  body = "Complete identity verification from inside the app before high-value trading or withdrawals.",
  stage = 0,
  onBackPress,
  goBack = false,
}: HeaderProps) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (goBack) {
      router.back();
    }
    if (onBackPress) {
      onBackPress();
    }
  };

  const [componentWidth, setComponentWidth] = useState<number>(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setComponentWidth(event.nativeEvent.layout.width);
  };

  const width = (componentWidth - 58) * 0.45;
  const itemWidth = 84;
  const circleDiameter = 26;
  const horizontalOffset = itemWidth / 2 + 24;
  const verticalOffset = circleDiameter / 2;

  return (
    <>
      <View
        style={[
          GeneralStyles.wrapper,
          { flexDirection: "row", alignItems: "flex-start", gap: s(20) },
        ]}
      >
        <Pressable
          style={[
            GeneralStyles.box,
            {
              width: s(32),
              height: vs(32),
              borderRadius: ms(16),
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
          onPress={handleBackPress}
        >
          <Entypo name="chevron-left" size={20} color={Colors.snowGray} />
        </Pressable>
        <TextBlock
          title={title}
          body={body}
          titleStyle={{
            fontSize: ms(18),
          }}
          bodyStyle={{
            fontSize: ms(12),
            maxWidth: s(280),
          }}
        />
      </View>
      <Spacer size={24} />
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          },
          GeneralStyles.wrapper,
        ]}
        onLayout={handleLayout}
      >
        {Stages.map((item) => (
          <View
            key={item.label}
            style={{
              minWidth: s(itemWidth),
              alignItems: "center",
              gap: vs(8),
              zIndex: 1,
            }}
          >
            <View
              style={[
                GeneralStyles.box,
                {
                  width: s(circleDiameter),
                  height: vs(circleDiameter),
                  borderRadius: ms(16),
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor:
                    stage >= item.number
                      ? Colors.primaryClean
                      : Colors.surfaceNavy,
                },
              ]}
            >
              <ThemedText
                color={
                  stage >= item.number
                    ? Colors.backgroundInk
                    : Colors.textMidGray
                }
                size={12}
                weight="bold"
              >
                {item.number}
              </ThemedText>
            </View>
            <ThemedText
              color={
                stage >= item.number ? Colors.snowGray : Colors.textMidGray
              }
              size={12}
            >
              {item.label}
            </ThemedText>
          </View>
        ))}

        <View
          style={{
            backgroundColor:
              stage >= 2 ? Colors.primaryClean : Colors.surfaceNavy,
            height: vs(2),
            position: "absolute",
            width: width,
            top: vs(verticalOffset),
            left: s(horizontalOffset),
          }}
        />
        <View
          style={{
            backgroundColor:
              stage === 3 ? Colors.primaryClean : Colors.surfaceNavy,
            height: vs(2),
            position: "absolute",
            width: width,
            top: vs(verticalOffset),
            right: s(horizontalOffset),
          }}
        />
      </View>
    </>
  );
};

export default Header;
