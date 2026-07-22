import { GeneralStyles } from "@/constants/themes";
import { Spacer } from "@/shared/components/Spacer";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { useSafeBottom } from "@/shared/hooks/useSafeBottom";
import { vs } from "@/utils/responsive";
import React from "react";
import { ImageBackground, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header, HeaderProps } from "./Header";

type TemplateProps = {
  children: React.ReactNode;
  headerProps: HeaderProps;
  ctaProps: React.ComponentProps<typeof ThemedButton>;
  ctaFooter?: React.ReactNode;
  topSpacerSize?: number;
};

export const Template = ({
  children,
  headerProps,
  ctaProps,
  ctaFooter,
  topSpacerSize = 26,
}: TemplateProps) => {
  const topInset = useSafeAreaInsets().top;
  const bottomPadding = useSafeBottom();

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[GeneralStyles.container]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: topInset + vs(32),
          paddingBottom: bottomPadding,
          width: "100%",
          flexGrow: 1,
        }}
        scrollEventThrottle={16}
        style={{ width: "100%" }}
      >
        <Header {...headerProps} />
        <Spacer size={topSpacerSize} />

        {children}

        <View
          style={[
            GeneralStyles.wrapper,
            {
              gap: vs(14),
              flex: 1,
              justifyContent: "flex-end",
              marginTop: vs(48),
            },
          ]}
        >
          <ThemedButton {...ctaProps} />
          {ctaFooter}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Template;
