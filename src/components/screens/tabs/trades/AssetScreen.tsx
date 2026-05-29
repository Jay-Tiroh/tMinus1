import ChangeText from "@/components/ChangeText";
import { CryptoIcon } from "@/components/CryptoIcon";
import TextBlock from "@/components/TextBlock";
import { ThemedText } from "@/components/ThemedText";
import { GeneralStyles } from "@/constants/themes";
import { formatCurrency } from "@/helpers/functions";
import { useAssetChart } from "@/hooks/useAssetChart";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AssetScreen = () => {
  const { coin = "btc" } = useLocalSearchParams();
  const {
    coinInfo: coinDetails,
    isLoading,
    chart,
  } = useAssetChart(coin as string, false, 15000);
  const insets = useSafeAreaInsets();
  const bottomPadding = useSafeBottom();
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
          paddingBottom: bottomPadding,
          width: "100%",
        }}
        style={{ width: "100%" }}
      >
        <View style={[GeneralStyles.wrapper, { gap: 8 }]}>
          <TextBlock
            title={coinDetails?.name}
            body={coinDetails?.symbol + " · " + coinDetails?.network}
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
      </ScrollView>
    </ImageBackground>
  );
};

export default AssetScreen;

const styles = StyleSheet.create({});
