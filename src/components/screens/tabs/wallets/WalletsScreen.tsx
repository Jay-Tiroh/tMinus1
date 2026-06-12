import CryptoAssetItem from "@/components/screens/tabs/wallets/CryptoAsset";
import { Spacer } from "@/components/Spacer";
import Template from "@/components/trades/Template";
import ActionTabs from "@/components/wallets/ActionTabs";
import Balance from "@/components/wallets/Balance";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useAllAssets } from "@/hooks/useAllAssets";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import useWallet from "@/hooks/useWallet";
import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const WalletsScreen = () => {
  const { coins } = useAllAssets();
  const { wallet, balances, isLoading, refetch } = useWallet();
  // console.log(balances);

  const assetsHeld = balances.map((balance) => balance.assetSymbol);
  // console.log("My assets:", assetsHeld);
  const displayedCoins = coins.filter((coin) =>
    assetsHeld.includes(coin.symbol),
  );
  if (!isLoading) {
    // console.log("Wallet data in screen now:", wallet);
    // refetch(); // Refetch to ensure we have the latest data
  }
  const bottomPadding = useSafeBottom() + 20; // Add extra padding for spacing
  const [headerHeight, setHeaderHeight] = useState(0);

  const listHeight = SCREEN_HEIGHT - headerHeight;

  return (
    <Template
      textBlockProps={{
        title: "Wallet",
        body: "Aggregated in USD from active asset balances.",
      }}
      ctaProps={undefined}
    >
      <View style={GeneralStyles.wrapper}>
        <Balance />
      </View>
      <Spacer size={32} />
      <View style={GeneralStyles.wrapper}>
        <ActionTabs />
      </View>
      <Spacer size={32} />
      <View
        style={{
          ...GeneralStyles.wrapper,
          gap: 16,
          paddingBottom: bottomPadding,
        }}
      >
        {displayedCoins.map((coin) => (
          <CryptoAssetItem
            key={coin.id}
            asset={{
              id: coin.id,
              name: coin.name,
              symbol: coin.symbol,
              fiatBalance:
                coin.priceUsd *
                (balances.find((balance) => balance.assetSymbol === coin.symbol)
                  ?.available || 0),
              cryptoBalance:
                balances.find((balance) => balance.assetSymbol === coin.symbol)
                  ?.available || 0,
            }}
          />
        ))}
      </View>
    </Template>
  );
};

export default WalletsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    backgroundColor: Colors.surfaceDark,
    padding: 24,
    paddingBottom: 12,
  },
});
