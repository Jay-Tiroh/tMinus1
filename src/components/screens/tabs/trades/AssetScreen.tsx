import ChangeText from "@/components/ChangeText";
import { CryptoIcon } from "@/components/CryptoIcon";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import CandlestickComponent from "@/components/trades/CandlestickComponent";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { formatCompactNumber, formatCurrency } from "@/helpers/functions";
import { useAssetChart } from "@/hooks/useAssetChart";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Add from "@/assets/icons/markets/add-circle.svg";
import { showErrorToast, showSuccessToast } from "@/hooks/showToast";
import { useAssetRoute } from "@/hooks/useAssetRoute";
import { useWatchlist } from "@/hooks/useWatchlist";

const AssetScreen = () => {
  const params = useLocalSearchParams<{ asset?: string }>();
  const asset = params.asset ?? "BTC";
  const { coinInfo: coinDetails, isLoading } = useAssetChart(
    asset as string,
    false,
    15000,
  );
  const insets = useSafeAreaInsets();
  const bottomPadding = useSafeBottom();
  const push = useAssetRoute();
  const actionConfig = [
    {
      title: "Sell",
      onPress: () => {
        push("action", { action: "Sell", asset });
      },
    },
    {
      title: "Swap",
      onPress: () => {
        push("action", { action: "Swap", asset });
      },
    },
    {
      title: "Alert",
      onPress: () => {
        push("alert");
      },
    },
  ];

  const stats = [
    {
      name: "Market cap",
      value: "$" + formatCompactNumber(coinDetails?.stats?.marketCapUsd ?? NaN),
    },
    {
      name: "24h volume",
      value: "$" + formatCompactNumber(coinDetails?.stats?.volume24hUsd ?? NaN),
    },
    {
      name: "24h high",
      value: "$" + formatCompactNumber(coinDetails?.stats?.high24hUsd ?? NaN),
    },
    {
      name: "Circulating",
      value:
        formatCompactNumber(coinDetails?.stats?.circulatingSupply ?? NaN) +
        ` ${coinDetails?.symbol.toUpperCase()}`,
    },
  ];

  const { addToWatchlist, isAdding, isInWatchlist, isAdded, isAddingError } =
    useWatchlist();

  const inWatchlist = isInWatchlist(coinDetails?.symbol as string);

  const onAdd = async () => {
    try {
      await addToWatchlist(coinDetails?.symbol as string).unwrap();

      showSuccessToast({
        title: "Added to Watchlist",
        message: `${coinDetails?.name} has been added to your watchlist.`,
      });
    } catch (error) {
      showErrorToast({
        title: "Action Failed",
        message: `Couldn't add ${coinDetails?.name} your watchlist.`,
      });
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[
        GeneralStyles.container,
        { paddingTop: insets.top + 24, width: "100%" },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: bottomPadding + 50,
          width: "100%",
          gap: 16,
        }}
        scrollEventThrottle={16}
        style={{ width: "100%" }}
      >
        <View style={[GeneralStyles.wrapper, { gap: 8 }]}>
          <TextBlock
            title={coinDetails?.name}
            body={
              coinDetails?.symbol + " · " + coinDetails?.network + " network"
            }
          />
          <CryptoIcon symbol={coinDetails?.symbol ?? "btc"} size={42} />
        </View>
        <View
          style={[
            GeneralStyles.wrapper,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          <ThemedText size={32} weight="bold" color={"#fff"}>
            ${formatCurrency(coinDetails?.priceUsd as number)}
          </ThemedText>
          <ChangeText change={coinDetails?.change24h ?? 0} />
        </View>

        <View style={GeneralStyles.wrapper}>
          <CandlestickComponent
            change24h={coinDetails?.change24h ?? 0}
            priceUsd={coinDetails?.priceUsd as number}
            symbol={coinDetails?.symbol ?? "btc"}
          />
        </View>
        <View style={GeneralStyles.wrapper}>
          <ThemedButton
            title="Buy"
            variant="primary"
            onPress={() => {
              push("action", { action: "Buy", asset });
            }}
          />
        </View>
        <View
          style={[
            GeneralStyles.wrapper,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
        >
          {actionConfig.map((item) => (
            <TouchableOpacity
              key={item.title}
              onPress={item.onPress}
              style={[
                GeneralStyles.box,
                {
                  borderRadius: 14,
                  backgroundColor: Colors.surfaceNavy,
                  width: 112,
                  height: 46,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <ThemedText
                color={
                  item.title === "Alert" ? Colors.primaryClean : Colors.snowGray
                }
                size={12}
                weight="medium"
              >
                {item.title}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={[
            GeneralStyles.wrapper,
            {
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              gap: 16,
            },
          ]}
        >
          {stats.map((stat) => (
            <View
              key={stat.name}
              style={[
                GeneralStyles.box,
                {
                  width: "48%",
                  padding: 16,
                  gap: 8,
                },
              ]}
            >
              <ThemedText color={Colors.textMidGray} size={12}>
                {stat.name}
              </ThemedText>
              <ThemedText
                color={Colors.snowGray}
                size={15}
                weight="bold"
                style={{ alignSelf: "flex-end" }}
              >
                {stat.value}
              </ThemedText>
            </View>
          ))}
        </View>

        {!inWatchlist && (
          <View style={GeneralStyles.wrapper}>
            <ThemedButton
              title="Add to watchlist"
              style={{
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: Colors.textCool,
                backgroundColor: Colors.backgroundDark,
              }}
              textStyle={{ color: Colors.textMidGray }}
              iconComponent={isAdding ? <ActivityIndicator /> : <Add />}
              onPress={onAdd}
            />
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default AssetScreen;

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
