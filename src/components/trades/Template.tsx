import { Spacer } from "@/components/Spacer";
import TextBlock, { TextBlockProps } from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { GeneralStyles } from "@/constants/themes";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import React from "react";
import { ImageBackground, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TemplateProps = {
  children: React.ReactNode;
  textBlockProps: TextBlockProps;
  ctaProps: React.ComponentProps<typeof ThemedButton> | undefined;
  ctaFooter?: React.ReactNode;
  topSpacerSize?: number;
};

const Template = ({
  children,
  textBlockProps,
  ctaProps,
  ctaFooter,
  topSpacerSize = 26,
}: TemplateProps) => {
  const topInset = useSafeAreaInsets().top;
  const bottomPadding = useSafeBottom() + 50;

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[GeneralStyles.container]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: topInset + 24,
          paddingBottom: bottomPadding,
          width: "100%",
          flexGrow: 1,
        }}
        scrollEventThrottle={16}
        style={{ width: "100%" }}
      >
        <View style={GeneralStyles.wrapper}>
          <TextBlock {...textBlockProps} />
        </View>

        <Spacer size={topSpacerSize} />

        {children}

        {ctaProps && (
          <View
            style={[
              GeneralStyles.wrapper,
              { gap: 14, flex: 1, justifyContent: "center" },
            ]}
          >
            <ThemedButton {...ctaProps} />
            {ctaFooter}
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default Template;
