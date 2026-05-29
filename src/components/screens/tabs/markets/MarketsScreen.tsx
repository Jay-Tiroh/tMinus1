import CoinList from "@/components/CoinList";
import SearchBar from "@/components/markets/SearchBar";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useAllAssets } from "@/hooks/useAllAssets";
import { useDebounce } from "@/hooks/useDebounce";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MarketsScreen = () => {
  const bottomPadding = useSafeBottom();
  const topInset = useSafeAreaInsets().top;
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const { coins, isError } = useAllAssets(debouncedQuery);

  const { watchlist } = useWatchlist(10000);

  const tabs = ["All", "Gainers", "Watchlist"];
  const [activeTab, setActiveTab] = useState("All");
  const [displayedCoins, setDisplayedCoins] = useState(coins);
  const router = useRouter();
  const handleTabChange = (tab: string) => {
    // setActiveTab(tab);
    if (tab === "All") {
      setDisplayedCoins(coins);
    } else if (tab === "Gainers") {
      router.push("/(tabs)/markets/trending");
    } else if (tab === "Watchlist") {
      setDisplayedCoins(watchlist);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[
        GeneralStyles.container,
        { paddingTop: topInset + 24, paddingBottom: bottomPadding * 0 },
      ]}
    >
      <View style={GeneralStyles.wrapper}>
        <TextBlock
          title="Markets"
          body="Search assets, view live prices, and open a coin detail screen."
        />
      </View>
      <Spacer size={16} />
      <View style={GeneralStyles.wrapper}>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>
      <Spacer size={22} />
      <View style={GeneralStyles.wrapper}>
        <Tabs tabs={tabs} activeTab={activeTab} handlePress={handleTabChange} />
      </View>
      <Spacer size={26} />
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

type TabsProps = {
  tabs: string[];
  activeTab: string;
  handlePress: (tab: string) => void;
};

const Tabs = ({ tabs, activeTab, handlePress }: TabsProps) => {
  return (
    <View style={styles.tabsContainer}>
      {tabs?.map((tab) => (
        <ThemedButton
          title={tab}
          variant={tab === activeTab ? "primary" : "secondary"}
          key={tab}
          style={[
            styles.tab,
            tab !== activeTab && { backgroundColor: Colors.surfaceNavy },
          ]}
          textStyle={{
            fontSize: 14,
            color: tab !== activeTab ? Colors.snowGray : Colors.backgroundInk,
            fontFamily: Fonts.medium,
          }}
          onPress={() => handlePress(tab)}
        />
      ))}
    </View>
  );
};

export default MarketsScreen;

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    gap: 24,
  },
  tab: {
    height: 32,
    maxWidth: 90,
  },
});
