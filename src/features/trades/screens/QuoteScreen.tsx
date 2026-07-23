import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useAssetRoute } from "@/features/trades/hooks/useAssetRoute";
import Template from "@/shared/components/Template";
import { ButtonVariant } from "@/shared/components/ThemedButton";
import { ms } from "@/shared/utils/responsive";
import React from "react";
import { ActivityIndicator, TextStyle, View, ViewStyle } from "react-native";
import useTrade from "../hooks/useTrade";

// Import new boundary dependencies
import { QuoteExpired, QuotePreview } from "../components/QuoteBlocks";
import { useQuoteTimer } from "../hooks/useQuoteTimer";

export type ConfigType = {
  title: string;
  body: string;
  cta: {
    title: string;
    onPress: () => void;
    variant: ButtonVariant;
    style?: ViewStyle;
    textStyle?: TextStyle;
  };
  content: React.ReactNode;
  topSpacerSize: number;
};

export const QuoteScreen = () => {
  const { replace } = useAssetRoute();
  const {
    activeQuote,
    isQuoteExpired,
    timeRemainingSeconds,
    clearActiveQuote,
    createQuote,
    lastQuoteRequest,
  } = useTrade();

  const { localTimeLeft, isExpired } = useQuoteTimer(
    timeRemainingSeconds,
    isQuoteExpired,
  );

  if (!activeQuote) {
    return (
      <View
        style={[GeneralStyles.wrapper, { flex: 1, justifyContent: "center" }]}
      >
        <ActivityIndicator size="large" color={Colors.primaryClean} />
      </View>
    );
  }

  const activeConfig: ConfigType = isExpired
    ? {
        title: "Quote expired",
        body: "Rates moved. Request a fresh quote before trading.",
        cta: {
          title: "Get new quote",
          onPress: async () => {
            clearActiveQuote();
            if (lastQuoteRequest) {
              await createQuote(lastQuoteRequest);
            }
          },
          variant: "primary",
          style: { backgroundColor: Colors.warningAmber },
          textStyle: { color: Colors.backgroundInk },
        },
        content: <QuoteExpired quote={activeQuote} />,
        topSpacerSize: 42,
      }
    : {
        title: "Quote preview",
        body: "Confirm the rate before this quote expires.",
        cta: {
          title: "Confirm with PIN",
          onPress: () => replace("execute"),
          variant: "primary",
        },
        content: <QuotePreview quote={activeQuote} timeLeft={localTimeLeft} />,
        topSpacerSize: 14,
      };

  return (
    <Template
      textBlockProps={{ title: activeConfig.title, body: activeConfig.body }}
      ctaProps={{
        title: activeConfig.cta.title,
        onPress: activeConfig.cta.onPress,
        variant: activeConfig.cta.variant,
        style: activeConfig.cta.style,
        textStyle: { fontFamily: Fonts.bold, fontSize: ms(14) },
      }}
      topSpacerSize={activeConfig.topSpacerSize}
    >
      <View style={GeneralStyles.wrapper}>{activeConfig.content}</View>
    </Template>
  );
};
