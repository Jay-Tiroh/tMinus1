import { Asset, AssetPickerModal } from "@/shared/components/AssetPicker";

import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { TradeType } from "@/features/trades";
import { BuildActionConfig } from "@/features/trades/constants/action.config";
import { useAssetRoute } from "@/features/trades/hooks/useAssetRoute";
import useWallet from "@/features/wallets/hooks/useWallet";
import { formatAmount } from "@/helpers/functions";
import { showErrorToast, showWarningToast } from "@/shared/hooks/showToast";

import { useGoToRoute } from "@/shared/hooks/useGoToRoute";
import { useKyc } from "@/features/kyc/hooks/useKyc";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import { logger } from "@/utils/logger";
import { ms, s, vs } from "@/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Decimal } from "decimal.js";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

// Import new boundary dependencies
import { useAssetChart } from "@/features/markets";
import useTrade from "@/features/trades/hooks/useTrade";
import { LabelValueItem } from "@/shared/components/LabelValueItem";
import {
  StaticAmountBlock,
  TextInputBlock,
} from "../components/TradeInputBlocks";
import { useTradeCalculations } from "../hooks/useTradeCalculations";

const TAB_INDEX = { Buy: 0, Sell: 1, Swap: 2 };
const { width: SCREEN_WIDTH } = Dimensions.get("window");
type Action = "Buy" | "Sell" | "Swap";
type PickerTarget = "buyOutput" | "sellInput" | "swapInput" | "swapOutput";

export const ActionScreen = () => {
  const params = useLocalSearchParams<{ asset: string; action: Action }>();
  const action = params.action;
  const insets = useSafeAreaInsets();
  const bottomPadding = useSafeBottom();

  const { coinInfo: initialCoinDetails } = useAssetChart(
    params.asset as string,
    false,
    15000,
  );
  const { balances, portfolioValue, getBalanceBySymbol } = useWallet();
  const { limits } = useKyc();
  const { push } = useAssetRoute();
  const goToKyc = useGoToRoute("/kyc");
  const scrollRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState<Action>(action);
  const { createQuote, isCreating } = useTrade();

  const [buyAmount, setBuyAmount] = useState("1.00");
  const [sellAmount, setSellAmount] = useState("0.50");
  const [swapAmount, setSwapAmount] = useState("8.00");

  const [buyOutputSymbol, setBuyOutputSymbol] = useState(
    initialCoinDetails?.symbol ?? "BTC",
  );
  const [sellInputSymbol, setSellInputSymbol] = useState(
    initialCoinDetails?.symbol ?? "ETH",
  );
  const [swapInputSymbol, setSwapInputSymbol] = useState("USDT");
  const [swapOutputSymbol, setSwapOutputSymbol] = useState(
    initialCoinDetails?.symbol ?? "BTC",
  );

  const {
    buyPriceUsd,
    sellPriceUsd,
    getBuyReceive,
    getSellReceive,
    getSwapReceive,
  } = useTradeCalculations(
    buyOutputSymbol,
    sellInputSymbol,
    swapInputSymbol,
    swapOutputSymbol,
  );

  const [availableAssets, setAvailableAssets] = useState(["USDT"]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);
  const [assetsToShow, setAssetsToShow] = useState<string[] | undefined>(
    undefined,
  );

  useEffect(() => {
    if (initialCoinDetails?.symbol) {
      setBuyOutputSymbol(initialCoinDetails.symbol);
      setSellInputSymbol(initialCoinDetails.symbol);
      setSwapOutputSymbol(initialCoinDetails.symbol);
    }
  }, [initialCoinDetails?.symbol]);

  const tabs: { title: Action; bgColor: string; color: string }[] = [
    { title: "Buy", bgColor: Colors.primaryClean, color: Colors.backgroundInk },
    { title: "Sell", bgColor: Colors.lossBright, color: Colors.snowGray },
    { title: "Swap", bgColor: Colors.infoBright, color: Colors.surfaceNavy },
  ];

  const getAvailableAssets = useCallback(() => {
    if (!balances || balances.length === 0) return;
    setAvailableAssets(balances.map((balance) => balance.assetSymbol));
  }, [balances]);

  const handleTabPress = useCallback((title: Action) => {
    scrollRef.current?.scrollTo({
      x: TAB_INDEX[title] * SCREEN_WIDTH,
      animated: true,
    });
  }, []);

  useEffect(() => {
    handleTabPress(action);
    getAvailableAssets();
  }, [action, getAvailableAssets, handleTabPress]);

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveTab((["Buy", "Sell", "Swap"] as const)[index]);
  };

  const openAssetPicker = (target: PickerTarget) => {
    setPickerTarget(target);
    setAssetsToShow(target === "swapInput" ? availableAssets : undefined);
    setModalVisible(true);
  };

  const handleAssetSelect = (selectedAsset: Asset) => {
    if (pickerTarget === "buyOutput") setBuyOutputSymbol(selectedAsset.symbol);
    if (pickerTarget === "sellInput") setSellInputSymbol(selectedAsset.symbol);
    if (pickerTarget === "swapInput") setSwapInputSymbol(selectedAsset.symbol);
    if (pickerTarget === "swapOutput")
      setSwapOutputSymbol(selectedAsset.symbol);
    setModalVisible(false);
  };

  const handleSwapToggle = () => {
    setSwapInputSymbol(swapOutputSymbol);
    setSwapOutputSymbol(swapInputSymbol);
  };

  const sellAmountDecimal = new Decimal(sellAmount || 0);
  const buyAmountDecimal = new Decimal(buyAmount || 0);
  const swapAmountDecimal = new Decimal(swapAmount || 0);

  const parsedSellAmount = sellAmountDecimal.toNumber();
  const sellReturns = getSellReceive(parsedSellAmount);
  const sellFee = new Decimal(0.01).times(sellReturns).toNumber();
  const parsedSwapAmount = swapAmountDecimal.toNumber();
  const swapReturns = getSwapReceive(parsedSwapAmount);
  const parsedBuyAmount = buyAmountDecimal.toNumber();

  const isBuyInsufficient = buyAmountDecimal.gt(portfolioValue);
  const isSellInsufficient = sellAmountDecimal.gt(
    getBalanceBySymbol(sellInputSymbol)?.available || 0,
  );
  const isSwapInsufficient = swapAmountDecimal.gt(
    getBalanceBySymbol(swapInputSymbol)?.available || 0,
  );

  const handleSubmit = async () => {
    try {
      let type: TradeType = "buy";
      let fromAsset = "USDT";
      let toAsset = buyOutputSymbol;
      let fromAmount = parsedBuyAmount;

      if (activeTab === "Sell") {
        type = "sell";
        fromAsset = sellInputSymbol;
        toAsset = "USDT";
        fromAmount = parsedSellAmount;
      } else if (activeTab === "Swap") {
        type = "swap";
        fromAsset = swapInputSymbol;
        toAsset = swapOutputSymbol;
        fromAmount = parsedSwapAmount;
      }

      if (fromAmount <= 0) {
        showWarningToast({
          title: "Invalid Amount",
          message: "Please enter a valid amount greater than 0.",
        });
        return;
      }

      if (activeTab === "Buy" && isBuyInsufficient) {
        showWarningToast({
          title: "Insufficient Balance",
          message: "Your portfolio value is insufficient for this buy.",
        });
        return;
      }
      if (
        activeTab === "Sell" &&
        parsedSellAmount > (getBalanceBySymbol(sellInputSymbol)?.available || 0)
      ) {
        showWarningToast({
          title: "Insufficient Balance",
          message: `You don't have enough ${sellInputSymbol} to complete this sale.`,
        });
        return;
      }
      if (
        activeTab === "Swap" &&
        parsedSwapAmount > (getBalanceBySymbol(swapInputSymbol)?.available || 0)
      ) {
        showWarningToast({
          title: "Insufficient Balance",
          message: `You don't have enough ${swapInputSymbol} to swap.`,
        });
        return;
      }

      const data = await createQuote({ type, fromAsset, toAsset, fromAmount });
      logger.log(data);
      push("quote", { asset: params.asset });
    } catch (error: any) {
      logger.error("Quote creation failed:", error);
      const apiErrorMessage = error?.data?.error?.message;
      showErrorToast({
        title: "Trade Failed",
        message:
          apiErrorMessage ||
          (error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again."),
      });
      if (
        apiErrorMessage ===
        "Complete identity verification before you can trade."
      )
        goToKyc();
    }
  };

  const config = BuildActionConfig({
    portfolioValue,
    limits,
    openAssetPicker,
    pushQuote: handleSubmit,
    assetAvailable: getBalanceBySymbol(sellInputSymbol)?.available || 0,
    buyAmount,
    setBuyAmount,
    parsedBuyAmount,
    isBuyInsufficient,
    buyOutputSymbol,
    buyPriceUsd,
    buyReceiveFormatted: getBuyReceive(parsedBuyAmount).toFixed(8),
    sellAmount,
    setSellAmount,
    sellInputSymbol,
    sellPriceUsd,
    sellReturns,
    sellFee,
    isSellInsufficient,
    swapAmount,
    setSwapAmount,
    swapInputSymbol,
    swapOutputSymbol,
    swapReturnsFormatted: swapReturns.toFixed(8),
    isSwapInsufficient,
  });

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[
        GeneralStyles.container,
        { paddingTop: insets.top + 24, width: "100%" },
      ]}
    >
      <View style={[GeneralStyles.wrapper, { gap: 8, marginBottom: 16 }]}>
        <TextBlock
          title={config[TAB_INDEX[activeTab]].title}
          body={config[TAB_INDEX[activeTab]].desc}
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

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
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
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={[GeneralStyles.wrapper, { gap: 22, position: "relative" }]}
            >
              {page.label === "Swap" && (
                <TouchableOpacity
                  style={styles.arrowIconContainer}
                  onPress={handleSwapToggle}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="swap-vertical"
                    size={24}
                    color={Colors.snowGray}
                  />
                </TouchableOpacity>
              )}
              <TextInputBlock
                label={page.inputDetail.title}
                value={page.inputAmount}
                onChangeText={page.onInputChange}
                symbol={page.inputDetail.currency}
                onPressAsset={page.inputDetail.onPress}
              />
              <StaticAmountBlock
                label={page.staticDetail.title}
                body={formatAmount(parseFloat(page.staticDetail.body))}
                symbol={page.staticDetail.currency}
                onPressAsset={page.staticDetail.onPress}
              />
            </View>
            <Spacer size={40} />
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
            <View style={GeneralStyles.wrapper}>
              <ThemedButton
                variant={page.cta.variant}
                title={page.cta.label}
                style={[
                  page.label === "Swap"
                    ? { backgroundColor: Colors.infoBright }
                    : undefined,
                  page.cta.onPress === undefined && page.label === "Buy"
                    ? { opacity: 0.5 }
                    : undefined,
                ]}
                textStyle={[
                  { fontFamily: Fonts.medium, fontSize: 14 },
                  page.label === "Swap"
                    ? { color: Colors.surfaceNavy }
                    : undefined,
                ]}
                onPress={page.cta.onPress}
                disabled={isCreating}
                iconComponent={
                  isCreating ? (
                    <ActivityIndicator color={Colors.backgroundInk} />
                  ) : undefined
                }
              />
            </View>
          </ScrollView>
        ))}
      </ScrollView>
      <AssetPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleAssetSelect}
        assetsToShow={assetsToShow}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  arrowIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: s(40),
    height: vs(40),
    borderRadius: ms(20),
    backgroundColor: Colors.surfaceNavy,
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 3,
    transform: [{ translateX: s(10) }, { translateY: vs(-20) }],
    elevation: 4,
    borderWidth: 3,
    borderColor: Colors.backgroundInk,
  },
});
