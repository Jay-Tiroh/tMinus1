import CoinList from "@/components/CoinList";
import SearchBar from "@/components/markets/SearchBar";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useAllAssets } from "@/hooks/useAllAssets";
import { useBackToHome } from "@/hooks/useBackToHome";
import { useDebounce } from "@/hooks/useDebounce";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import { ms, s, vs } from "@/utils/responsive";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ImageBackground,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MarketsScreen = () => {
  useBackToHome();
  const bottomPadding = useSafeBottom();
  const topInset = useSafeAreaInsets().top;
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const { coins, refetch } = useAllAssets(debouncedQuery);
  const tabs = ["All", "Gainers", "Watchlist"];
  const [activeTab, setActiveTab] = useState("All");
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Gainers") {
      router.replace("/(tabs)/markets/trending");
    } else if (tab === "Watchlist") {
      router.replace("/(tabs)/markets/watchlist");
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const header = useMemo(
    () => (
      <View style={GeneralStyles.wrapper}>
        <TextBlock
          title="Markets"
          body="Search assets, view live prices, and open a coin detail screen."
        />
        <Spacer size={16} />
        <SearchBar value={query} onChangeText={setQuery} />
        <Spacer size={22} />
        <Tabs tabs={tabs} activeTab={activeTab} handlePress={handleTabChange} />
        <Spacer size={26} />
      </View>
    ),
    [query, activeTab],
  );

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[GeneralStyles.container]}
    >
      <CoinList
        data={coins}
        coinItemConfig={{ showChange: true, showChart: true }}
        ListHeaderComponent={header}
        contentContainerStyle={{
          paddingBottom: bottomPadding * 2,
          paddingTop: topInset + vs(32),
        }}
        useHrefs
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
            fontSize: ms(14),
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
    gap: s(24),
  },
  tab: {
    height: vs(32),
    maxWidth: s(90),
  },
});
