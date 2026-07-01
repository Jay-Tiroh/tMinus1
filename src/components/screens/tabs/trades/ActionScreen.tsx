import { Asset, AssetPickerModal } from "@/components/AssetPicker";
import { CryptoIcon } from "@/components/CryptoIcon";
import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { BuildActionConfig } from "@/constants/actionConfig";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { showErrorToast, showWarningToast } from "@/hooks/showToast";
import { useAssetChart } from "@/hooks/useAssetChart";
import { useAssetRoute } from "@/hooks/useAssetRoute";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import { useKyc } from "@/hooks/useKyc";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import useTrade from "@/hooks/useTrade";
import useWallet from "@/hooks/useWallet";
import { TradeType } from "@/types/trades";
import { ms, s, vs } from "@/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Action = "Buy" | "Sell" | "Swap";
type PickerTarget = "buyOutput" | "sellInput" | "swapInput" | "swapOutput";

// ─── Custom Hook: Trade Calculations ───────────────────────────────────────────
// This hook manages the RTK queries for all selected assets simultaneously
// and returns the math functions so your UI stays perfectly synced.
const useTradeCalculations = (
  buyOutputSymbol: string,
  sellInputSymbol: string,
  swapInputSymbol: string,
  swapOutputSymbol: string,
) => {
  const { coinInfo: buyCoin } = useAssetChart(buyOutputSymbol);
  const { coinInfo: sellCoin } = useAssetChart(sellInputSymbol);
  const { coinInfo: swapInCoin } = useAssetChart(swapInputSymbol);
  const { coinInfo: swapOutCoin } = useAssetChart(swapOutputSymbol);

  // Buy Math: USDT spent / target coin price
  const getBuyReceive = (usdAmount: number) => {
    if (!buyCoin?.priceUsd) return 0;
    return usdAmount / buyCoin.priceUsd;
  };

  // Sell Math: Crypto spent * source coin price
  const getSellReceive = (coinAmount: number) => {
    if (!sellCoin?.priceUsd) return 0;
    return coinAmount * sellCoin.priceUsd;
  };

  // Swap Math: (Crypto spent * source price) / target price
  const getSwapReceive = (coinAmount: number) => {
    if (!swapInCoin?.priceUsd || !swapOutCoin?.priceUsd) return 0;
    const usdValue = coinAmount * swapInCoin.priceUsd;
    return usdValue / swapOutCoin.priceUsd;
  };

  return {
    buyPriceUsd: buyCoin?.priceUsd || 0,
    sellPriceUsd: sellCoin?.priceUsd || 0,
    swapInPriceUsd: swapInCoin?.priceUsd || 0,
    swapOutPriceUsd: swapOutCoin?.priceUsd || 0,
    getBuyReceive,
    getSellReceive,
    getSwapReceive,
  };
};

// ─── TextInputBlock ────────────────────────────────────────────────────────────
interface TextInputBlockProps {
  label: string;
  value: string;
  symbol: string;
  onChangeText: (value: string) => void;
  onPressAsset?: () => void;
}
interface StaticAmountBlockProps {
  label: string;
  body: string;
  symbol: string;
  onPressAsset?: () => void;
}

const TextInputBlock = ({
  label,
  value,
  symbol,
  onChangeText,
  onPressAsset,
}: TextInputBlockProps) => {
  const handleChange = (text: string) => {
    const sanitized = text.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    onChangeText(sanitized);
  };

  return (
    <View
      style={[
        GeneralStyles.box,
        {
          width: "100%",
          height: vs(86),
          borderRadius: ms(18),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: s(16),
        },
      ]}
    >
      <View style={{ gap: vs(8), justifyContent: "center", flex: 1 }}>
        <ThemedText color={Colors.textMidGray} size={12}>
          {label}
        </ThemedText>
        <TextInput
          value={value}
          onChangeText={handleChange}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={Colors.textMidGray}
          style={{
            color: Colors.snowGray,
            fontSize: ms(24),
            fontFamily: Fonts.bold,
            paddingBottom: 0,
            paddingTop: 0,
          }}
          maxLength={10}
        />
      </View>

      <TouchableOpacity
        onPress={onPressAsset}
        disabled={!onPressAsset}
        style={{ flexDirection: "row", alignItems: "center", gap: s(8) }}
      >
        <CryptoIcon symbol={symbol} size={ms(24)} />
        <ThemedText>{symbol}</ThemedText>
        {onPressAsset && (
          <MaterialCommunityIcons
            name="chevron-down"
            size={16}
            color={Colors.textMidGray}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const StaticAmountBlock = ({
  label,
  body,
  symbol,
  onPressAsset,
}: StaticAmountBlockProps) => (
  <View
    style={[
      GeneralStyles.box,
      {
        width: "100%",
        height: vs(86),
        borderRadius: ms(18),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: s(16),
      },
    ]}
  >
    <TextBlock
      title={label}
      titleStyle={{
        color: Colors.textMidGray,
        fontSize: ms(12),
        fontFamily: Fonts.regular,
      }}
      body={body}
      bodyStyle={{
        color: Colors.snowGray,
        fontSize: ms(24),
        fontFamily: Fonts.bold,
        maxWidth: s(200),
      }}
    />
    <TouchableOpacity
      onPress={onPressAsset}
      disabled={!onPressAsset}
      style={{ flexDirection: "row", alignItems: "center", gap: s(8) }}
    >
      <CryptoIcon symbol={symbol} size={ms(24)} />
      <ThemedText>{symbol}</ThemedText>
      {onPressAsset && (
        <MaterialCommunityIcons
          name="chevron-down"
          size={16}
          color={Colors.textMidGray}
        />
      )}
    </TouchableOpacity>
  </View>
);

// ─── ActionScreen ──────────────────────────────────────────────────────────────
const ActionScreen = () => {
  const params = useLocalSearchParams<{ asset: string; action: Action }>();
  const action = params.action;
  const insets = useSafeAreaInsets();
  const bottomPadding = useSafeBottom();

  // Base Coin details for initial load
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

  // Input states
  const [buyAmount, setBuyAmount] = useState("1.00");
  const [sellAmount, setSellAmount] = useState("0.50");
  const [swapAmount, setSwapAmount] = useState("8.00");

  // Dynamic asset picker states
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

  // Hook into our new live price calculator
  const {
    buyPriceUsd,
    sellPriceUsd,
    swapInPriceUsd,
    swapOutPriceUsd,
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
  const getAvailableAssets = () => {
    const assetsHeld = balances.map((balance) => balance.assetSymbol);
    setAvailableAssets((prev) => [...prev, ...assetsHeld]);
  };

  // Modal Controls
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);

  // Sync state if initialCoinDetails loads slightly after render
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
  const tabIndex: Record<Action, number> = { Buy: 0, Sell: 1, Swap: 2 };

  const handleTabPress = (title: Action) => {
    scrollRef.current?.scrollTo({
      x: tabIndex[title] * SCREEN_WIDTH,
      animated: true,
    });
  };

  useEffect(() => {
    handleTabPress(action);
    getAvailableAssets();
  }, []);

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveTab((["Buy", "Sell", "Swap"] as const)[index]);
  };

  const [assetsToShow, setAssetsToShow] = useState<string[] | undefined>(
    undefined,
  );

  const openAssetPicker = (target: PickerTarget) => {
    setPickerTarget(target);

    // Check 'target' directly instead of the 'pickerTarget' state
    if (target === "swapInput") {
      setAssetsToShow(availableAssets);
    } else {
      setAssetsToShow(undefined);
    }

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

  const parsedSellAmount = parseFloat(sellAmount) || 0;
  const sellReturns = getSellReceive(parsedSellAmount);
  const sellFee = 0.01 * sellReturns;

  const parsedSwapAmount = parseFloat(swapAmount) || 0;
  const swapReturns = getSwapReceive(parsedSwapAmount);

  // Pre-calculate all math outputs
  const parsedBuyAmount = parseFloat(buyAmount) || 0;
  const isBuyInsufficient = parsedBuyAmount > portfolioValue;
  const isSellInsufficient =
    parsedSellAmount > (getBalanceBySymbol(sellInputSymbol)?.available || 0);
  const isSwapInsufficient =
    parsedSwapAmount > (getBalanceBySymbol(swapInputSymbol)?.available || 0);

  // <-- 3. Implement the dynamic handleSubmit -->
  const handleSubmit = async () => {
    try {
      let type: TradeType = "buy";
      let fromAsset = "USDT";
      let toAsset = buyOutputSymbol;
      let fromAmount = parsedBuyAmount;

      if (activeTab === "Sell") {
        type = "sell";
        fromAsset = sellInputSymbol;
        toAsset = "USDT"; // Make sure this matches your backend's expected fiat/stablecoin symbol
        fromAmount = parsedSellAmount;
      } else if (activeTab === "Swap") {
        type = "swap";
        fromAsset = swapInputSymbol;
        toAsset = swapOutputSymbol;
        fromAmount = parsedSwapAmount;
      }

      // Basic zero-amount validation
      if (fromAmount <= 0) {
        showWarningToast({
          title: "Invalid Amount",
          message: "Please enter a valid amount greater than 0.",
        });
        return;
      }

      // --- BALANCE VALIDATIONS ---

      // Buy Validation
      if (activeTab === "Buy" && isBuyInsufficient) {
        showWarningToast({
          title: "Insufficient Balance",
          message: "Your portfolio value is insufficient for this buy.",
        });
        return;
      }

      // Sell Validation
      if (activeTab === "Sell") {
        const availableBalance =
          getBalanceBySymbol(sellInputSymbol)?.available || 0;
        if (parsedSellAmount > availableBalance) {
          showWarningToast({
            title: "Insufficient Balance",
            message: `You don't have enough ${sellInputSymbol} to complete this sale.`,
          });
          return;
        }
      }

      // Swap Validation
      if (activeTab === "Swap") {
        const availableBalance =
          getBalanceBySymbol(swapInputSymbol)?.available || 0;
        if (parsedSwapAmount > availableBalance) {
          showWarningToast({
            title: "Insufficient Balance",
            message: `You don't have enough ${swapInputSymbol} to swap.`,
          });
          return;
        }
      }

      // Generate the quote
      const data = await createQuote({
        type,
        fromAsset,
        toAsset,
        fromAmount,
      });

      // Navigate to the quote review screen on success
      console.log(data);
      push("quote", { asset: params.asset });
    } catch (error: any) {
      console.error("Quote creation failed:", error);

      // Extract the exact error message from the thrown RTK Query payload
      const apiErrorMessage = error?.data?.error?.message;

      const fallbackMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";

      showErrorToast({
        title: "Trade Failed",
        message: apiErrorMessage || fallbackMessage,
      });

      if (
        apiErrorMessage ===
        "Complete identity verification before you can trade."
      ) {
        goToKyc();
      }
    }
  };

  const assetAvailable = getBalanceBySymbol(sellInputSymbol)?.available || 0;

  // Build the configuration
  const config = BuildActionConfig({
    // General Data
    portfolioValue,
    limits,
    openAssetPicker,
    pushQuote: handleSubmit,
    assetAvailable,
    // Buy Data
    buyAmount,
    setBuyAmount,
    parsedBuyAmount,
    isBuyInsufficient,
    buyOutputSymbol,
    buyPriceUsd,
    buyReceiveFormatted: getBuyReceive(parsedBuyAmount).toFixed(8),

    // Sell Data
    sellAmount,
    setSellAmount,
    sellInputSymbol,
    sellPriceUsd,
    sellReturns,
    sellFee,
    isSellInsufficient,

    // Swap Data
    swapAmount,
    setSwapAmount,
    swapInputSymbol,
    swapOutputSymbol,
    swapReturnsFormatted: swapReturns.toFixed(8),
    isSwapInsufficient,
  });

  const [assetValid, setAssetValid] = useState(false);

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[
        GeneralStyles.container,
        { paddingTop: insets.top + 24, width: "100%" },
      ]}
    >
      {/* ── Header + Tab Controls ── */}
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

      {/* ── Viewport View Slider ── */}
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
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
          >
            {/* Input Wrapper Cards */}
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

            {/* Asset Ledger/Metadata rows */}
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
              />
            </View>
          </ScrollView>
        ))}
      </ScrollView>

      {/* Extracted Asset Picker */}
      <AssetPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleAssetSelect}
        assetsToShow={assetsToShow}
      />
    </ImageBackground>
  );
};

export default ActionScreen;

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
