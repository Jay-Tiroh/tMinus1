import BadgeStuff from "@/components/BadgeStuff";
import { CryptoIcon } from "@/components/CryptoIcon";
import { LabelValueItem } from "@/components/LabelValueItem";
import { ConfigType } from "@/components/screens/tabs/trades/QuoteScreen";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Href, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";

const AlertScreen = () => {
  const params = useLocalSearchParams<{ asset: string }>();
  const asset = params.asset;
  const goToExecute = useGoToRoute(
    ("/(tabs)/trades/" + asset + "/execute") as Href,
  );
  const Config: ConfigType[] = [
    {
      title: "Create price alert",
      body: "Get notified when BTC crosses your target.",
      cta: {
        title: "Create alert",
        onPress: () => {
          toggleConfig();
        },
        variant: "primary",
        style: undefined,
        textStyle: undefined,
      },
      content: CreateAlert,
      topSpacerSize: 42,
    },

    {
      title: "Alert created",
      body: "We will notify you when the target is reached.",
      cta: {
        title: "View alerts",
        onPress: () => {
          toggleConfig();
        },
        variant: "primary",
        style: undefined,
        textStyle: undefined,
      },
      content: Success,
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

type Direction = "Above" | "Below";
const CreateAlert = () => {
  const params = useLocalSearchParams<{ asset: string }>();
  const asset = params.asset;
  const [activeDirection, setActiveDirection] =
    React.useState<Direction>("Above");
  const handleTabPress = (title: Direction) => {
    setActiveDirection(title);
  };
  const config = [
    {
      label: "Trigger",
      value: `BTC ${activeDirection.toLowerCase()} $72,000`,
    },
    {
      label: "Status",
      value: "Active after creation",
      valueColor: Colors.primaryClean,
    },
  ];

  const tabs = [
    {
      title: "Above",
      bgColor: Colors.primaryClean,
      color: Colors.backgroundInk,
    },
    { title: "Below", bgColor: Colors.lossBright, color: Colors.snowGray },
  ];

  return (
    <>
      <View
        style={{
          ...GeneralStyles.box,
          height: 92,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <CryptoIcon symbol={asset} size={42} />
          <TextBlock title={asset.toUpperCase()} body="Bitcoin" />
        </View>
        <ThemedText size={14} color={Colors.snowGray} weight="bold">
          $64,200.50
        </ThemedText>
      </View>
      <Spacer size={46} />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {tabs.map((item) => (
          <TouchableOpacity
            key={item.title}
            onPress={() => handleTabPress(item.title as Direction)}
            style={[
              GeneralStyles.box,
              {
                borderRadius: 18,
                backgroundColor:
                  activeDirection === item.title
                    ? item.bgColor
                    : Colors.surfaceNavy,
                width: 80,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <ThemedText
              color={
                activeDirection === item.title ? item.color : Colors.snowGray
              }
              size={12}
              weight={"medium"}
            >
              {item.title}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <Spacer size={34} />

      <View
        style={{
          ...GeneralStyles.box,
          height: 92,
          paddingHorizontal: 16,
          paddingVertical: 16,
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",

          gap: 12,
        }}
      >
        <View
          style={{ justifyContent: "space-between", gap: 12, height: "100%" }}
        >
          <ThemedText size={12} color={Colors.textMidGray} weight="bold">
            Target price
          </ThemedText>
          <ThemedText size={26} color={Colors.snowGray} weight="bold">
            72,200
          </ThemedText>
        </View>
        <ThemedText size={12} color={Colors.textMidGray} weight="bold">
          USD
        </ThemedText>
      </View>
      <Spacer size={44} />
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

const Success = () => {
  const config = [
    { label: "Asset", value: "BTC" },
    { label: "Direction", value: "Above" },
    { label: "Target", value: "$72,000" },
  ];
  return (
    <>
      <BadgeStuff
        title="BTC above $72,000"
        desc="This alert appears in Profile → Price Alerts and can be edited or deleted."
        outerColor={Colors.primaryClean}
        innerColor={Colors.primaryClean}
        IconComponent={
          <FontAwesome5 name="check" size={42} color={Colors.backgroundInk} />
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
          />
        ))}
      </View>
    </>
  );
};

export default AlertScreen;
