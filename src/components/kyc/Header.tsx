import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import Entypo from "@expo/vector-icons/Entypo";
import React, { useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
type HeaderProps = {
  title?: string;
  body?: string;
  stage?: number;
  onBackPress?: () => void;
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

const Header = ({
  title = "Verify to unlock limits",
  body = "Complete identity verification from inside the app before high-value trading or withdrawals.",
  stage = 0,
  onBackPress,
}: HeaderProps) => {
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
          { flexDirection: "row", alignItems: "flex-start", gap: 20 },
        ]}
      >
        <Pressable
          style={[
            GeneralStyles.box,
            {
              width: 32,
              height: 32,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
          onPress={onBackPress}
        >
          <Entypo name="chevron-left" size={20} color={Colors.snowGray} />
        </Pressable>
        <TextBlock
          title={title}
          body={body}
          titleStyle={{
            fontSize: 18,
          }}
          bodyStyle={{
            fontSize: 12,
            maxWidth: 280,
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
              minWidth: itemWidth,
              alignItems: "center",
              gap: 8,
              zIndex: 1,
            }}
          >
            <View
              style={[
                GeneralStyles.box,
                {
                  width: circleDiameter,
                  height: circleDiameter,
                  borderRadius: 16,
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
            height: 2,
            position: "absolute",
            width: width,
            top: verticalOffset,
            left: horizontalOffset,
          }}
        />
        <View
          style={{
            backgroundColor:
              stage === 3 ? Colors.primaryClean : Colors.surfaceNavy,
            height: 2,
            position: "absolute",
            width: width,
            top: verticalOffset,
            right: horizontalOffset,
          }}
        />
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
