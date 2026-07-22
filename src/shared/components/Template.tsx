import { Spacer } from "@/shared/components/Spacer";
import TextBlock, { TextBlockProps } from "@/shared/components/TextBlock";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import React, { useCallback, useState } from "react";
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TemplateProps = {
  children: React.ReactNode;
  textBlockProps: TextBlockProps;
  ctaProps: React.ComponentProps<typeof ThemedButton> | undefined;
  ctaFooter?: React.ReactNode;
  topSpacerSize?: number;
  refetch?: () => void;
};

const Template = ({
  children,
  textBlockProps,
  ctaProps,
  ctaFooter,
  topSpacerSize = 26,
  refetch,
}: TemplateProps) => {
  const topInset = useSafeAreaInsets().top;
  const bottomPadding = useSafeBottom() + 50;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!refetch) return;
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

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
        {...(refetch
          ? {
              refreshControl: (
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={Colors.primary}
                  colors={[Colors.primary]}
                  progressBackgroundColor={Colors.backgroundDark}
                />
              ),
            }
          : {})}
      >
        <View style={GeneralStyles.wrapper}>
          <TextBlock {...textBlockProps} />
        </View>
        <Spacer size={topSpacerSize} />

        {children}

        {(ctaProps || ctaFooter) && (
          <View
            style={[
              GeneralStyles.wrapper,
              { gap: 14, flex: 1, justifyContent: "center" },
            ]}
          >
            {ctaProps && <ThemedButton {...ctaProps} />}
            {ctaFooter}
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default Template;
