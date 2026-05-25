import CoinList from "@/components/CoinList";
import SearchBar from "@/components/markets/SearchBar";
import { Spacer } from "@/components/Spacer";
import { useAllAssets } from "@/hooks/useAllAssets";
import { useDebounce } from "@/hooks/useDebounce";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const MarketsScreen = () => {
  const bottomPadding = useSafeBottom();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const { coins, isError } = useAllAssets(debouncedQuery);
  return (
    <View style={[styles.container, { paddingBottom: bottomPadding * 0 }]}>
      <View style={styles.searchWrapper}>
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
    </View>
  );
};

export default MarketsScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    flex: 1,
    alignItems: "center",
  },
  searchWrapper: {
    width: "100%",
    paddingHorizontal: 24,
  },
});
