import { LabelValueItem } from "@/components/LabelValueItem";

import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ButtonVariant } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useAssetRoute } from "@/hooks/useAssetRoute";
import useTrade from "@/hooks/useTrade";
import { ms, s, vs } from "@/utils/responsive";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import React, { useEffect, useState } from "react";
import { ActivityIndicator, TextStyle, View, ViewStyle } from "react-native";

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


const QuoteScreen = () => {
  const { replace } = useAssetRoute();
  const {
    activeQuote,
    isQuoteExpired,
    timeRemainingSeconds,
    clearActiveQuote,
    createQuote,
    lastQuoteRequest,
  } = useTrade();

  const [localTimeLeft, setLocalTimeLeft] = useState(timeRemainingSeconds);

  useEffect(() => {
    setLocalTimeLeft(timeRemainingSeconds);
  }, [timeRemainingSeconds]);

  useEffect(() => {
    if (localTimeLeft <= 0 || isQuoteExpired) return;
    const timer = setInterval(() => {
      setLocalTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [localTimeLeft, isQuoteExpired]);

  if (!activeQuote) {
    return (
      <View
        style={[GeneralStyles.wrapper, { flex: 1, justifyContent: "center" }]}
      >
        <ActivityIndicator size="large" color={Colors.primaryClean} />
      </View>
    );
  }

  const isExpired = isQuoteExpired || localTimeLeft === 0;

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
        content: <Expired quote={activeQuote} />,
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
        content: <Preview quote={activeQuote} timeLeft={localTimeLeft} />,
        topSpacerSize: 14,
      };

  return (
    <Template
      textBlockProps={{
        title: activeConfig.title,
        body: activeConfig.body,
      }}
      ctaProps={{
        title: activeConfig.cta.title,
        onPress: activeConfig.cta.onPress,
        variant: activeConfig.cta.variant,
        style: activeConfig.cta.style,
        textStyle: {
          fontFamily: Fonts.bold,
          fontSize: ms(14),
        },
      }}
      topSpacerSize={activeConfig.topSpacerSize}
    >
      <View style={GeneralStyles.wrapper}>{activeConfig.content}</View>
    </Template>
  );
};

// --- Sub-components ---

const Preview = ({ quote, timeLeft }: { quote: any; timeLeft: number }) => {
  const formattedTime = `00:${timeLeft.toString().padStart(2, "0")}`;

  const config = [
    {
      label: "Action",
      value: quote.type.charAt(0).toUpperCase() + quote.type.slice(1),
    },
    { label: "From", value: `${quote.fromAmount} ${quote.fromAsset}` },
    { label: "To", value: `${quote.toAmount} ${quote.toAsset}` },
    {
      label: "Rate",
      value: `1 ${quote.fromAsset} = ${quote.rate} ${quote.toAsset}`,
    },
    { label: "Fee", value: `${quote.feeAmount} ${quote.fromAsset}` },
    {
      label: "Estimated receive",
      value: `${quote.toAmount} ${quote.toAsset}`,
      valueColor: Colors.primaryClean,
    },
  ];

  return (
    <>
      <View
        style={{
          width: "100%",
          height: vs(86),
          backgroundColor: Colors.surfaceGreenDeep,
          borderRadius: ms(18),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: s(20),
        }}
      >
        <ThemedText size={12} weight="medium" color={Colors.cloudGray}>
          Expires in
        </ThemedText>
        <ThemedText size={22} weight="bold" color={Colors.primaryClean}>
          {formattedTime}
        </ThemedText>
      </View>
      <Spacer size={32} />
      <View style={{ gap: vs(10) }}>
        {config.map((item) => (
          <LabelValueItem
            key={item.label}
            label={item.label}
            value={item.value}
            valueWeight="medium"
            valueSize={12}
            valueColor={item.valueColor}
          />
        ))}
      </View>
    </>
  );
};

const Expired = ({ quote }: { quote: any }) => {
  const config = [
    { label: "Expired quote", value: quote.id },
    { label: "Previous receive", value: `${quote.toAmount} ${quote.toAsset}` },
  ];

  return (
    <>
      <View
        style={{
          width: "100%",
          height: vs(238),
          backgroundColor: Colors.backgroundDark,
          borderRadius: ms(22),
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: s(20),
          gap: vs(30),
        }}
      >
        <View
          style={{
            width: s(88),
            height: vs(88),
            backgroundColor: Colors.warningAmber + "2E",
            borderRadius: ms(44),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome5
            name="exclamation"
            size={35}
            color={Colors.warningAmber}
          />
        </View>
        <TextBlock
          title="This quote is no longer valid"
          titleStyle={{ fontSize: ms(19), textAlign: "center" }}
          bodyStyle={{
            fontSize: ms(12),
            textAlign: "center",
            maxWidth: s(290),
          }}
          body="Get a new quote so the rate, fee, and receive amount are current."
        />
      </View>
      <Spacer size={64} />
      <View style={{ gap: vs(10) }}>
        {config.map((item) => (
          <LabelValueItem
            key={item.label}
            label={item.label}
            value={item.value}
            valueWeight="medium"
            valueSize={12}
          />
        ))}
      </View>
    </>
  );
};

export default QuoteScreen;
