import Ellipse from "@/assets/icons/home/notifications/ellipse.svg";
import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ButtonVariant, ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useAssetChart } from "@/hooks/useAssetChart";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Href, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Action = "Buy" | "Sell" | "Swap";
const ActionScreen = () => {
  const params = useLocalSearchParams<{ asset: string; action: Action }>();
  const asset = params.asset;
  const action = params.action;

  const insets = useSafeAreaInsets();
  const bottomPadding = useSafeBottom();
  const { coinInfo: coinDetails } = useAssetChart(
    asset as string,
    false,
    15000,
  );

  const scrollRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = React.useState<Action>(action);

  const tabs: {
    title: "Buy" | "Sell" | "Swap";
    bgColor: string;
    color: string;
  }[] = [
    { title: "Buy", bgColor: Colors.primaryClean, color: Colors.backgroundInk },
    { title: "Sell", bgColor: Colors.lossBright, color: Colors.snowGray },
    { title: "Swap", bgColor: Colors.infoBright, color: Colors.surfaceNavy },
  ];

  const tabIndex = { Buy: 0, Sell: 1, Swap: 2 };

  const handleTabPress = (title: Action) => {
    scrollRef.current?.scrollTo({
      x: tabIndex[title] * SCREEN_WIDTH,
      animated: true,
    });
  };

  useEffect(() => {
    handleTabPress(action);
  }, []);

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / SCREEN_WIDTH);
    setActiveTab((["Buy", "Sell", "Swap"] as const)[index]);
  };

  const config = [
    {
      label: "Buy" as const,
      title: "Buy " + coinDetails?.name,
      desc: "Create a quote before confirming with PIN.",
      actionDetails: [
        {
          title: "You pay",
          body: "250.00",
          currency: "USDC",
          ellipseColor: Colors.primaryClean,
        },
        {
          title: "You receive",
          body: "250.00",
          currency: "BTC",
          ellipseColor: Colors.primaryClean,
        },
      ],
      meta: [
        { label: "Available", value: "500.00 USDC" },
        { label: "Estimated rate", value: "1 BTC = 64,200.50 USDT" },
        {
          label: "Verification limit",
          value: "$5000",
          valueColor: Colors.primaryClean,
        },
      ],
      cta: {
        label: "Get quote",
        variant: "primary" as ButtonVariant,
        onPress: useGoToRoute(("/(tabs)/trades/" + asset + "/quote") as Href),
      },
    },
    {
      label: "Sell" as const,
      title: "Sell " + coinDetails?.name,
      desc: "Preview rate and fees before execution.",
      actionDetails: [
        {
          title: "You sell",
          body: "250.00",
          currency: "USDC",
          ellipseColor: Colors.lossBright,
        },
        {
          title: "You receive",
          body: "250.00",
          currency: "BTC",
          ellipseColor: Colors.primaryClean,
        },
      ],
      meta: [
        { label: "Available", value: "500.00 USDC" },
        { label: "Fee estimate", value: "1 BTC = 64,200.50 USDT" },
        { label: "Receive after fees", value: "$5000", valueColor: undefined },
      ],
      cta: { label: "Get quote", variant: "red" as ButtonVariant },
    },
    {
      label: "Swap" as const,
      title: "Swap assets",
      desc: "Convert one supported coin into another.",
      actionDetails: [
        {
          title: "You sell",
          body: "250.00",
          currency: "USDC",
          ellipseColor: Colors.infoBright,
        },
        {
          title: "You receive",
          body: "250.00",
          currency: "BTC",
          ellipseColor: Colors.infoBright,
        },
      ],
      meta: [
        { label: "Available", value: "500.00 USDC" },
        { label: "Fee estimate", value: "1 BTC = 64,200.50 USDT" },
        { label: "Receive after fees", value: "$5000", valueColor: undefined },
      ],
      cta: { label: "Preview swap", variant: "primary" as ButtonVariant },
    },
  ];

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[
        GeneralStyles.container,
        { paddingTop: insets.top + 24, width: "100%" },
      ]}
    >
      {/* ── Header + tab pills (static, outside the paged scroll) ── */}
      <View style={[GeneralStyles.wrapper, { gap: 8, marginBottom: 16 }]}>
        <TextBlock
          title={config[tabIndex[activeTab]].title}
          body={config[tabIndex[activeTab]].desc}
          bodyStyle={{ fontSize: 12 }}
        />
        <Spacer size={12} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {tabs.map((item) => (
            <TouchableOpacity
              key={item.title}
              onPress={() => handleTabPress(item.title)}
              style={[
                GeneralStyles.box,
                {
                  borderRadius: 18,
                  backgroundColor:
                    activeTab === item.title
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
                color={activeTab === item.title ? item.color : Colors.snowGray}
                size={12}
                weight="medium"
              >
                {item.title}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Paged horizontal scroll ── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        removeClippedSubviews={false}
        style={{ flex: 1 }}
      >
        {config.map((page) => (
          <ScrollView
            key={page.label}
            style={{ width: SCREEN_WIDTH }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: bottomPadding + 50,
              gap: 16,
            }}
            scrollEventThrottle={16}
          >
            {/* Action detail cards */}
            <View
              style={[GeneralStyles.wrapper, { gap: 22, position: "relative" }]}
            >
              {page.label === "Swap" && (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 38,
                    height: 38,
                    borderRadius: 20,
                    backgroundColor: Colors.surfaceNavy,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    zIndex: 2,
                    transform: [{ translateX: "50%" }, { translateY: "-50%" }],
                    elevation: 20,
                  }}
                >
                  <MaterialCommunityIcons
                    name="swap-vertical"
                    size={24}
                    color={Colors.snowGray}
                  />
                </View>
              )}

              {page.actionDetails.map((item) => (
                <View
                  key={item.title}
                  style={[
                    GeneralStyles.box,
                    {
                      width: "100%",
                      height: 86,
                      borderRadius: 18,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingHorizontal: 16,
                    },
                  ]}
                >
                  <TextBlock
                    title={item.title}
                    titleStyle={{
                      color: Colors.textMidGray,
                      fontSize: 12,
                      fontFamily: Fonts.regular,
                    }}
                    body={item.body}
                    bodyStyle={{
                      color: Colors.snowGray,
                      fontSize: 24,
                      fontFamily: Fonts.bold,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Ellipse width={20} height={20} color={item.ellipseColor} />
                    <ThemedText>{item.currency}</ThemedText>
                  </View>
                </View>
              ))}
            </View>

            <Spacer size={40} />

            {/* Meta rows */}
            <View style={[GeneralStyles.wrapper, { gap: 12 }]}>
              {page.meta.map((item) => (
                <LabelValueItem
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  valueColor={item.valueColor}
                />
              ))}
            </View>

            <Spacer size={112} />

            {/* CTA */}
            <View style={GeneralStyles.wrapper}>
              <ThemedButton
                variant={page.cta.variant}
                title={page.cta.label}
                style={
                  page.label === "Swap"
                    ? { backgroundColor: Colors.infoBright }
                    : undefined
                }
                textStyle={[
                  { fontFamily: Fonts.medium, fontSize: 14 },
                  page.label === "Swap"
                    ? { color: Colors.surfaceNavy }
                    : undefined,
                ]}
                onPress={page.cta.onPress}
              />
            </View>
          </ScrollView>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

export default ActionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
