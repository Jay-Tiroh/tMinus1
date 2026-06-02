import Header from "@/components/kyc/Header";
import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { GeneralStyles } from "@/constants/themes";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import React from "react";
import { ImageBackground, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type HeaderProps = {
  title?: string;
  body?: string;
  stage?: number;
  onBackPress?: () => void;
  goBack?: boolean;
};

type TemplateProps = {
  children: React.ReactNode;
  headerProps: HeaderProps;
  ctaProps: React.ComponentProps<typeof ThemedButton>;
  ctaFooter?: React.ReactNode;
  topSpacerSize?: number;
};

const Template = ({
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
          paddingTop: topInset + 32,
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
            { gap: 14, flex: 1, justifyContent: "flex-end", marginTop: 48 },
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
