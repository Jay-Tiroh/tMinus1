import CoinList from "@/components/CoinList";
import { ThemedView } from "@/components/ThemedView";
import ActionTabs from "@/components/wallets/ActionTabs";
import Balance from "@/components/wallets/Balance";
import { Colors } from "@/constants/Colors";
import { useAllAssets } from "@/hooks/useAllAssets";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import useWallet from "@/hooks/useWallet";
import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const WalletsScreen = () => {
  const { coins } = useAllAssets();
  const { wallet, isLoading, refetch } = useWallet();

  if (!isLoading) {
    console.log("Wallet data in screen now:", wallet);
    // refetch(); // Refetch to ensure we have the latest data
  }
  const bottomPadding = useSafeBottom() + 20; // Add extra padding for spacing
  const [headerHeight, setHeaderHeight] = useState(0);

  const listHeight = SCREEN_HEIGHT - headerHeight;

  return (
    <View style={styles.container}>
      <ThemedView
        safe
        style={styles.header}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <Balance />
        <ActionTabs />
      </ThemedView>

      <View style={{ height: listHeight }}>
        <CoinList
          data={coins}
          coinItemConfig={{ showAmountInUsd: true }}
          contentContainerStyle={{
            paddingBottom: bottomPadding,
            paddingTop: 12,
          }}
        />
      </View>
    </View>
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
