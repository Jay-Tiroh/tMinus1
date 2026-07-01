import CoinList from "@/components/CoinList";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import { useWatchlist } from "@/hooks/useWatchlist";
import { ms, vs } from "@/utils/responsive";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ImageBackground,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WatchlistScreen = () => {
  const bottomPadding = useSafeBottom();
  const topInset = useSafeAreaInsets().top;
  const { watchlist, refetch } = useWatchlist();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const header = (
    <>
      <View style={GeneralStyles.wrapper}>
        <TextBlock
          title="Watchlist"
          body="Assets you follow with row sparklines."
        />
      </View>
      <Spacer size={42} />
    </>
  );

  const Footer = () => {
    const router = useRouter();
    return (
      <>
        <Spacer size={50} />
        <View style={GeneralStyles.wrapper}>
          <View
            style={[
              GeneralStyles.box,
              {
                height: vs(128),
                justifyContent: "center",
                padding: ms(20),
              },
            ]}
          >
            <TextBlock
              title="Add more assets"
              body="Use the market list to add coins to your watchlist."
              titleStyle={{ fontSize: ms(20) }}
              bodyStyle={{ fontSize: ms(12) }}
            />
          </View>
        </View>
        <Spacer size={50} />
        <View style={GeneralStyles.wrapper}>
          <ThemedButton
            title="Explore markets"
            variant="primary"
            onPress={() => router.replace("/(tabs)/markets")}
          />
        </View>
      </>
    );
  };

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[GeneralStyles.container, { width: "100%" }]}
    >
      <CoinList
        data={watchlist}
        coinItemConfig={{ showChange: true, showChart: true }}
        ListHeaderComponent={header}
        ListFooterComponent={Footer}
        contentContainerStyle={{
          paddingBottom: bottomPadding + vs(50),
          paddingVertical: vs(12),
          paddingTop: topInset + vs(36),
        }}
        useHrefs
        hasModal={true}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressBackgroundColor={Colors.backgroundDark}
          />
        }
      />
    </ImageBackground>
  );
};

export default WatchlistScreen;

const styles = StyleSheet.create({
  topGainerContainer: {
    width: "100%",
    backgroundColor: Colors.surfaceGreenDark,
    borderRadius: ms(18),
    padding: ms(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxHeight: vs(150),
  },
});
