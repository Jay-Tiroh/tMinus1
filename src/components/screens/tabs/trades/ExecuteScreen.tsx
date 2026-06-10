import BadgeStuff from "@/components/BadgeStuff";
import { LabelValueItem } from "@/components/LabelValueItem";
import { ConfigType } from "@/components/screens/tabs/trades/QuoteScreen";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import TransactionPinInput from "@/components/trades/TransactionPinInput";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Href, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

const ExecuteScreen = () => {
  const params = useLocalSearchParams<{ asset: string }>();
  const asset = params.asset;
  const goToAlert = useGoToRoute(
    ("/(tabs)/trades/" + asset + "/alert") as Href,
  );
  const Config: ConfigType[] = [
    {
      title: "Confirm trade",
      body: "Enter your transaction PIN to execute this quote.",
      cta: {
        title: "Execute trade",
        onPress: () => {
          toggleConfig();
        },
        variant: "primary",
        style: undefined,
        textStyle: undefined,
      },
      content: Confirm,
      topSpacerSize: 42,
    },

    {
      title: "Trade completed",
      body: "Your sandbox trade has settled successfully.",
      cta: {
        title: "View transaction",
        onPress: () => {
          toggleConfig();
        },
        variant: "primary",
        style: undefined,
        textStyle: undefined,
      },
      content: Completed,
      topSpacerSize: 42,
    },

    {
      title: "Trade failed",
      body: "The trade could not be completed.",
      cta: {
        title: "Edit amount",
        onPress: goToAlert,
        variant: "red",
        style: undefined,
        textStyle: undefined,
      },
      content: Failed,
      topSpacerSize: 42,
    },
  ];

  const [activeConfigIndex, setActiveConfigIndex] = React.useState(0);
  const [activeConfig, setActiveConfig] = React.useState(
    Config[activeConfigIndex],
  );

  const toggleConfig = () => {
    if (activeConfigIndex === 2) {
      setActiveConfigIndex(0);
    } else {
      setActiveConfigIndex((prev) => prev + 1);
    }
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

const Confirm = () => {
  const handlePinComplete = (pin: string) => {
    console.log("PIN entered:", pin);
    // fire your submit / verify mutation here
  };

  return (
    <>
      <View
        style={{
          ...GeneralStyles.box,
          borderRadius: 20,
          height: 150,
          justifyContent: "center",
          paddingHorizontal: 24,
          gap: 12,
        }}
      >
        <ThemedText color={Colors.snowGray} size={17} weight="bold">
          Buy BTC
        </ThemedText>
        <ThemedText color={Colors.textMidGray} size={14}>
          250.00 USDT → 0.00384 BTC
        </ThemedText>
        <ThemedText color={Colors.textMidGray} size={12}>
          Fee 2.50 USDT
        </ThemedText>
      </View>

      <Spacer size={52} />

      <View style={{ alignItems: "center" }}>
        <ThemedText color={Colors.snowGray} size={15} weight="bold">
          Transaction PIN
        </ThemedText>
      </View>

      <Spacer size={28} />

      <TransactionPinInput onComplete={handlePinComplete} />
      <Spacer size={50} />
      <View
        style={{
          ...GeneralStyles.box,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          maxWidth: 300,
          height: 70,
          marginInline: "auto",
        }}
      >
        <ThemedText
          color={Colors.textMidGray}
          size={12}
          style={{
            textAlign: "center",
          }}
        >
          The API executes only after POST /trade/execute with quoteId and PIN.
        </ThemedText>
      </View>
      <Spacer size={54} />
    </>
  );
};
const Completed = () => {
  const config = [
    { label: "Reference", value: "Swap" },
    { label: "Paid", value: "250.00 USD" },
    { label: "Received", value: "123,456.00 BTC" },
    { label: "Fee", value: "1 USD = 493.82 BTC" },
    {
      label: "Status",
      value: "Completed",
      valueColor: Colors.primaryClean,
    },
  ];
  return (
    <>
      <BadgeStuff
        title="0.00384 BTC received"
        outerColor={Colors.primaryClean}
        innerColor={Colors.primaryClean}
        IconComponent={
          <FontAwesome5 name="check" size={42} color={Colors.backgroundInk} />
        }
      />
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
            valueColor={item.valueColor}
          />
        ))}
      </View>
    </>
  );
};
const Failed = () => {
  const config = [
    { label: "Received", value: "123,456.00 BTC" },
    {
      label: "Available",
      value: "1 USD = 493.82 BTC",
      valueColor: Colors.lossBright,
    },
    {
      label: "Status",
      value: "Failed",
      valueColor: Colors.lossBright,
    },
  ];
  return (
    <>
      <BadgeStuff
        title="Insufficient balance"
        desc="Your available USDT balance changed before the quote was executed."
        outerColor={Colors.lossBright}
        IconComponent={
          <FontAwesome6 name="xmark" size={42} color={Colors.lossBright} />
        }
      />
      <Spacer size={56} />
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
            valueColor={item.valueColor}
          />
        ))}
      </View>
    </>
  );
};

export default ExecuteScreen;
