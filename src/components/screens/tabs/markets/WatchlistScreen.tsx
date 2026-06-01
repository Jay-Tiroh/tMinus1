import CoinList from "@/components/CoinList";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useRouter } from "expo-router";
import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WatchlistScreen = () => {
  const bottomPadding = useSafeBottom();
  const topInset = useSafeAreaInsets().top;
  const { watchlist, isLoading, isUninitialized } = useWatchlist();

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
              { height: 128, justifyContent: "center", padding: 20 },
            ]}
          >
            <TextBlock
              title="Add more assets"
              body="Use the market list to add coins to your watchlist."
              titleStyle={{ fontSize: 20 }}
              bodyStyle={{ fontSize: 12 }}
            />
          </View>
        </View>
        <Spacer size={50} />
        <View style={GeneralStyles.wrapper}>
          <ThemedButton
            title="Explore markets"
            variant="primary"
            onPress={() => router.push("/(tabs)/markets")}
          />
        </View>
      </>
    );
  };

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[
        GeneralStyles.container,
        { paddingTop: topInset + 24, width: "100%" },
      ]}
    >
      <CoinList
        data={watchlist}
        coinItemConfig={{ showChange: true, showChart: true }}
        ListHeaderComponent={header}
        ListFooterComponent={Footer}
        contentContainerStyle={{
          paddingBottom: bottomPadding + 50,
          paddingVertical: 12,
        }}
        useHrefs
        hasModal={true}
      />
    </ImageBackground>
  );
};

export default WatchlistScreen;

const styles = StyleSheet.create({
  topGainerContainer: {
    width: "100%",
    backgroundColor: Colors.surfaceGreenDark,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxHeight: 150,
  },
});
