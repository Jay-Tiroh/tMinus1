import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ButtonVariant } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Href, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { TextStyle, View, ViewStyle } from "react-native";
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
  content: React.FC;
  topSpacerSize: number;
};
const QuoteScreen = () => {
  const params = useLocalSearchParams<{ asset: string }>();
  const asset = params.asset;
  const goToExecute = useGoToRoute(
    ("/(tabs)/trades/" + asset + "/execute") as Href,
  );
  const Config: ConfigType[] = [
    {
      title: "Quote preview",
      body: "Confirm the rate before this quote expires.",
      cta: {
        title: "Confirm with PIN",
        onPress: () => {
          toggleConfig();
        },
        variant: "primary",
        style: undefined,
        textStyle: undefined,
      },
      content: Preview,
      topSpacerSize: 14,
    },

    {
      title: "Quote expired",
      body: "Rates moved. Request a fresh quote before trading.",
      cta: {
        title: "Get new quote",
        onPress: goToExecute,
        variant: "primary",
        style: { backgroundColor: Colors.warningAmber },
        textStyle: { color: Colors.backgroundInk },
      },
      content: Expired,
      topSpacerSize: 42,
    },
  ];
  const [activeConfigIndex, setActiveConfigIndex] = React.useState(0);
  const [activeConfig, setActiveConfig] = React.useState(
    Config[activeConfigIndex],
  );

  const toggleConfig = () => {
    setActiveConfigIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
  };
  useEffect(() => {
    setActiveConfig(Config[activeConfigIndex]);
  }, [activeConfigIndex]);

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
          ...activeConfig.cta.textStyle,
          fontFamily: Fonts.bold,
          fontSize: 14,
        },
      }}
      topSpacerSize={activeConfig.topSpacerSize}
    >
      <View style={GeneralStyles.wrapper}>
        <activeConfig.content />
      </View>
    </Template>
  );
};

const Preview = () => {
  const config = [
    { label: "Action", value: "Swap" },
    { label: "From", value: "250.00 USD" },
    { label: "To", value: "123,456.00 BTC" },
    { label: "Rate", value: "1 USD = 493.82 BTC" },
    { label: "Fee", value: "0.0005 BTC" },
    {
      label: "Estimated receive",
      value: "0.00384 BTC",
      valueColor: Colors.primaryClean,
    },
  ];

  return (
    <>
      <View
        style={{
          width: "100%",
          height: 86,
          backgroundColor: Colors.surfaceGreenDeep,
          borderRadius: 18,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        <ThemedText size={12} weight="medium" color={Colors.cloudGray}>
          Expires in
        </ThemedText>
        <ThemedText size={22} weight="bold" color={Colors.primaryClean}>
          00:30
        </ThemedText>
      </View>
      <Spacer size={32} />
      <View
        style={{
          gap: 10,
        }}
      >
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

const Expired = () => {
  const config = [
    { label: "Expired quote", value: "quote_abc123" },
    { label: "Previous receive", value: "0.00384 BTC" },
  ];
  return (
    <>
      <View
        style={{
          width: "100%",
          height: 238,
          backgroundColor: Colors.backgroundDark,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          gap: 30,
        }}
      >
        <View
          style={{
            width: 88,
            height: 88,
            backgroundColor: Colors.warningAmber + "2E",
            borderRadius: 44,
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
          titleStyle={{ fontSize: 19, textAlign: "center" }}
          bodyStyle={{ fontSize: 12, textAlign: "center", maxWidth: 290 }}
          body="Get a new quote so the rate, fee, and receive amount are current."
        />
      </View>
      <Spacer size={64} />
      <View
        style={{
          gap: 10,
        }}
      >
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
