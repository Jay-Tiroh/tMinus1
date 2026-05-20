import CoinList from "@/components/CoinList";
import { ThemedView } from "@/components/ThemedView";
import ActionTabs from "@/components/wallets/ActionTabs";
import Balance from "@/components/wallets/Balance";
import { Colors } from "@/constants/Colors";
import { useAllAssets } from "@/hooks/useAllAssets";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const Wallets = () => {
  const { coins } = useAllAssets();
  const bottomPadding = useSafeBottom();
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
          coinItemConfig={{ showChange: true, showChart: true }}
          contentContainerStyle={{
            paddingBottom: bottomPadding,
            paddingTop: 12,
          }}
        />
      </View>
    </View>
  );
};

export default Wallets;

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
