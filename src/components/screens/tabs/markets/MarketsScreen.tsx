import CoinList from "@/components/CoinList";
import SearchBar from "@/components/markets/SearchBar";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { useAllAssets } from "@/hooks/useAllAssets";
import { useDebounce } from "@/hooks/useDebounce";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MarketsScreen = () => {
  const bottomPadding = useSafeBottom();
  const topInset = useSafeAreaInsets().top;
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const { coins, isError } = useAllAssets(debouncedQuery);
  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[
        styles.container,
        { paddingTop: topInset + 24, paddingBottom: bottomPadding * 0 },
      ]}
    >
      <View style={styles.wrapper}>
        <TextBlock
          title="Markets"
          body="Search assets, view live prices, and open a coin detail screen."
        />
      </View>
      <Spacer size={16} />
      <View style={styles.wrapper}>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>
      <Spacer size={16} />
      <CoinList
        data={coins}
        coinItemConfig={{ showChange: true, showChart: true }}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: bottomPadding * 2,
        }}
        useHrefs
      />
    </ImageBackground>
  );
};

export default MarketsScreen;

const styles = StyleSheet.create({
  container: {
    // height: "100%",
    flex: 1,
    alignItems: "center",
  },
  wrapper: {
    width: "100%",
    paddingHorizontal: 24,
  },
});
