import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import ActionTabs from "@/components/wallets/ActionTabs";
import Balance from "@/components/wallets/Balance";
import CryptoAssetItem from "@/components/wallets/CryptoAsset";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
// Make sure formatAmount is imported here alongside timeAgo
import { formatAmount, timeAgo } from "@/helpers/functions";
import { useAllAssets } from "@/hooks/useAllAssets";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import { useTransactions } from "@/hooks/useTransactions";
import useWallet from "@/hooks/useWallet";
import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const RecentTransactions = () => {
  const { transactions } = useTransactions();
  const toHistory = useGoToRoute("/wallets/transaction-history");
  const displayedTransactions = transactions.slice(0, 5); // Show only the 5 most recent transactions

  if (displayedTransactions.length === 0) return null;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ThemedText color={Colors.snowGray} size={16} weight="bold">
          Recent Transactions
        </ThemedText>
        <Pressable onPress={toHistory} hitSlop={20}>
          <ThemedText color={Colors.primaryClean} size={12} weight="bold">
            See All
          </ThemedText>
        </Pressable>
      </View>
      <Spacer size={14} />
      <View
        style={{
          gap: 10,
        }}
      >
        {displayedTransactions.map((tx) => (
          <CryptoAssetItem
            key={tx.id}
            iconSymbol={tx.toAsset}
            leftBody={tx.status}
            leftTitle={tx.note}
            rightTitle={
              formatAmount(tx.toAmount + tx.feeAmount) + " " + tx.toAsset
            }
            rightBody={timeAgo(tx.createdAt)}
            numberOfLines={1}
          />
        ))}
      </View>
    </View>
  );
};

const WalletsScreen = () => {
  const { coins } = useAllAssets();
  const { balances } = useWallet();

  const assetsHeld = balances.map((balance) => balance.assetSymbol);
  const displayedCoins = coins.filter((coin) =>
    assetsHeld.includes(coin.symbol),
  );

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
          gap: 10,
        }}
      >
        {displayedCoins.map((coin) => {
          // Extract calculations to keep the JSX clean
          const availableBalance =
            balances.find((balance) => balance.assetSymbol === coin.symbol)
              ?.available || 0;
          const fiatValue = coin.priceUsd * availableBalance;

          return (
            <CryptoAssetItem
              key={coin.id}
              iconSymbol={coin.symbol}
              leftTitle={coin.name}
              leftBody={coin.symbol}
              rightTitle={`$${formatAmount(fiatValue)}`}
              rightBody={`${formatAmount(availableBalance)} ${coin.symbol}`}
            />
          );
        })}
      </View>
      <Spacer size={32} />
      <View style={GeneralStyles.wrapper}>
        <RecentTransactions />
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
